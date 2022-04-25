import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  dateRangeForm;
  minDate = new Date();
  dateF: any = new Date();

  constructor(private formBuilder: FormBuilder) {
    this.dateRangeForm = this.formBuilder.group(
      {
        startDate: [''],
        endDate: [''],
      },
      { validator: this.checkDates }
    );
  }

  checkDates(group: FormGroup) {
    if (group.controls.endDate.value < group.controls.startDate.value) {
      return { notValid: true };
    }
    return null;
  }

  ngOnInit(): void {}
}
