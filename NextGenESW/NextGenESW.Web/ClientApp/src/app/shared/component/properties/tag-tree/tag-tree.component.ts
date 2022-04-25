
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { FoodNode } from '../properties.model';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { TodoItemFlatNode } from '@app/create-document/create-document.model';

@Component({
  selector: 'app-tag-tree',
  templateUrl: './tag-tree.component.html',
  styleUrls: ['./tag-tree.component.scss']
})
export class TagTreeComponent implements OnInit {
  nodePathTag: any;
  @Output() selectedTagCodes = new EventEmitter();
  @Input() tags: any;
  @Input() selectedTagData: any;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  private subscription: Subscription;
  selectedTag = {};
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  constructor() {
  }

  ngOnInit(): void {
    console.log('SelectedDiscipline ', this.selectedTagData);
    if (this.tags) {
      this.dataSource.data = this.tags;
      Object.keys(this.dataSource.data).forEach(x => {
        this.setParent(this.dataSource.data[x], null);
      });

      this.dataSource.data.forEach(node => {
        this.disbaleParents(node);
      });

    }
  if (this.selectedTagData != undefined) {
      this.selectedTag['disciplineId'] = this.selectedTagData.disciplineId;
      this.selectedTag['subDisciplineId'] = this.selectedTagData.subDisciplineId;
      this.selectedTag['subSubDisciplineId'] = this.selectedTagData.subSubDisciplineId;
      this.selectedTag['subSubSubDisciplineId'] = this.selectedTagData.subSubSubDisciplineId;
      this.checkAllParentsSelectionForBind(this.selectedTag);
     // this.selectedDiCodes.emit(this.selectedTag);
    }
    this.nodePathTag = '';
  }

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;


  setParent(data, parent) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }


  checkAllParents(node) {
    if (node.parent) {
      this.nodePathTag = node.parent.name + ' > ' + this.nodePathTag;
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }

  todoItemSelectionToggle(checked, node) {
    console.log(node);
    this.checkAllParentsSelection(node);
    node.selected = checked;
    this.nodePathTag = node.name;
    this.checkAllParents(node);
     this.selectedTag['nodePath'] = this.nodePathTag;
    
    

    if (node.parent && node.parent.parent && node.parent.parent.parent) {
      this.selectedTag['disciplineId'] = node.parent.parent.parent.id;
      this.selectedTag['subDisciplineId'] = node.parent.parent.id;
      this.selectedTag['subSubDisciplineId'] = node.parent.id;
      this.selectedTag['subSubSubDisciplineId'] = node.id;
    } else if (node.parent && node.parent.parent) {
      this.selectedTag['disciplineId'] = node.parent.parent.id;
      this.selectedTag['subDisciplineId'] = node.parent.id;
      this.selectedTag['subSubDisciplineId'] = node.id;
    } else if (node.parent) {
      this.selectedTag['disciplineId'] = node.parent.id;
      this.selectedTag['subDisciplineId'] = node.id;
    } else {
      this.selectedTag['disciplineId'] = node.id;
    }
    this.selectedTagCodes.emit(this.selectedTag);
  }

  disbaleParents(node) {
    if (node.children.length > 0) {
      node.disabled = true;
      node.children.forEach((c1) => {
        if (c1.children.length > 0) {
          c1.disabled = true;
          c1.children.forEach((c2) => {
            if (c2.children.length > 0) {
              c2.disabled = true;
              c2.children.forEach((c3) => {
                c3.disabled = false;
              })
            } else {
              c2.disabled = false;
            }
          })
        } else {
          c1.disabled = false;
        }
      })
    } else {
      node.disabled = false;
    }
  }

  deselectAllNodes(node) {
    if (node) {
      node.selected = false;
      node.indeterminate = false;
      if (node.children.length > 0) {
        node.children.forEach((c1) => {
          c1.selected = false;
          c1.indeterminate = false;
          if (c1.children.length > 0) {
            c1.children.forEach((c2) => {
              c2.selected = false;
              c2.indeterminate = false;
              if (c2.children.length > 0) {
                c2.children.forEach((c3) => {
                  c3.selected = false;
                  c3.indeterminate = false;
                })
              }
            })
          }
        })
      }
    }
  }
  // deSelectAll() {
  //   for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
  //     if (this.treeControl.getDescendants(this.treeControl.dataNodes[i])) {
  //       this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
  //     this.treeControl.expand(this.treeControl.dataNodes[i])
  //     }
  //   }
  // }

  checkAllParentsSelection(node) {
    if (node) {
      this.dataSource.data.forEach(node => {
        this.deselectAllNodes(node);
      });
    }
  }

  
  selectAllNodesForBind(node) {

    if (node.id == this.selectedTagData.disciplineId) {
      if (node.children.length) {
        node.indeterminate = true;

        node.children.forEach((c1) => {
          if (c1.id == this.selectedTagData.subDisciplineId) {
            if (c1.children.length) {
              c1.indeterminate = true;
              c1.children.forEach((c2) => {
                if (c2.id == this.selectedTagData.subSubDisciplineId) {
                  if (c2.children.length) {
                    c2.indeterminate = true;
                  } else {
                     //c2.selected = true;
                    //c2.checklistSelection.select;
                    this.checklistSelection.select(c2);
                  }


                }
                if (c2.id == this.selectedTagData.subSubSubDisciplineId) {
                  if (c2.children.length) {
                    c2.indeterminate = true;
                  } else {
                  //  c2.selected = true;
                  this.checklistSelection.select(c2);
                   // this.checklistSelection.toggle(c2,true);
                  }


                }
              })
            } else {
              c1.selected = true;
            }


          }
        })
      } else {
        node.selected = true;
      }

    }


  }



  checkAllParentsSelectionForBind(node) {
    if (node) {
      this.dataSource.data.forEach(node => {
        this.selectAllNodesForBind(node);
      });
    }
  }
}
