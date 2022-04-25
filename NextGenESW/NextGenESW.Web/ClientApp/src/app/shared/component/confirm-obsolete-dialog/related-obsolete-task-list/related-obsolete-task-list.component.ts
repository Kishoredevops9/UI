import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-related-obsolete-task-list',
  templateUrl: './related-obsolete-task-list.component.html',
  styleUrls: [ './related-obsolete-task-list.component.scss' ]
})
export class RelatedObsoleteTaskListComponent {
  @Input() taskList;
  displayedContentColumns: string[] = [
    'taskReaid',
    'title',
    'engineModelTagId',
    'engineSectionDescription'
  ];
  emptyData = new MatTableDataSource([ { empty: 'row' } ]);

  taskNavigate(element) {
    window.open(`/task/edit-task/${ element.id }`, '_blank');
  }
}
