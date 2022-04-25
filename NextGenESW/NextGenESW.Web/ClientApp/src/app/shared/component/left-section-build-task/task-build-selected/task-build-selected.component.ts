import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { documentPath } from '@environments/constants';
import { Router, ActivatedRoute } from '@angular/router';
 
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

import { SharedService } from '@app/shared/shared.service';
import { EksaddonspopupComponent } from '@app/activity-page/activity-details/activity-components/eksaddonspopup/eksaddonspopup.component';
import { AddNewStepComponent } from '../add-new-step/add-new-step.component';
interface FoodNode {
  name: string;
  rowNo: number;
  children?: FoodNode[];
  parentId: number;
  selectable: boolean;
}

import { ReleasePopupComponent } from '../release-popup/release-popup.component';
import { NewActivityPopupComponent } from '../new-activity-popup/new-activity-popup.component';
import { AddDisciplinePopupComponent } from '../add-discipline-popup/add-discipline-popup.component';
import { TooltipDict } from '@app/shared/utils/app-settings';
export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-task-build-selected',
  templateUrl: './task-build-selected.component.html',
  styleUrls: ['./task-build-selected.component.scss'],
})
export class TaskBuildSelectedComponent implements OnInit {
  TooltipDict = TooltipDict
  deleteEventOption: any;
  someComplete: any = false;
  @Input() selectedMapsInput;
  fullscreen: boolean;
  loading: boolean;
  selectedMaps: any = [];
  selectedMapss: any = [];
  public idArray: any = [];
  disciplineList: FoodNode[] = [];
  public activeBlock: any = {};
  stObj: any = {

    "A": "A",
    "C": "CG",
    "SF": "SF",
    "SP": "SP",
    "G": "GB",
    "I": "WI",
    "K": "KP",
    "M": "PM",
    "S": "DS",
    "R": "RC",
    "D": "D",
    "T": "TC"

  }

  public cType: any =
    [
      {
        "contentTypeId": 0,
        "name": "Work Instructions",
        "code": "C",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 1,
        "name": "Work Instructions",
        "code": "WI",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 2,
        "name": "Guide Book",
        "code": "GB",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 3,
        "name": "Design Standards",
        "code": "DS",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 4,
        "name": "ProcessMaps",
        "code": "M",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 5,
        "name": "Refernce Doc",
        "code": "RD",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 6,
        "name": "Activity Page",
        "code": "AP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 7,
        "name": "Video",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 8,
        "name": "Tasks",
        "code": null,
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 9,
        "name": "Knowledge Pack",
        "code": "KP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 10,
        "name": "Criteria Group",
        "code": "CG",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 11,
        "name": "Table Of Content",
        "code": "TOC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 12,
        "name": "Related Content",
        "code": "RC",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 13,
        "name": "Step Flow",
        "code": "SF",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      },
      {
        "contentTypeId": 14,
        "name": "Step",
        "code": "SP",
        "status": null,
        "createdOn": null,
        "creatorClockID": null,
        "modifiedOn": null,
        "modifierClockID": null
      }
    ];

  constructor(
    public TaskCrationPageService: TaskCrationPageService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private mapservice: ProcessMapsService,
    public dialog: MatDialog,
    public SharedService: SharedService,
 
    @Inject(DOCUMENT) private document: Document
  ) {
    this.SharedService.initSelectedBuildTask.subscribe((data) => {
      this.saveFromLeft(data)
    })
    this.SharedService.electedEKSreload.subscribe((data) => {
      this.reloadData(data)
    })
    this.SharedService.chipmessage.subscribe((node) => {
      this.exitfullScreen()
    });

  }

  saveFromLeft(data) {
    console.count("savefromleft call")
    this.loading = true;
    data.version = (data.version==null)?1:data.version;
    this.TaskCrationPageService.addBrowseStepFlow(data).subscribe((data) => {

      console.log(data);


      this.reloadData({
        "id" : null

      })
          
     },
      err => {
        this._snackBar.open("Selected Step Flow ContentID is Invalid. Please contact Admin Team","Close");
        this.loading = false;
        console.log(err); 
      

      
      }

    )
  }
  fullScreen() {
    this.document.body.classList.add('taskfullscreen');
    this.fullscreen = true;
  }

  moveToScreen() {
    this.SharedService.sendMessage.emit({
      "time": 1,
      "tabindex": 3
    })
  }

  exitfullScreen() {
    this.document.body.classList.remove('taskfullscreen');
    this.fullscreen = false
  }

  addDisciplineSF(item) {
    console.log("addDisciplineSF", item);
    const dialogRef = this.dialog.open(AddDisciplinePopupComponent, {
      height: '215px',
      width: '500px',
      data: item
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'SAVE') {
        this.reloadData(item);
      }
    });
  }

  releaseSF(item) {
    let taskProcessId = parseInt(window.location.href.split('/').pop());
    item.taskID = taskProcessId;
    const dialogRef = this.dialog.open(ReleasePopupComponent,
      {
        height: '180px',
        width: '500px',
        data: item
      });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("releaseSF", result);
      if (result == 'SAVE') {
        this.reloadData(item);
      }
    });
  }

  reloadData(item) {
    let taskProcessId = parseInt(window.location.href.split('/').pop());
    let taskFlagCheck = isNaN(parseInt(window.location.href.split('/').pop()))
      ? false
      : true;
    if (taskFlagCheck) {
      this.loading = true;
      this.TaskCrationPageService.getalltaskmapsbytaskid(
        taskProcessId
      ).subscribe((node) => {
        console.log('reloadData:ngOnInit', node);
        console.log(item)
        this.selectedMapss = node;
        this.selectedMapss.map((node) => {
          if (node.id == item.id) {
            node.active = true;
          }
        })

      });
    }

    this.TaskCrationPageService.gettaskstepflowbytaskid(taskProcessId).subscribe((node: any) => {

      // this.selectedMaps = node['Tasks'][0]['StepFlows'];
      // console.log('gettaskstepflowbytaskid', this.selectedMaps);
      let getData: any = node['Tasks'][0]['StepFlows'] || [];
      let pushData: any = [];
      getData.forEach(function (item: any) {
        let stepData: any = item.Steps ? item.Steps : [];
        stepData.forEach(function (step: any) {
          let swimData: any = step.Disciplines ? step.Disciplines : [];
          step['stepFlowId'] = item.KnowledgeAssetId;
          step['stepId'] = step.KnowledgeAssetId;
          swimData.forEach(function (sItem: any) {
            sItem['stepFlowId'] = item.KnowledgeAssetId;
            sItem['stepId'] = step.KnowledgeAssetId;
            let activityData: any = sItem.Activities ? sItem.Activities : [];
            activityData.forEach(function (aItem: any) {
              let ActProtectedInd: boolean;
              if (aItem.ContentId) {
                let actsplit = aItem.ContentId.split("-");
                let actsplice = actsplit.slice(-1)[0];
                ActProtectedInd = actsplice.length <= 6 ? true : false;
              }
              aItem['stepFlowId'] = item.KnowledgeAssetId;
              aItem['actProtectedInd'] = ActProtectedInd;
            });
          });
        });
        pushData.push(item);
      });
      this.selectedMaps = pushData;
      this.loading = false;
      this.selectedMapss.map((node) => {
        if (node.id == item.id) {
          this.activeBlock[node.TaskComponentId] = true
        }
      })
    })
  }

  checkIdes($value) {
    if ($value && $value.length) {
      let aLength = this.idArray.filter(element => $value.includes(element));
      if (aLength.length) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  getIdes($item) {
    var $id = [];
    if ($item.Phases && $item.Tags) {
      $item.Phases.concat($item.Tags).map((node: any) => {
        if (node.hasOwnProperty('PhaseId')) {
          $id.push(node.PhaseId)
        }
        if (node.hasOwnProperty('TagId')) {
          $id.push(node.TagId)
        }
      })
      return $id;
    }
    else {
      return 0
    }
  }

  dasArray() {

    let tempArray = []
    this.disciplineList.map((node) => {

      tempArray.push(node.name)

    })
    return tempArray;

  }

  checkD($item) {
    let darray = this.dasArray()
    if (
      darray.indexOf($item.Discipline1) > -1 ||
      darray.indexOf($item.Discipline2) > -1 ||
      darray.indexOf($item.Discipline3) > -1 ||
      darray.indexOf($item.Discipline4) > -1
    ) {
      return true
        }
    else {
      return false;
    }
  }

  ngOnInit(): void {
    console.log("Init call task build selected")
    // let taskFlagCheck = isNaN(parseInt(window.location.href.split('/').pop()))
    //   ? false
    //   : true;
    // if (taskFlagCheck) {
    //   this.loading = true;
    //   let taskProcessId = parseInt(window.location.href.split('/').pop());
    //   this.TaskCrationPageService.getalltaskmapsbytaskid(
    //     taskProcessId
    //   ).subscribe((node) => {
    //     this.selectedMapss = node;
    //     this.loading = false;
    //   });
    // }

    this.reloadData({"id":null})
    // let taskId = parseInt(window.location.href.split("/").pop())
    // this.TaskCrationPageService.gettaskstepflowbytaskid(taskId).subscribe((node: any) => {
    //   // this.selectedMaps = node['Tasks'][0]['StepFlows'];
    //   // console.log("this.selectedMaps:::1" , this.selectedMaps);

    //   let getData: any = node['Tasks'][0]['StepFlows'];
    //   let pushData: any = [];
    //   getData.forEach(function (item: any) {
    //     let stepData: any = item.Steps ? item.Steps : [];
    //     stepData.forEach(function (step: any) {
    //       let swimData: any = step.Disciplines ? step.Disciplines : [];
    //       step['stepFlowId'] = item.KnowledgeAssetId;
    //       step['stepId'] = step.KnowledgeAssetId;
    //       swimData.forEach(function (sItem: any) {
    //         sItem['stepFlowId'] = item.KnowledgeAssetId;
    //         sItem['stepId'] = step.KnowledgeAssetId;
    //         let activityData: any = sItem.Activities ? sItem.Activities : [];
    //         activityData.forEach(function (aItem: any) {
    //           let ActProtectedInd: boolean;
    //           if (aItem.ContentId) {
    //             let actsplit = aItem.ContentId.split("-");
    //             let actsplice = actsplit.slice(-1)[0];
    //             ActProtectedInd = actsplice.length <= 6 ? true : false;
    //           }
    //           aItem['stepFlowId'] = item.KnowledgeAssetId;
    //           aItem['actProtectedInd'] = ActProtectedInd;
    //         });
    //       });
    //     });
    //     pushData.push(item);
    //   });
    //   this.selectedMaps = pushData;

    //   console.log("this.selectedMaps", this.selectedMaps);

    // })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedMapsInput && changes.selectedMapsInput.currentValue) {
      changes.selectedMapsInput.currentValue.forEach((element) => {
        let taskId = parseInt(window.location.href.split('/').pop());

        let Obj = {
          taskId: taskId,
          knowledgeAssetId: element.contentnumber,
          sequenceNumber: this.selectedMaps.length + 1,
          knowledgeAssetTitle: element.title,
          contentId: element.contentid,
        };
        //console.log(Obj);
        //console.log(element);
        this.loading = true;
        this.TaskCrationPageService.createtaskmap(Obj).subscribe(
          (data) => {
            element.id = data['id'];
            this.selectedMaps.push(element);
            this.loading = false;
            this.ngOnInit()
          },
          (err) => {
            this._snackBar.open(
              `Entry already exists with   contentid  ${element.contentid}`,
              '',
              {
                duration: 1500,
              }
            );
            this.loading = false;
            this.ngOnInit()
          }
        );
      });
    }
  }

  checkAllCheckBox() {
    let scount = this.selectedMaps.filter((node) => {
      return node.removable;
    }).length;

    if (this.selectedMaps.length == scount) {
      this.deleteEventOption = true;
    } else {
      this.deleteEventOption = false;
    }

    if (this.selectedMaps.length != scount && scount) {
      this.someComplete = true;
    } else {
      this.someComplete = false;
    }
  }

  changeStatus() {
    this.checkAllCheckBox();
  }

  showOptions($event) {
    this.selectedMaps.map((node) => {
      node.removable = $event.checked;
    });
  }

  clearAll() {
    this.selectedMaps.map((node) => {
      node.removable = false;
    });
    this.checkAllCheckBox();
  }

  removeSelected() {
    let copyNode = [...this.selectedMaps];

    copyNode.forEach((node, i) => {
      if (node.removable) {
        this.TaskCrationPageService.deletetaskmap(node.id).subscribe(() => {
          //console.log(node);
          this._snackBar.open(`Delete content id ${node.contentId} `, '', {
            duration: 1500,
          });
        });
      }
    });

    this.selectedMapss = copyNode.filter((node) => {
      return !node.removable;
    });

    this.someComplete = false;
  }

  deleteSFNEWJSON($element) {

    console.log($element)
    $element['id'] = $element['KnowledgeAssetId'];
    $element['contentId'] = $element['ContentId'];
    console.log($element)

    this.TaskCrationPageService.checktaskmapisabletodelete($element).subscribe(
      (node: any) => {
        if (node.isAbleToDelete) {
          const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
              message: node.message,
            },
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.loading = true;
              this.TaskCrationPageService.deletetaskmap($element.TaskMapId).subscribe(
                (data: any) => {
                  this.selectedMapss = this.selectedMaps.filter((node) => {
                    return node.id != $element.id;
                  });
                  this.loading = false;
                }
              );
            }
          });
        } else {
          // alert(node.message)
          this.dialog.open(DialogDeleteAlert, {
            data: {
              message: node.message,
            },
          });
        }
      }
    );

  }

  deleteSF($element) {
    //console.log($element)

    this.TaskCrationPageService.checktaskmapisabletodelete($element).subscribe(
      (node: any) => {
        if (node.isAbleToDelete) {
          const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
              message: node.message,
            },
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.loading = true;
              this.TaskCrationPageService.deletetaskmap($element.id).subscribe(
                (data: any) => {
                  this.selectedMapss = this.selectedMaps.filter((node) => {
                    return node.id != $element.id;
                  });
                  this.loading = false;
                }
              );
            }
          });
        } else {
          // alert(node.message)
          this.dialog.open(DialogDeleteAlert, {
            data: {
              message: node.message,
            },
          });
        }
      }
    );
  }

  addActivitySF(item) {
    item['taskId'] = parseInt(window.location.href.split("/").pop());
    this.dialog.open(NewActivityPopupComponent,
      {
        height: '280px',
        width: '500px',
        data: item
      });
  }

  addAddOns(data) {
    console.log(data)
    const dialogRef = this.dialog.open(EksaddonspopupComponent, {
      width: '90%',
      // height: '85%',
      maxWidth: '100%',
      panelClass: 'pr',
      data: {
        activity: data,
        ctContentId: '',
        ctTitle: '',
        ctDescription: '',
        type: '',
        message: 'ADD ONS',
        showEksPanel: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("result", result);
      if (result && result !== 'No') {
        // let getData:any = result;
        // let pushData : any = [];
        // getData.forEach(function(item: any){
        //   let tableModel: any = {
        //     activityPageId: data.KnowledgeAssetId,
        //     assetContentId : item.contentid,
        //     createdUser: sessionStorage.getItem('userMail'),
        //   };
        //   pushData.push(tableModel);
        // });    

        // const param = {
        //   taskId: parseInt(window.location.href.split("/").pop()),
        //   stepFlowId: data.stepFlowId,
        //   containerItems: pushData
        // }
        // this.loading = true;   
        // this.TaskCrationPageService.createtaskspecificcontainer(param).subscribe(res => {    
        //   this.loading = false;
        //   this.SharedService.electedEKSreload.emit(data)   
        // },(error) =>{
        //   this.loading = false;   
        // })

      }
    });
  }

  addNewStep(item) {
    console.log("xxxxxxxxxxxxxxxx addNewStep")
    console.log(item)
    console.log("xxxxxxxxxxxxxxxx")

    this.dialog.open(AddNewStepComponent,
      {
        //height: '427px', //height: '547px',
        width: '670px',
        data: item
      });
  }

  addNewStepnewJson(item) {

    item['taskId'] = parseInt(window.location.href.split("/").pop());
    item['knowledgeAssetId'] = item.TaskMapId

    console.log("xxxxxxxxxxxxxxxx addNewStepnewJson")
    console.log(item)
    console.log("xxxxxxxxxxxxxxxx")

    this.dialog.open(AddNewStepComponent,
      {
        //height: '427px', //height: '547px',
        width: '670px',
        data: item
      });
  }

  openSF(element, type: string) {
    const pwStatus = 'published';
    sessionStorage.setItem('documentId', element.CID);
    sessionStorage.setItem('documentversion', element.version);
    sessionStorage.setItem('documentcontentType', 'SF');
    sessionStorage.setItem('documentWorkFlowStatus', pwStatus);
    sessionStorage.setItem('documentcontentId', element.OriginContentId);
    sessionStorage.setItem('documentcurrentUserEmail', element.createdUser);
    sessionStorage.setItem('contentNumber', element.OriginContentId);
    sessionStorage.setItem('componentType', 'SF');
    sessionStorage.setItem('redirectUrlPath', 'dashboard');
    sessionStorage.setItem('sfcontentId', element.OriginContentId);
    sessionStorage.setItem('sfversion', element.version);
    sessionStorage.setItem('sfID', element.CID);
    element.pwStatus && pwStatus === 'published'
      ? sessionStorage.setItem('documentStatusDetails', 'published')
      : sessionStorage.setItem('documentStatusDetails', 'draft');
    element.pwStatus && pwStatus === 'published'
      ? sessionStorage.setItem('statusCheck', 'true')
      : sessionStorage.setItem('statusCheck', 'false');
    element.pwStatus && pwStatus === 'published'
      ? sessionStorage.setItem('contentType', 'published')
      : sessionStorage.setItem('contentType', 'draft');
    element.pwStatus && pwStatus === 'published'
      ? sessionStorage.setItem('sfStatus', 'published')
      : sessionStorage.setItem('sfStatus', 'published');

    let documentType = type == 'SP' ? 'SP' : 'SF';
    //console.log(documentPath.publishViewPath, documentType, element.contentId);
    // this.router.navigate([ documentPath.publishViewPath, documentType, element.contentid ]);
    window.open(
      documentPath.publishViewPath +
      '/' +
      documentType +
      '/' +
      element.OriginContentId,
      '_blank'
    );
  }

  handleOnContentIDClick(item) {
    let data = item;
    let element = item.ContentId;
    let assetcode = element.split('-')
    let assettypecode = assetcode[1];
    let contentType = (assettypecode == "I") ? "WI" : (assettypecode == "G") ? "GB" : (assettypecode == "S") ? "DS" : (assettypecode == "A") ? "AP" : (assettypecode == "C") ? "CG" : (assettypecode == "K") ? "KP" : (assettypecode == "R") ? "RC" : (assettypecode == "T") ? "TOC" : '';
    sessionStorage.setItem('componentType', contentType);
    sessionStorage.setItem('contentNumber', data.ContentId);
    sessionStorage.setItem('contentType', 'published');
    sessionStorage.setItem('redirectUrlPath', 'search');
    sessionStorage.setItem('statusCheck', 'true');

    if (assettypecode == 'I' || assettypecode == 'G' || assettypecode == 'S' || assettypecode == 'D') {
      window.open(documentPath.publishViewPath + '/' + data.ContentId, '_blank');
    } else if (assettypecode === 'M' || assettypecode === 'Map') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else if (assettypecode === 'F' || assettypecode === 'SF') {
      this.router.navigate(['/process-maps/edit', data.id]);
    } else {
      var assetTypecode = (assettypecode === 'A') ? "AP" : (assettypecode === 'K') ? "KP" : (assettypecode === 'T') ? "TOC" : (assettypecode === 'R') ? "RC" : (assettypecode === 'C') ? "CG" : (assettypecode === 'F') ? "SF" : '';
      //  this.router.navigate([documentPath.publishViewPath, assetTypecode, data.assetContentId]);
      window.open(documentPath.publishViewPath + '/' + assetTypecode + '/' + data.ContentId, '_blank');

    }
  }

}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: `<div class="dbox">
    <h1 mat-dialog-title></h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        class="mat-button"
        color="primary"
        (click)="closeBox()"
      >
        Close
      </button>
    </div>
  </div>`,
  styleUrls: ['./task-build-selected.component.scss'],
})
export class DialogDeleteAlert {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<DialogDeleteAlert>
  ) { }

  closeBox() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-confirm-example-dialog',
  template: `<div class="dbox">
    <h1 mat-dialog-title></h1>
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button
        mat-button
        class="mat-button"
        mat-raised-button
        color="primary"
        (click)="closeBox(true)"
      >
        Delete
      </button>
      &nbsp; &nbsp;
      <button
        mat-button
        class="mat-button"
        mat-raised-button
        color="primary"
        (click)="closeBox(false)"
      >
        Close
      </button>
    </div>
  </div>`,
  styleUrls: ['./task-build-selected.component.scss'],
})
export class ConfirmationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<DialogDeleteAlert>
  ) { }

  closeBox(arg) {
    this.dialogRef.close(arg);
  }
}
