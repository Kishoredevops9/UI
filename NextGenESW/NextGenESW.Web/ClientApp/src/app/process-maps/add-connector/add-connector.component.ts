import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  isNew: boolean;
  captionMiddle: string;
  captionStart: string;
  captionEnd: string;
}

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-connector.component.html',
  styleUrls: ['./add-connector.component.scss']
})
export class AddConnectorComponent implements OnInit {

  connectorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddConnectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    this.connectorForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      captionMiddle: [this.data.captionMiddle],
      captionStart: [this.data.captionStart],
      captionEnd: [this.data.captionEnd]
    });
  }

  onSubmit() {
    this.dialogRef.close(
      this.connectorForm.getRawValue()
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}

