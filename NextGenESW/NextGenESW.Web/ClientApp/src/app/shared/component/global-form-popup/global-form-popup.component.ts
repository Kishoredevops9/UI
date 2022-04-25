import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
let datePipe = new DatePipe("en-US");

@Component({
  selector: 'app-global-form-popup',
  templateUrl: './global-form-popup.component.html',
  styleUrls: ['./global-form-popup.component.scss']
})
export class GlobalFormPopupComponent implements OnInit {
  deletePopup:boolean;
  addEditPopup:boolean;
  errorPopup:boolean;
  viewPopup:boolean;
  addItemForm: FormGroup;
  header:any;
  formControlData:any;
  formValidationArray = [];
  errorMessage:any;
  error:any={isError:false,errorMessage:''};
  announceType:any;
  isValidDate:any;
  dialogConfig:any;
  profileList:any;
  minDate:Date = new Date();
  maxDate:Date = new Date(9999, 11, 31);
  @Output() buttonEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public dialog: MatDialog,
    public addItemDialog: MatDialogRef<GlobalFormPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data) { 
      if(data.action ==='addEditPopup') {
        this.addEditPopup = true;
        const group = {};
        this.formControlData = data.formData;
         this.formControlData.forEach(element => {
          if(element.validation) {
            for(const validatorsInfo of element.validation) {
              this.formValidationArray.push(validatorsInfo.validate);
            }
          }
          group[element.formControlName] = new FormControl(
            {value: element.sValue, disabled: element.isDisabled}, this.formValidationArray);
            this.formValidationArray = [];
        });

        this.addItemForm = new FormGroup(group);
        this.header = data.header
      } else if (data.action ==='deletePopup'){
        this.deletePopup = true;
      }  
      else if (data.action ==='errorPopup'){
        this.errorPopup = true;
        this.header = data.header;
        this.errorMessage = data.message.errorMessage;
      }
      else if (data.action ==='viewPopup'){
        this.viewPopup = true;
        this.header = data.header;
        this.profileList = data.formData;   
        console.log("profileList", this.profileList);     
      }
      
    }

  ngOnInit(): void {
    
  }

  submitAction() {   
    const effectiveFrom_test = datePipe.transform(this.addItemForm.controls['dateofpost'].value, 'MM/dd/yyyy');
    const effectiveTo_test = datePipe.transform(this.addItemForm.controls['expirtaiondate'].value, 'MM/dd/yyyy');

    this.isValidDate = this.validateDates(effectiveFrom_test, effectiveTo_test);

    

    if(this.isValidDate) {
      
      if(this.addItemForm.valid){
        this.buttonEvent.emit({form: this.addItemForm}); 
        this.addItemDialog.close();  
      } 
      
    } else{
      this.dialogConfig = {
        header: 'Error',
        action: 'errorPopup',
        message: this.error
      }
      const dialogRef = this.dialog.open(GlobalFormPopupComponent, {
        width: '681px',
        data: this.dialogConfig
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        
      });
    }    

    
        
  }
  cancelAction(data:any) {
    this.addItemDialog.close();   
  }

  onClickYes() {
    const result = "Yes";
    this.addItemDialog.close(result);
  }
  onClickNo() {
    this.addItemDialog.close();
  }

  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'Date of Post and Expiration date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'Expiration date should be greater then Date of Post.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }


}
