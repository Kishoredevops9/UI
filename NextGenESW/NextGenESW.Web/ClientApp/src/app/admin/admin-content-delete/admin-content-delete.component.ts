import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-content-delete',
  templateUrl: './admin-content-delete.component.html',
  styleUrls: ['./admin-content-delete.component.scss']
})
export class AdminContentDeleteComponent implements OnInit {

  deleteElementTitles: any;
  delMultipleData:boolean;
  constructor(
    public deleteConfirmDialog: MatDialogRef<AdminContentDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) private dataDelete,
  ) { 
    console.log(this.dataDelete);
    this.deleteElementTitles = this.dataDelete?.delAdminData?.title;
    this.delMultipleData = this.dataDelete?.delMultipleData;
    console.log(this.deleteElementTitles);
  }

  ngOnInit(): void {
  }

  onClickYes(){
    const result = "Yes";
    this.deleteConfirmDialog.close(result);
  }

  onClickNo(){
    this.deleteConfirmDialog.close();
  }

}
