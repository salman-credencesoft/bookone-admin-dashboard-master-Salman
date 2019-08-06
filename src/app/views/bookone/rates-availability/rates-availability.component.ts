import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RatesAndAvailability } from './manage/manage-rates-availability.component';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HTTPStatus } from './../../../app.interceptor';
@Component({
  selector: 'app-rates-availability',
  templateUrl: './rates-availability.component.html',
  styleUrls: ['./rates-availability.component.css']
})
export class RatesAndAvailabilityComponent implements OnInit {
  date: FormControl = new FormControl();
  price: FormControl = new FormControl();
  ratesAndAvailability: RatesAndAvailability ;
  loader = false;

  constructor(
    private httpStatus: HTTPStatus,
    public dialogRef: MatDialogRef<RatesAndAvailabilityComponent>,
    @Inject(MAT_DIALOG_DATA) public ratesAndAvailabilityRef: RatesAndAvailabilityComponent
    )
   { }
  ngOnInit() {}
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
}

