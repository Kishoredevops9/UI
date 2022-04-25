import { Component, ComponentFactory, Output, EventEmitter, ComponentFactoryResolver, HostListener, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '@app/task-creation/task-creation.model';
import { ApprovalContentComponent } from '../approval-content/approval-content.component';

@Component({
  selector: 'app-deviation-approval-dialog',
  templateUrl: './deviation-approval-dialog.component.html',
  styleUrls: ['./deviation-approval-dialog.component.scss']
})
export class DeviationApprovalDialogComponent implements OnInit {
  @Input() item: Item;
  @Input () devAppData: any;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  @Output() eksDeviationApprovalData = new EventEmitter<any>();
  @ViewChild('deviationContentDetails', { read: ViewContainerRef })
  rowContainers;
  isDeviation: boolean = false;
  title = '';
  taskReaid = '';
  expandAllChilds: boolean = false;
  devAppDisable:boolean = true;
  expanded: boolean = false;
  expandDetails: boolean = false;
  loading = false;
  public screenWidth: any;
  public screenHeight: any;
  parentList = [];
  @HostListener('window:resize', ['$event'])
  selectedList = [];
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }

  get dragDisabled(): boolean {
    return !this.parentItem;
  }

  get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }

  public allDropListsIds: string[];
  constructor(
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isDeviation = data.isDeviation;
    this.title = data.title;
    this.taskReaid = data.taskReaid;
    this.item = data.item;
    this.allDropListsIds = [];
  }

  ngOnInit(): void {
    if (this.expandAllChilds) {
      let action = '';
      this.expandChildItemDetails(this.item, action);
    }
    this.devAppDisable = this.devAppData;
  }

  expandAllChildItems(item, action, event) {
    this.expanded = !this.expanded;
    // this.expandChildItemDetails(item, action, event);
    if (action === 'collapse') {
      this.expandAllChilds = false;
    } else {
      this.expandAllChilds = true;
    }
  }

  expandChildItemDetails(item, action, event?) {
    this.expandDetails = !this.expandDetails;
    if (!this.expandDetails) {
      this.rowContainers && this.rowContainers.clear();
    } else {
      item.content.expanded = true;
      sessionStorage.setItem('documentWorkFlowStatus', 'Draft');
      sessionStorage.setItem('componentType', item.name);
      this.rowContainers && this.rowContainers.clear();
      this.parentList = [
        {
          heading: 'Deviation ID : 20ca123-D02',
          subHeading: 'System Risk',
          innerContent:
            'Design Conforms to the relevant preferred configuration, design standard,lessons learned and / or best practices documents.For redesigns consideration given to determine whether existing deviations with the baseline design will be designed out.',
        },
      ];
      const container = this.rowContainers;
      const factory: ComponentFactory<any> =
        this.resolver.resolveComponentFactory(ApprovalContentComponent);
      const inlineComponent = container.createComponent(factory);
      inlineComponent.instance.contentInfo = this.parentList;
      //item.content.expanded = false;
    }
    //event ? event.stopPropagation() : '';
  }

  handleOnRadioButton(child, event) { }

  selectedDeviationOnChange(deviationSelected: any) {
    deviationSelected.checked = true;
    this.eksDeviationApprovalData.emit(deviationSelected);
  }

  onCheckboxChange(event, item) {
    item.checked = !item.checked;
  }

  removeHTMLTags(string: any) {
    if ((string === null) || (string === ''))
      return false;
    else
      string = string.toString();
    return string.replace(/(<([^>]+)>)/ig, '');
  }

}
