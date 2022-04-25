import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-weblink-dialog',
  templateUrl: './upload-weblink-dialog.component.html',
  styleUrls: ['./upload-weblink-dialog.component.scss']
})
export class UploadWeblinkDialogComponent implements OnInit {
  deletePopup:boolean;
  addEditPopup:boolean;
  reminderPopup:boolean;
  ddmform: FormGroup;
  header:any;
  formName1:any;
  formName2:any;
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public addItemDialog: MatDialogRef<UploadWeblinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { 
      console.log("UploadWeblinkDialogComponent", data);
      this.ddmform = this.fb.group({
        fileName: ['', Validators.required],
        id: ['', Validators.required],
      });
      
      if(data.action ==='addEditPopup') {
        this.addEditPopup = true; 
        this.header = data.header;
        this.formName1 = data.controlForm.formName1;
        this.formName2 = data.controlForm.formName2;
        this.ddmform.setValue({
          fileName: data.editData.documentTitle,
          id: data.editData.documentReference
        })
      } else if (data.action ==='deletePopup'){
        this.deletePopup = true;
        this.header = data.editData.documentTitle;
      }  else if (data.action ==='reminderPopup'){
        this.reminderPopup = true;
      } 
      
      
    }

  ngOnInit(): void {
    
  }

  uploadAttach() {
    this.addItemDialog.close(this.ddmform);
  }

  closeWebLink() {
    this.addItemDialog.close();
  }

  onClickYes(){
    this.addItemDialog.close('Yes');
  }

  onClickNo(){
    this.addItemDialog.close('No');
  }
}
