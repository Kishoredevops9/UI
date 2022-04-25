import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';


@Component({
  selector: 'app-add-help-item',
  templateUrl: './add-help-item.component.html',
  styleUrls: ['./add-help-item.component.scss']
})
export class AddHelpItemComponent implements OnInit {

  addItemForm: FormGroup;

  selectedOptions;
  helpPageData;

  feedbackAlert: string = 'This field is required';
  adminContentTypes = "Help";
  adminTitle:any = "Add New Item";
  adminTitleCond: boolean;
  constructor(
    public addItemDialog: MatDialogRef<AddHelpItemComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private adminService: AdminService
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
      'thumbnailImgString':[null]
    });

    
    
    this.adminService.getAllEKSHelpPage().subscribe( (data) =>{
      this.helpPageData = data;
      //this.selectedOptions = data;

      let temp2 = [];
      //console.log(this.helpPageData);
      temp2 = this.helpPageData;
      let helpData;
      this.adminService.getAllEKSHelp().subscribe( (data) => {
        helpData = data;
        //console.log(helpData);

        helpData.forEach(element => {
          this.RemoveElementFromObjectArray(element.title);
        });

        this.selectedOptions = this.helpPageData;
        //console.log(this.helpPageData);
      });
      
    });
    
    
    
  }

  RemoveElementFromObjectArray(key) {
    this.helpPageData.forEach((value,index)=>{
        if(value.title==key) this.helpPageData.splice(index,1);
    });
    //console.log(this.helpPageData);
  }

  onCancel(){
    const result = "Close";
    this.addItemDialog.close(result);
  }

  onItemSave(){

    const rawResult = {
      popupTitle: this.addItemForm.controls['popupTitle'].value,
      popupURL: this.addItemForm.controls['popupURL'].value,
      thumbnailImgString: this.selectedFiles
    }
    const result = {
      ...rawResult
    };

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

}
