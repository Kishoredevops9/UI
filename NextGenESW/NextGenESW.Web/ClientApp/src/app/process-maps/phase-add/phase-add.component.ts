import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Phase } from '../process-maps.model';

@Component({
  selector: 'app-phase-add',
  templateUrl: './phase-add.component.html',
  styleUrls: ['./phase-add.component.scss']
})
export class PhaseAddComponent implements OnInit {
  addPhaseForm: FormGroup;
  name: string;
  caption: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PhaseAddComponent>,
    @Inject(MAT_DIALOG_DATA) data: Partial<Phase>,
  ) {
    this.name = data.name;
    this.caption = data.caption;
  }

  ngOnInit(): void {
    this.addPhaseForm = this.createPhaseForm();
  }

  private createPhaseForm(): FormGroup {
    return this.fb.group({
      'name': [this.name, Validators.required],
      'caption': [this.caption, Validators.required]
    });
  }

  onAddphase() {
    this.dialogRef.close(this.addPhaseForm.value);
  }

  onClose() {
    this.dialogRef.close();
  }
}
