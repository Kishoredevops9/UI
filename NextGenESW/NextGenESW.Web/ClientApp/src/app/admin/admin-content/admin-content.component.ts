import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit {

  updateContentForm: FormGroup;
  selectType : any = 'Disciplines'

  constructor(
    private formBuilder: FormBuilder,
    ) { 

    }

  ngOnInit(): void {
    this.updateContentForm = this.formBuilder.group({
      'contentTitle': [null, Validators.required],
      'contentURL': [null, Validators.required],
      'contentModifiedOn': [null],
      'contentModifiedBy': [null]
    });
  }

  updateRightContainerValues(values){
    console.log(values);
    this.updateContentForm.patchValue({
    });
  }

  
  onReset(){
    this.updateContentForm.reset();
  }

  onConetntSave(){

    const rawResult = this.updateContentForm.getRawValue();
    const result = {
      ...rawResult
    };
    console.log(result);
  }



}
