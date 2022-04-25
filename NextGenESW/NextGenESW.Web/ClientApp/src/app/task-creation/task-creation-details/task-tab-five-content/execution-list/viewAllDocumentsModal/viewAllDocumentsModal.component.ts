import { Component, OnInit, Inject } from '@angular/core';
import { TaskCrationPageService } from '@app/task-creation/task-creation.service';
import { uploadDDMModel } from '@app/task-creation/task-creation.model';
import { UploadWeblinkDialogComponent } from '../../upload-weblink-dialog/upload-weblink-dialog.component'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-viewAllDocumentsModal',
  templateUrl: './viewAllDocumentsModal.component.html',
  styleUrls: ['./viewAllDocumentsModal.component.scss'],
})
export class ViewAllDocumentsModalComponent implements OnInit {
  title: string = 'All Files';
  filesContainer: any;
  dialogConfig:any;
  uploadDdmModel = new uploadDDMModel();
  constructor(
    public dialog: MatDialog,
    private taskCrationPageService: TaskCrationPageService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let getData:any = data.ftData;
    let dCode:any = data.documentTypeCode;
    getData.forEach(function(item: any){
      let uploadDCode;
      if(item.uploadDestinationCode == 'WLNK') {
        uploadDCode = 'Other'
      } else {
        uploadDCode = item.uploadDestinationCode;
      }
      item.uploadDestinationCode = uploadDCode;
      item.documentTypeCode = dCode;
    });
    this.filesContainer = getData;
    console.log("getData", getData);
  }

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }

  popupEditPopup(uploadData,DestCode) {
    let formGroup;
    if(DestCode == 'Other') {
      formGroup = 
        {
          formName1 : 'File Name/ID',
          formName2 : 'Location',
        }
      
    } else {
      formGroup = 
        {
          formName1 : 'File Name',
          formName2 : 'ID',
        }
      
    }
    this.dialogConfig = {
      header: (DestCode == 'Other') ? 'Other' : DestCode,
      action: 'addEditPopup',
      editData: uploadData,
      controlForm: formGroup
    }
    const dialogRef = this.dialog.open(UploadWeblinkDialogComponent, {
      width: '500px',
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log("result", result);
        let dateTime = new Date().toISOString();
        let displayName = sessionStorage.getItem('displayName');
        this.uploadDdmModel.taskExecutionUploadId = uploadData.taskExecutionUploadId;
        this.uploadDdmModel.documentTitle = result.value.fileName;
        this.uploadDdmModel.documentReference = result.value.id;
        this.uploadDdmModel.documentTypeCode = uploadData.documentTypeCode;
        this.uploadDdmModel.taskComponentId = uploadData.taskComponentId;
        this.uploadDdmModel.uploadDestinationCode = uploadData.uploadDestinationCode == 'Other' ? 'WLNK' : uploadData.uploadDestinationCode;
        this.uploadDdmModel.createdUser = displayName ? displayName : '';
        this.uploadDdmModel.lastUpdateUser = displayName ? displayName : '';
        this.uploadDdmModel.createdDateTime = uploadData.createdDateTime;
        this.uploadDdmModel.lastUpdateDateTime = dateTime;
        console.log("uploadDdmModel", this.uploadDdmModel);
        this.taskCrationPageService
          .uploadUpdateDDMWebLink(this.uploadDdmModel)
          .subscribe((res: any) => {     
            let resData:any = res;
            if(resData) {
              console.log("New::res", res);  
              console.log("this.filesContainer", this.filesContainer);
            }    
          },(error) => {
            
            console.log(error.error);
          });
      }
    });
  }

  popupDeletePopup(uploadData) {
    console.log("popupDeletePopup", uploadData);
    this.dialogConfig = {
      action: 'deletePopup',
      editData: uploadData
    }
    const dialogRef = this.dialog.open(UploadWeblinkDialogComponent, {
      data: this.dialogConfig
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("deleteDDMWebLink::result", result);
      if(result == "Yes") {        
        this.taskCrationPageService
          .deleteDDMWebLink(uploadData.taskExecutionUploadId)
          .subscribe((res: any) => {
            console.log("deleteDDMWebLink", res);
            
          },(error) => {
            console.log(error.error);
          });
      }
    });
  }

}
