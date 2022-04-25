import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class DiagramSnackBarService {

  constructor(
    private snackBar: MatSnackBar
  ) {}

  handleSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000
    });
  }

}
