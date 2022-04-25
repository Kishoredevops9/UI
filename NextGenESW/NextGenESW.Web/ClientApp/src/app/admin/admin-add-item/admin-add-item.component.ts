import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StepPageSearchComponent } from '@app/process-maps/step-page-search/step-page-search.component';

@Component({
  selector: 'app-admin-add-item',
  templateUrl: './admin-add-item.component.html',
  styleUrls: ['./admin-add-item.component.scss']
})
export class AdminAddItemComponent implements OnInit {

  addItemForm: FormGroup;
  addNewItemForm: FormGroup;
  feedbackAlert: string = 'This field is required';
  adminContentTypes = "Disciplines";
  adminTitle:any = "Add New Item";
  adminTitleCond: boolean;
  constructor(
    public addItemDialog: MatDialogRef<AdminAddItemComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    public searchDialog: MatDialog,
  ) { 
    this.adminContentTypes = this.data.adminContentType;
    this.adminTitle = this.data.adminTitle;
    if(this.adminTitle == 'Add New Submenu' && this.adminContentTypes != 'UserGuides') {
      this.adminTitleCond = true;
    } else if(this.adminTitle == 'Add New Submenu' && this.adminContentTypes == 'UserGuides') {
      this.adminTitleCond = false;
    } 
  }

  ngOnInit(): void {
    this.addItemForm = this.formBuilder.group({
      'popupTitle': [null, Validators.required],
      'popupURL': [null],
      'selectField': [null],
      'thumbnailImgString':[null],
      'assetContentId' : [null],
      'version' : [null]
    });
    this.addNewItemForm = this.formBuilder.group({
      'popupTitle': [null, Validators.required],
      'popupURL': [null],
    });
  }

 
  openSearchDialog() {
    const searchDialogRef = this.searchDialog.open(StepPageSearchComponent, {
      width: '90%',
      height: '90%',
      data: {
        "doc" : {"contentType" : 'F'}
        }
    });

    searchDialogRef.afterClosed().subscribe(result => {
       console.log(result)
       console.log( result.title )

       this.addItemForm.get("popupTitle").patchValue(result.title +" "+ result.contentid);
       this.addItemForm.get("popupURL").patchValue("/view-document/SF/"+ result.contentid);
       this.addItemForm.get("assetContentId").patchValue( result.contentid);
       this.addItemForm.get("version").patchValue(  result.version );
    });

  }

  
  onCancel(){
    const result = "Close";
    this.addItemDialog.close(result);
  }

  onItemSave(){

    //const rawResult = this.addItemForm.getRawValue();

    const rawResult = {
      popupTitle: this.addItemForm.controls['popupTitle'].value,
      popupURL: this.addItemForm.controls['popupURL'].value,
      assetContentId :  this.addItemForm.controls['assetContentId'].value,  
      version :  this.addItemForm.controls['version'].value,  
      thumbnailImgString: this.selectedFiles
    }
    const result = {
      ...rawResult
    };

    this.addItemDialog.close(result);
  }

  onSubItemSave(){

    const popupURL = this.addNewItemForm.controls['popupURL'].value;
    let result;
    if(popupURL == null) {
      result = {
        popupTitle: this.addNewItemForm.controls['popupTitle'].value,
      }
    } else {
      result = {
        popupTitle: this.addNewItemForm.controls['popupTitle'].value,
        popupURL: this.addNewItemForm.controls['popupURL'].value,
      }
    }
    this.addItemDialog.close(result);
  }

  //
  addResult;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  onFileChanged(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
  }

  urlDisabled(event:MatCheckboxChange, formName:any){
    const checked = event.checked;
    if(checked) {
      formName.controls['popupURL'].disable();
    } else {
      formName.controls['popupURL'].enable();
    }
  }

}
