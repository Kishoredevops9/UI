import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss']
})
export class ExternalLinkComponent implements OnInit {
  isHeader: boolean;
  externalUrl: any = '';
  titleName: any = '';
  update: any;
  constructor(private dialogRef: MatDialogRef<ExternalLinkComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isHeader = data.isHeader;
    this.externalUrl = data.externalUrl;
    this.titleName = data.titleName;
    this.update = data.update;
   }

  ngOnInit(): void {
  }
  submit(value) {
    const externalPopUpObj = {
      popUp: value,
      title: this.titleName,
      contentUrl: this.externalUrl
    }
    this.dialogRef.close(externalPopUpObj);
  }
}
