import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-insert-video',
  templateUrl: './insert-video.component.html',
  styleUrls: ['./insert-video.component.scss'],
})
export class InsertVideoComponent implements OnInit {
  insertVideoForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<InsertVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const reg =
      '^(http://www.|https://www.|http://|https://)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';
    this.insertVideoForm = this.fb.group({
      insertVideo: ['', [Validators.required, Validators.pattern(reg)]],
    });
  }

  onSubmit(form: FormGroup) {
    let url = form.value.insertVideo;
    this.dialogRef.close(url);
    this.insertVideoForm.reset();
  }
}
