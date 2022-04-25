import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollabComponent } from '../collab/collab.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cd-document',
  templateUrl: './cd-document.component.html',
  styleUrls: ['./cd-document.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CdDocumentComponent implements OnInit {
  docTitle;
  users;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.docTitle = document.getElementById('docTitle').innerHTML;
  }

  // Function to Open Dialog
  openDialog() {
    const dialogRef = this.dialog.open(CollabComponent, {
      width: '70%',
      data: { doc: { title: this.docTitle } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._snackBar.open("'" + this.docTitle + "' shared", 'x', {
        duration: 5000,
      });
    });
  }

  // Download File
  downloadSourceFile() {
    const link = document.createElement('a');
    const mimeType = '.docm';
    link.href =
      'https://pwesw1.sharepoint.com/sites/PWESW/_layouts/15/download.aspx?UniqueId=07f74070%2Dac16%2D4766%2D8885%2Dbbba6fa39e31';
    link.download = 'XA-C-0472_Demo';
    link.click();
  }
}
