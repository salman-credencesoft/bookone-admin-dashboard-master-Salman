import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Injectable()
export class AlertService {
    constructor(private snackBar: MatSnackBar ) {

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000
        });
      }
      openSuccessSnackBar(message: string) {
        this.snackBar.open('Saved Successfully!', 'Success!', {
          panelClass: ['mat--success'],
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 4000
        });
      }
      openErrorSnackBar(message: string) {
        this.snackBar.open('Error in updation!', 'Error!', {
          panelClass: ['mat--errors'],
          verticalPosition: 'top',
          horizontalPosition: 'right',
          duration: 4000
        });
    }
}
