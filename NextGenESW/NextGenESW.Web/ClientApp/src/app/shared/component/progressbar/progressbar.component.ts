import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit {
  @Input() progressBar: any;
  @Input() docType: string = '';
  @Input() docStatus: string = '';
  @Input() counterEnable: boolean;
  @Input() totalActvity;
  @Input() selectedActivityIndex;
  @Input() lastIndexOfActivity;
  @Input() firstIndexOfActivity;
  @Input() selectedDeviationIndex;
  @Input() lastIndexOfDeviation;
  @Input() firstIndexOfDeviation;
  @Input() deviationStatus;
  @Input() deviationGlobalStatus;
  @Input() globalThreeDots: any;

  selectedIndex: any;
  docTypeStatus: string = '';
  documentcontentType: string = '';
  progressBarData:any;
  constructor() {}
  ngOnChanges(event) {

    let progressBarList = this.progressBar ? this.progressBar : [];
    let pushData:any=[];
    progressBarList.forEach(element => {
      if(element.status !='Not Assigned' && element.status !='SendBack') {
        pushData.push(element);
      }
    });
    this.progressBarData = pushData;
    if (
      event.docType &&
      event.docType.previousValue != event.docType.currentValue
    ) {
      this.documentcontentType = event.docType.currentValue;
    }
if(this.documentcontentType == 'KP'){

  if (
    event.docStatus &&
    event.docStatus.previousValue != event.docStatus.currentValue
    && (this.globalThreeDots == false)
  ) {
    this.docTypeStatus = event.docStatus.currentValue;
  }
  if(this.globalThreeDots == true){
    this.docTypeStatus = 'Approved, Waiting for JC';
  }


}else{
  if (
    event.docStatus &&
    event.docStatus.previousValue != event.docStatus.currentValue
  ) {
    if(this.documentcontentType == 'WI' || this.documentcontentType == 'GB' || this.documentcontentType == 'DS'){
      this.docTypeStatus =  event.docStatus.currentValue;
    }
    else{
      this.docTypeStatus = event.docStatus.currentValue;
    }
    //this.docTypeStatus = event.docStatus.currentValue;
  }

}

    if(this.docTypeStatus.toLowerCase() === 'current'){
      this.docTypeStatus = 'Published';
    }


    // const sfStatus = sessionStorage.getItem('sfStatus');
    // if(sfStatus == 'published') {
    //   this.deviationGlobalStatus = false;
    //   this.counterEnable = false;
    // }

    console.log(' this.documentcontentType globalThreeDots',this.documentcontentType);
  }
  ngOnInit() {
    console.log('this.docTypeStatus',this.docTypeStatus);
    let progressBarList = this.progressBar ? this.progressBar : [];
    let pushData:any=[];
    progressBarList.forEach(element => {
      if(element.status !='Not Assigned' && element.status !='SendBack') {
        pushData.push(element);
      }
    });
    this.progressBarData = pushData;
    if (this.deviationGlobalStatus || this.deivationStatus) {
      this.deivationStatus();
    } else {
      if (this.docStatus == 'COMP' || this.docStatus == 'Completed') {
        this.docTypeStatus = 'Completed';
        this.selectedIndex = 2;
      } else if (this.docStatus == null) {
        this.docTypeStatus = 'Not Started';
        this.selectedIndex = 0;
      } else if (this.docStatus == 'WIP') {
        this.selectedIndex = 1;
      } else if (this.docStatus == 'SUBM' || this.docStatus == 'Submitted') {
        this.docTypeStatus = 'Submitted';
        this.selectedIndex = 4;
      } else if (this.docStatus == 'APP' || this.docStatus == 'Approved') {
        this.docTypeStatus = 'Approved';
        this.selectedIndex = 5;
      }
    }

    this.docTypeStatus = this.docTypeStatus
      ? this.docTypeStatus
      : sessionStorage.getItem('documentWorkFlowStatus');
    this.documentcontentType = this.documentcontentType
      ? this.documentcontentType
      : sessionStorage.getItem('componentType');

      this.docTypeStatus = (this.docTypeStatus == 'published' || this.docTypeStatus == 'Current' ) ? 'Published' :  this.docTypeStatus;
  }

  deivationStatus() {
    if (this.docStatus == 'COMP' || this.docStatus == 'Completed') {
      this.docTypeStatus = 'Completed';
      this.selectedIndex = 2;
    } else if (this.docStatus == null) {
      this.docTypeStatus = 'Not Started';
      this.selectedIndex = 0;
    } else if (this.docStatus == 'WIP') {
      this.selectedIndex = 1;
    } else if (this.docStatus == 'SUBM' || this.docStatus == 'Submitted') {
      this.docTypeStatus = 'Submitted';
      this.selectedIndex = 4;
    } else if (this.docStatus == 'SAPP') {
      this.docTypeStatus = 'Supervisor Approved';
      this.selectedIndex = 5;
    } else if (this.docStatus == 'CAPP') {
      this.docTypeStatus = 'Chief Approved';
      this.selectedIndex = 6;
    } else if (this.docStatus == 'LAPP') {
      this.docTypeStatus = 'CIPT Lead Approved';
      this.selectedIndex = 7;
    } else if (this.docStatus == 'APP') {
      this.docTypeStatus = 'Approved';
      this.selectedIndex = 8;
    }
  }
}
