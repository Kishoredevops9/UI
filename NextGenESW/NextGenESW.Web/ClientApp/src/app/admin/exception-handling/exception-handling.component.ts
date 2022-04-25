import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkflowService } from '@app/shared/workflow.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-exception-handling',
  templateUrl: './exception-handling.component.html',
  styleUrls: [ './exception-handling.component.scss' ]
})
export class ExceptionHandlingComponent implements OnInit {
  @ViewChild(MatPaginator) paginations: MatPaginator;
  @ViewChild(MatSort) sorting: MatSort;
  loading = false;
  dataSource;
  originalData;
  selectedElement;

  totalActivitySearchRecords = 0;
  pageRowCounters = [ 10, 20, 50, 100 ];
  displayColumns = [
    'documentType',
    'contentId',
    'contentTitle',
    'contentOwner',
    'exceptionError',
    'contentAuthor',
    'classifier',
    'createdDateTime',
    'action'
  ];

  constructor(private workflowService: WorkflowService,
              private sharedService: SharedService) {
  }

  public ngOnInit(): void {
    this.getExceptionLogs();
  }

  retryWorkFlow(workFlow, index): void {
    const clockId = sessionStorage.getItem('requesterClockId');
    this.loading = true;
    this.workflowService.retryWorkFlow(workFlow.contentID, workFlow.internalID, workFlow.version, clockId).subscribe(() => {
      this.removeTableRowAt(index);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  endWorkFlow(workFlow, index): void {
    const clockId = sessionStorage.getItem('requesterClockId');
    this.loading = true;
    this.workflowService.endWorkFlow(workFlow.contentID, workFlow.internalID, workFlow.version, clockId).subscribe(() => {
      this.removeTableRowAt(index);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  private getExceptionLogs() {
    this.loading = true;
    this.workflowService.getAllExceptionLogs().subscribe((data: any[]) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginations;
      this.dataSource.sort = this.sorting;
    }, () => {
      this.loading = false;
    });
  }

  private removeTableRowAt(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }
}
