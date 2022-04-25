import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
})
export class ExceptionComponent implements OnInit {
  exceptionForm: any;
  @Input() userForm?;
  @Input() parentItem;
  @Output() updateExceptionForm = new EventEmitter();
  @Input() formGroupName: string;
  @Input() contentInfo: any;
  @Input() editResultsStatus;
  form: FormGroup;
  deviationCompId:any;
  constructor(
    private fb: FormBuilder,
    private rootFormGroup: FormGroupDirective
  ) {}

  ngOnInit(): void {
    this.addGroupToParent();
    console.log("contentInfo:deviation", this.contentInfo);
    console.log("editResultsStatus", this.editResultsStatus);
    this.deviationCompId = this.contentInfo.TaskComponentId;
  }
  addGroupToParent() {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
  saveExceptionForm(event) {
    if (
      this.form.value.difference != '' &&
      this.form.value.reason != '' &&
      (this.form.value.needUpdateInd == false ||
        this.form.value.needUpdateInd == '') &&
      this.form.value.updateComment != ''
    ) {
      this.updateExceptionForm.emit('true');
    } else if (
      this.form.value.difference != '' &&
      this.form.value.reason != '' &&
      this.form.value.needUpdateInd == true
    ) {
      this.updateExceptionForm.emit('true');
    } else {
      this.updateExceptionForm.emit('false');
    }
  }
 
}
