import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-confirm-obsolete-dialog',
  templateUrl: './confirm-obsolete-dialog.component.html',
  styleUrls: [ './confirm-obsolete-dialog.component.scss' ]
})
export class ConfirmObsoleteDialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<ConfirmObsoleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {
  }
}
