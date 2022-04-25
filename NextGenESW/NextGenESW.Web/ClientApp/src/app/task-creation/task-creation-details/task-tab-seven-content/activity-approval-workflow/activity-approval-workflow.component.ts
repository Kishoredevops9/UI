import { ViewEncapsulation, EventEmitter } from '@angular/core';
import { Component, OnInit, Input, Output } from '@angular/core';
import data from 'src/assets/data/task-workflow.json';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface selectedActivityData {
  activityName: any;
  activityContentId: any;
  activitySubmitter: any;
  activityApprover: any;
  taskComponentId: number;
  usClassification: any;
  usJurisdiction: any;
  status: any;
}

@Component({
  selector: 'app-activity-approval-workflow',
  templateUrl: './activity-approval-workflow.component.html',
  styleUrls: ['./activity-approval-workflow.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActivityApprovalWorkflowComponent implements OnInit {
  linkComponents: boolean = false;
  linkComponents1: boolean = false;
  linkComponents2: boolean = false;
  linkComponents3: boolean = false;
  linkComponents4: boolean = false;
  docType: string = 'AP';
  selectedIndex: any;
  selectedActivities: selectedActivityData[] = new Array();

  activityArray = [];

  content: string = 'See More';
  activityStatus: any;
  @Input() selected;
  @Input() reviewData;
  @Input() isChecked;
  @Output() actvities = new EventEmitter();
  @Input() criteriaResult;
  activityForm: any;
  userEmail: string;
  userName: string;

  reviewCGForm = this.fb.group({
    taskExecutionStatementEvaluationId: 0,
    deviation: this.fb.group({
      statementEvaluationId: '',
      existingDeviationInd: '',
      deviationNumber: '',
      deviationStatusCode: ['WIP'],
      reason: [''],
      difference: [''],
      criteriaUpdateInd: [''],
      riskLevelCode: [''],
      programRiskId: [null],
      complete: [null],
      riskMitigationPlan: [''],
      taskComponentId: [],
      taskExecutionUpload: [],
    }),
    exception: this.fb.group({
      taskExecutionExceptionId: 0,
      statementEvaluationId: '',
      difference: [''],
      reason: [''],
      needUpdateInd: [''],
      updateComment: [''],
      taskComponentId: [],
      isValid: ['true'],
    }),
  });
  public cType: any =
  [
    {
      "assetTypeCode": "I",
      "code": "WI"
    },
    {
      "assetTypeCode": "WI",
      "code": "WI"
    },
    {
      "assetTypeCode": "C",
      "code": "CG"
    },
    {
      "assetTypeCode": "CG",
      "code": "CG"
    }
  ];
  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.activityForm = this.fb.group({
      checkbox1: [false],
      checkbox2: [false],
    });
  }
  ngOnChanges(event) {
    if (
      event.reviewData &&
      event.reviewData.currentValue.length > 0 &&
      event.reviewData.previousValue != event.reviewData.currentValue
    ) {
      //console.log("activity approval workflow reviewData----->", event.reviewData.currentValue);
      event.reviewData.currentValue.forEach((item) => {
        this.bindApproverData(event.reviewData.currentValue);
        this.bindReviewData(item);
      });
    }
  }

  ngOnInit() {
    data.map((item) => {
      this.activityStatus = item.activityStatus;
    });

    let userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      this.userName = (userData && userData.displayName) ? userData.displayName : '';
      this.userEmail = (userData && userData.mail) ? userData.mail.trim() : (sessionStorage.getItem('userEmail')) ? (sessionStorage.getItem('userEmail')) : '';
    }

  }

  bindApproverData(itemData) {
    itemData.forEach((element) => {
      if (element.submitterEngineer && element.submitterEngineer != null) {
        let approveData = element.submitterEngineer.split('|');
        //console.log("approveData response", approveData[0]);
        element['submitterEngineerName'] = approveData[0].trim();
        element['submitterEngineerAADID'] = approveData[1].trim();
        element['submitterEngineerEmail'] = approveData[2].trim();
      }
      if (element.approvingManager && element.approvingManager != null) {
        let approveData = element.approvingManager.split('|');
        element['approvingManagerName'] = approveData[0].trim();
        element['approvingManagerAADID'] = approveData[1].trim();
        element['approvingManagerEmail'] = approveData[2].trim();
      }
    });
  }

  toggleContent(element, item) {
    //console.log('console', item);
    item.content = item.content == 'See Less' ? 'See More' : 'See Less';
    item.linkComponents = item.linkComponents ? !item.linkComponents : true;
  }

  onChange(item, event, index) {
    console.log("onChange activity approval activity item",item);
    if (event) {
      //this.selectedActivities = [];
      this.selectedActivities.push({
        activityName: item.title,
        activityContentId: item.contentId,
        activitySubmitter: item.submitterEngineerName,
        activityApprover: item.approvingManagerEmail,
        taskComponentId: item.taskComponentId,
        usClassification: item.usClassification,
        usJurisdiction: item.usJurisdiction,
        status: event,
      });
      this.selectedActivities.sort(function (a, b) {
        return a.taskComponentId - b.taskComponentId;
      });
    } else {
      // this.selectedActivities.splice(
      //   this.selectedActivities.indexOf(item.taskComponentId, item.contentId),
      //   1
      // );
      this.selectedActivities = this.selectedActivities.filter(
        (data) => data.taskComponentId != item.taskComponentId
      );
    }

    console.log("onChange this.selectedActivities",this.selectedActivities);

    this.actvities.emit(this.selectedActivities);
  }

  navigateUrl(fragement: string, item): void {
    item.linkComponents = true;
    window.location.hash = '';
    window.location.hash = fragement;
  }

  getID($i) {
    let d = this.cType.find((node) => {
      return node.assetTypeCode == $i
    })

    return d.code
  }

  bindReviewData(reviewData) {
    let reviewDataItems = reviewData && reviewData.containerItems ? reviewData.containerItems : [];
    reviewDataItems.forEach((el) => {
      let assetStatements = el.assetStatements ? el.assetStatements : []
      assetStatements.forEach((item) => {
        this.criteriaResult.forEach((content) => {
          if (content.taskComponentId === item.taskComponentId) {
            if (
              item.assetStatementTypeCode === 'C' 
              // && content.deviation.taskComponentId > 0
            ) {
              item['reviewDataCriteriaValues'] = content;
              this.reviewCGForm.controls.deviation.patchValue({
                statementEvaluationId: content.statementEvaluationId.toString(),
                existingDeviationInd:
                  content.deviation.existingDeviationInd == true ? 'yes' : 'no',
                deviationNumber: content.deviation.deviationNumber,
                difference: content.deviation.difference,
                reason: content.deviation.reason,
                criteriaUpdateInd:
                  content.deviation.criteriaUpdateInd == true
                    ? 'true'
                    : 'false',
                riskLevelCode: content.deviation.riskLevelCode,
                riskMitigationPlan: content.deviation.riskMitigationPlan,
                programRiskId: content.deviation.programRiskId,
                deviationStatusCode:
                  content.deviation.deviationStatusCode == ''
                    ? 'WIP'
                    : content.deviation.deviationStatusCode == 'COMP'
                      ? 'Completed'
                      : content.deviation.deviationStatusCode,
                taskExecutionUpload: content.deviation.taskExecutionUpload,
                taskComponentId: content.deviation.taskComponentId,
                complete:
                  content.deviation.deviationStatusCode == 'COMP' ||
                    content.deviation.deviationStatusCode == 'Completed'
                    ? true
                    : false,
              });
            } 

            if (
              item.assetStatementTypeCode === 'B' 
              // && content.exception.taskComponentId > 0
            ) {
              item['reviewDataCriteriaBPValues'] = content;
              this.reviewCGForm.controls.exception.patchValue({
                taskExecutionExceptionId:
                  content.exception.taskExecutionExceptionId,
                taskComponentId: content.exception.taskComponentId,
                difference: content.exception.difference,
                reason: content.exception.reason,
                needUpdateInd: content.exception.needUpdateInd,
                statementEvaluationId: content.statementEvaluationId.toString(),
                updateComment: content.exception.updateComment,
              });
            } 
          }
        });
      });
    });
  }
}
