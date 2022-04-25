import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, Injectable, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatSelectItem, SelectItem } from '@app/shared/models/common';
import { isEqualVerify } from '@app/shared/utils/common';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { filterLeafNode, filterParentNode } from './select-item-list.utils';

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null,
    },
  },
  Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<SelectItem[]>([]);

  get data(): SelectItem[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `SelectItem` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `SelectItem`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): SelectItem[] {
    return Object.keys(obj).reduce<SelectItem[]>((accumulator, key) => {
      const value = obj[key];
      const node = new SelectItem();
      node.label = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.label = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: SelectItem, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as SelectItem);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: SelectItem, name: string) {
    node.label = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-select-item-list',
  templateUrl: './select-item-list.component.html',
  styleUrls: ['./select-item-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    ChecklistDatabase,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectItemListComponent
    }
  ],
})
export class SelectItemListComponent implements ControlValueAccessor {
  onChange = (seletedItems) => { };
  onTouched = () => { };
  touched = false;
  disabled = false;
  expandedNodes: FlatSelectItem[] = [];

  filterLeafNode = filterLeafNode;
  filterParentNode = filterParentNode;
  filterTextBSub = new BehaviorSubject<string>('');
  filterText$ = this.filterTextBSub.asObservable()
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(filterText => this.toggleView(!!filterText))
    )

  _selectedValues: any[] = [];
  get selectedValues() { return this._selectedValues };
  set selectedValues(value: any[]) {
    this._selectedValues = value;
  }

  @Input() withSearchFilter = false;
  @Input() withParentSelectable = false;
  @Input() multiple = false;
  // When independentMode is enabled, the selection status
  // of a node will no affect the selections of its descendants
  @Input() independentMode = false;
  @Input() itemRenderer!: TemplateRef<HTMLElement>;
  private _items: SelectItem[] = []
  @Input() get items() { return this._items }
  set items(value: SelectItem[] | null) {
    this._items = value || [];
    this.saveExpandedNodes();
    this.dataSource.data = this._items;
    this.restoreExpandedNodes();
    this.updateSelection();
  }

  toggleView(expanded = true) {
    if (expanded) {
      this.treeControl.expandAll()
    } else {
      this.treeControl.collapseAll()
    }
  }

  updateSelection() {
    const sltValues = this.selectedValues;
    const prevSelectedItems = this.checklistSelection.selected;
    const toSelectItems = this.treeControl.dataNodes
      .filter(node => node.selectable !== false && sltValues.includes(node.value))
    this.checklistSelection.deselect(...prevSelectedItems);
    this.checklistSelection.select(...toSelectItems);
  }

  saveExpandedNodes() {
    const currNodes = this.treeControl.dataNodes || [];
    this.expandedNodes = new Array<FlatSelectItem>();
    currNodes.forEach(node => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
  }

  restoreExpandedNodes() {
    this.expandedNodes.forEach(node => {
      this.treeControl.expand(this.treeControl.dataNodes.find(n => {
        const toCompareField = node.value == null ? 'label' : 'value';
        return n[toCompareField] === node[toCompareField];
      }))
    })
  }


  onClickNodeLabel(node: FlatSelectItem) {
    const { multiple, independentMode, checklistSelection } = this;

    // In multiple mode or node is not selectable => do nothing
    if (multiple || (node.selectable === false)) return;

    // When click on parent node but not in independentMode => do nothing
    if (node.nbChildren && !independentMode) return;

    // When in independentMode or the clicked node is leaf one    
    checklistSelection.deselect(...checklistSelection.selected);
    checklistSelection.select(node);
  }

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FlatSelectItem, SelectItem>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<SelectItem, FlatSelectItem>();

  /** A selected parent node to be inserted */
  selectedParent: FlatSelectItem | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<FlatSelectItem>;

  treeFlattener: MatTreeFlattener<SelectItem, FlatSelectItem>;

  dataSource: MatTreeFlatDataSource<SelectItem, FlatSelectItem>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatSelectItem>(true /* multiple */);

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<FlatSelectItem>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.checklistSelection.changed
      .pipe(debounceTime(300))
      .subscribe(_ => {
        console.log(this.checklistSelection.selected);
        const newSelectedValues = this.checklistSelection.selected
          .filter(item => !item.nbChildren || this.independentMode || this.withParentSelectable)
          .map(item => item.value);
        if (!isEqualVerify(this.selectedValues, newSelectedValues)) {
          this.selectedValues = newSelectedValues;
          this.onChange(this.multiple ? newSelectedValues : newSelectedValues[0]);
        }
      })
  }

  writeValue(value: any) {
    this.selectedValues = this.multiple
      ? (value || [])
      : value != null ? [value] : [];
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }


  getLevel = (node: FlatSelectItem) => node.level;

  isExpandable = (node: FlatSelectItem) => node.expandable;

  getChildren = (node: SelectItem): SelectItem[] => node.children;

  hasChild = (_: number, _nodeData: FlatSelectItem) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FlatSelectItem) => _nodeData.label === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: SelectItem, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode: FlatSelectItem = existingNode && existingNode.label === node.label
      ? existingNode
      : new FlatSelectItem();
    flatNode.label = node.label;
    flatNode.value = node.value;
    flatNode.level = level;
    flatNode.data = node.data;
    flatNode.selectable = node.selectable;
    flatNode.nbChildren = node.children?.length || 0;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatSelectItem): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatSelectItem): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FlatSelectItem, $event: any): void {
    this.checklistSelection.toggle(node);
    if (!this.independentMode) {
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);

      // Force update for the parent
      descendants.forEach(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
    }
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FlatSelectItem): void {
    this.checklistSelection.toggle(node);
    !this.independentMode && this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatSelectItem): void {
    let parent: FlatSelectItem | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatSelectItem): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: FlatSelectItem): FlatSelectItem | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}