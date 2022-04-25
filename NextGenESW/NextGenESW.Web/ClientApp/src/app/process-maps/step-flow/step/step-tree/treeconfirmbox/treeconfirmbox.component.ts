 
import {Component, Inject , OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-treeconfirmbox',
  templateUrl: './treeconfirmbox.component.html',
  styleUrls: ['./treeconfirmbox.component.scss']
})
export class TreeconfirmboxComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<TreeconfirmboxComponent>) { }

  ngOnInit(): void {
  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }

  
}
