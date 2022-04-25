import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import data from 'src/assets/data/task-workflow.json';
import { ViewAllDocumentsModalComponent } from '@app/task-creation/task-creation-details/task-tab-five-content/execution-list/viewAllDocumentsModal/viewAllDocumentsModal.component';
import { MatDialog } from '@angular/material/dialog';
export interface selectedDeviationActivityData {
  deviationId: any;
  taskComponentId: number;
  activityName: any;
  activityContentId: any;
  activitySubmitter: any;
  activitySubmitterEmail: any;
  activitySubmitterAADID: any;
  activityApprover: any;
  activityApproverEmail: any;
  activityApproverAADID: any;
  activityCurrentApprover: any;
  activityCurrentApproverEmail: any;
  activityCurrentApproverAADID: any;
  usClassification: any;
  usJurisdiction: any;
  status: any;
  deviationData: any;
  deviationApproverData: any;
}

@Component({
  selector: 'app-deviation-approval-workflow',
  templateUrl: './deviation-approval-workflow.component.html',
  styleUrls: ['./deviation-approval-workflow.component.scss'],
})
export class DeviationApprovalWorkflowComponent implements OnInit {
  linkComponents: boolean = false;
  content: string = 'See More';
  public screenWidth: any;
  public screenHeight: any;
  progressBar: any;
  @Input() deviationReviewData;
  @Input() isChecked;
  @Output() deviations = new EventEmitter();
  userEmail: string;
  userName: string;
  selectedDeviationActivity: selectedDeviationActivityData[] = new Array();
  docType: string = 'AP';
  disableCriteria:boolean=true;
  totalFiles: any;
  constructor(public dialog: MatDialog,) { }

  ngOnInit() {
    data.map((items) => {
      this.progressBar = items.activityWorkFlow;
    });
    let userData = JSON.parse(sessionStorage.getItem('userData'));
    this.userName = userData.displayName;
    this.userEmail = userData.mail.trim();
    console.log("deviationReviewData", this.deviationReviewData);
  }

  ngOnChanges(event) {
    if (
      event.deviationReviewData &&
      event.deviationReviewData.currentValue.length > 0 &&
      event.deviationReviewData.previousValue !=
      event.deviationReviewData.currentValue
    ) {
      //console.log("deviation approval workflow deviationReviewData----->", event.deviationReviewData.currentValue);
      event.deviationReviewData.currentValue.forEach((item) => {
        //console.log("item",item);
        this.bindApproverData(item);
      });
    }
  }

  bindApproverData(itemData: any) {
    //console.log("itemData activityDtoList", itemData);
    itemData.activityDtoList.forEach((element) => {
      let elementData = element.submittedDeviationDtoList[0];
      //console.log("elementData", elementData);
      if (elementData.initiatedBy && elementData.initiatedBy != null) {
        let initiatedByData = elementData.initiatedBy.split('|');
        elementData['InitiatedByName'] = initiatedByData[0].trim();
        elementData['InitiatedByAADID'] = initiatedByData[1].trim();
        elementData['InitiatedByEmail'] = initiatedByData[2].trim();
      }
      if (elementData.approver && elementData.approver != null) {
        let approverData = elementData.approver.split('|');
        elementData['ApproverName'] = approverData[0].trim();
        elementData['ApproverAADID'] = approverData[1].trim();
        elementData['ApproverEmail'] = approverData[2].trim();
      }
      if (elementData.disciplineChief && elementData.disciplineChief != null) {
        let disciplineChiefData = elementData.disciplineChief.split('|');
        elementData['DisciplineChiefName'] = disciplineChiefData[0].trim();
        elementData['DisciplineChiefAADID'] = disciplineChiefData[1].trim();
        elementData['DisciplineChiefEmail'] = disciplineChiefData[2].trim();
      }
      if (elementData.ciptLead && elementData.ciptLead != null) {
        let CIPTLeadData = elementData.ciptLead.split('|');
        elementData['CIPTLeadName'] = CIPTLeadData[0].trim();
        elementData['CIPTLeadAADID'] = CIPTLeadData[1].trim();
        elementData['CIPTLeadEmail'] = CIPTLeadData[2].trim();
      }
      if (elementData.programChief && elementData.programChief != null) {
        let ProgramChiefData = elementData.programChief.split('|');
        elementData['ProgramChiefName'] = ProgramChiefData[0].trim();
        elementData['ProgramChiefAADID'] = ProgramChiefData[1].trim();
        elementData['ProgramChiefEmail'] = ProgramChiefData[2].trim();
      }
      if (elementData.currentApprover && elementData.currentApprover != null) {
        let CurrentApproverData = elementData.currentApprover.split('|');
        elementData['CurrentApproverName'] = CurrentApproverData[0].trim();
        elementData['CurrentApproverAADID'] = CurrentApproverData[1].trim();
        elementData['CurrentApproverEmail'] = CurrentApproverData[2].trim();
      }
    });
  }

  toggleContent() {
    this.linkComponents = !this.linkComponents;
    if (this.linkComponents) {
      this.content = 'See Less';
    } else {
      this.content = 'See More';
    }
  }

  onChange(item, event, parentItem) {
    // console.log("onChange deviation approval activity parentItem", parentItem);
    if (event) {
      this.selectedDeviationActivity.push({
        deviationId: item.submittedDeviationDtoList[0].deviationId,
        activityName: item.title,
        activityContentId: item.contentId,
        activitySubmitter: item.submittedDeviationDtoList[0].InitiatedByName,
        activitySubmitterEmail: item.submittedDeviationDtoList[0].InitiatedByEmail,
        activitySubmitterAADID: item.submittedDeviationDtoList[0].InitiatedByAADID,
        activityApprover: item.submittedDeviationDtoList[0].ApproverName,
        activityApproverEmail: item.submittedDeviationDtoList[0].ApproverEmail,
        activityApproverAADID: item.submittedDeviationDtoList[0].ApproverAADID,
        activityCurrentApprover: item.submittedDeviationDtoList[0].CurrentApproverName,
        activityCurrentApproverEmail: item.submittedDeviationDtoList[0].CurrentApproverEmail,
        activityCurrentApproverAADID: item.submittedDeviationDtoList[0].CurrentApproverAADID,
        taskComponentId: item.submittedDeviationDtoList[0].taskComponentId,
        usClassification: item.usClassification,
        usJurisdiction: item.usJurisdiction,
        status: event,
        deviationData: parentItem,
        deviationApproverData: parentItem.activityDtoList[0].submittedDeviationDtoList
      });
    } else {
      this.selectedDeviationActivity.splice(
        this.selectedDeviationActivity.indexOf(item.contentId, item.title),
        1
      );
    }
    // console.log("this.selectedDeviationActivity", this.selectedDeviationActivity);
    this.deviations.emit(this.selectedDeviationActivity);
  }

  navigateUrl(fragement: string, item): void {
    item.linkComponents = true;
    window.location.hash = '';
    window.location.hash = fragement;
  }

  removeHTMLTags(string: any) {
    if ((string === null) || (string === ''))
      return false;
    else
      string = string.toString();
    return string.replace(/(<([^>]+)>)/ig, '');
  }

  moreDataReason(taskExecutionUploads, $arg, documentCode) {
    return taskExecutionUploads.filter((node: any) => {
      return (node.taskComponentId == $arg && node.documentTypeCode == documentCode);
    }).length;
  }

  viewAllDocuments(taskComponentId, deviationData, documentCode) {
    let filterData:any;
    if(documentCode == "all") {
      filterData = deviationData.filter(
        (item) => item.taskComponentId == taskComponentId
      );
    } else {
      filterData = deviationData.filter(
        (item) => (item.taskComponentId == taskComponentId && item.documentTypeCode == documentCode)
      );
    }

    
    this.totalFiles = filterData.length;

    if(this.totalFiles > 0) {
      const dialogRef = this.dialog.open(ViewAllDocumentsModalComponent, {
        width: '50%',
        height: 'auto',
        maxWidth: this.screenWidth + 'px',
        maxHeight: this.screenHeight + 'px',
        data: filterData,
      });
    }
    
  }

}
