import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-eksaddons-confirmpopup',
  templateUrl: './eksaddons-confirmpopup.component.html',
  styleUrls: ['./eksaddons-confirmpopup.component.scss']
})
export class EksaddonsConfirmpopupComponent implements OnInit {

  constructor(public dialogAddons: MatDialogRef<EksaddonsConfirmpopupComponent>) { }

  ngOnInit(): void {
  }

  closeModal(buttonCalled: string) {
    this.dialogAddons.close(buttonCalled);
  }

}
