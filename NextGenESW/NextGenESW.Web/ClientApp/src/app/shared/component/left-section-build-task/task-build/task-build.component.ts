import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ProcessMapsService } from '@app/process-maps/process-maps.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import {  documentPath } from '@environments/constants';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpecificStepFlowComponent } from '../specific-step-flow/specific-step-flow.component';
@Component({
  selector: 'app-task-build',
  templateUrl: './task-build.component.html',
  styleUrls: ['./task-build.component.scss']
})

export class TaskBuildComponent implements OnInit {
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 50, 100];
 
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  pageRowCounters = [10, 20, 50, 100];
  displayedColumns: string[] = ['title', 'contentid'];
  eksStepFlowData;
  private _stepflowlist: any[] = [];
  @Input() set stepflowlist(value: any[]) {
    this._stepflowlist = value;
    this.page = 1;
  }
  get stepflowlist() { return this._stepflowlist };
  public selectedMap: any;
  public masterData;
  filterForm: any = {
    "contentid": "",
    "title": ""
  }
  constructor(private mapservice: ProcessMapsService, private router: Router, public dialog: MatDialog) {
  }


  resetData() {
    this.filterForm = {
      "contentid": "",
      "title": ""
    }
    this.stepflowlist = [...this.masterData];
    this.page = 1;
  }
  filterData() {
    if (!this.masterData) {
      this.masterData = [...this.stepflowlist];
    }
    let tempData = [...this.masterData];
    this.stepflowlist = tempData.filter((node) => {
      if (this.filterForm.contentid && !this.filterForm.title) {
        return (node.contentid.toLowerCase().search(this.filterForm.contentid.trim().toLowerCase()) > -1);
      }
      if (!this.filterForm.contentid && this.filterForm.title) {
        return (node.title.toLowerCase().search(this.filterForm.title.trim().toLowerCase()) > -1);
      }
      if (this.filterForm.contentid && this.filterForm.title) {
        return (node.title.toLowerCase().search(this.filterForm.title.trim().toLowerCase()) > -1 || node.contentid.toLowerCase().search(this.filterForm.contentid.toLowerCase()) > -1);
      }
      else {
        return true;
      }
    })
    this.page = 1;
  }
  ngOnInit(): void {
    if (this.stepflowlist) {
      this.masterData = [...this.stepflowlist]
      this.filterData();
    }
  }
  addPvtSF() {
    const dialogRef = this.dialog.open(SpecificStepFlowComponent,
      {
        height: '280px',
        width: '500px'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  setRadio(item) {
    this.stepflowlist.map((node) => {
      if (node.contentnumber == item.contentnumber) {
        node.checked = true;
      }
      else {
        node.checked = false;
      }
    })
  }
  addToSelected() {
    let selectedMap = this.stepflowlist.filter((node) => {
      return node.checked
    })
    this.selectedMap = [...selectedMap]
    this.stepflowlist = this.stepflowlist.filter((node) => {
      return !node.checked
    })
  }
  handlePageChange(event): void {
    this.page = event;   
  }
  handlePageSizeChange(event): void {
    this.pageSize = event.target.value;
    this.page = event;
  }
  openSF(element) {
    console.log("openContent", element);
    const pwStatus = 'published';
    sessionStorage.setItem('documentId', element.CID);
    sessionStorage.setItem('documentversion', element.version);
    sessionStorage.setItem('documentcontentType', "SF");
    sessionStorage.setItem('documentWorkFlowStatus', pwStatus);
    sessionStorage.setItem('documentcontentId', element.contentid);
    sessionStorage.setItem('documentcurrentUserEmail', element.creatorClockId);
    sessionStorage.setItem('contentNumber', element.contentid);
    sessionStorage.setItem('componentType', "SF");
    sessionStorage.setItem('redirectUrlPath', 'dashboard');
    sessionStorage.setItem('sfcontentId', element.contentid);
    sessionStorage.setItem('sfversion', element.version);
    sessionStorage.setItem('sfID', element.CID);
    element.pwStatus && (pwStatus === 'published')
      ? sessionStorage.setItem('documentStatusDetails', 'published')
      : sessionStorage.setItem('documentStatusDetails', 'draft');
    element.pwStatus && (pwStatus === 'published')
      ? sessionStorage.setItem('statusCheck', 'true')
      : sessionStorage.setItem('statusCheck', 'false');
    element.pwStatus && (pwStatus === 'published')
      ? sessionStorage.setItem('contentType', 'published')
      : sessionStorage.setItem('contentType', 'draft');
    element.pwStatus && (pwStatus === 'published')
      ? sessionStorage.setItem('sfStatus', 'published')
      : sessionStorage.setItem('sfStatus', 'published');
    if (
      element.documentType == 'sf' || element.documentType == 'SF' ||
      element.assettypecode == "F" || element.componenttype == "Step Flow" ||
      element.contenttypename == "Step Flow"
    ) {
      let documentType = 'SF';
      console.log(documentPath.publishViewPath, documentType, element.contentid);

      window.open(documentPath.publishViewPath + '/' + documentType + '/' + element.contentid, '_blank');
    }
  }
}
