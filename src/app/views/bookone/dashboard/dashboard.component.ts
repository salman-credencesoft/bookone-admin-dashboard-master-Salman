import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { TokenStorage } from './../../../token.storage';
import { HTTPStatus } from './../../../app.interceptor';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  noOfGuestCheckingInToday: number;
  noOfGuestCheckingOutToday: number;
  noOfGuestInHouseToday: number;
  totalPayment: number;
  totalExpense: number;
  balance: number;
  propertyId: number;
  step = 0;
  loader = false;
  constructor(private bookingService: BookingService, private token: TokenStorage,
    private httpStatus: HTTPStatus) {

      console.log('Hello');
      this.showLoader();
    }

  ngOnInit() {
    const propertyId = this.token.getPropertyId();
    if (propertyId !== undefined) {
      this.bookingService.getNoOfGuestChekingInToday(+propertyId).subscribe(data => {
        this.noOfGuestCheckingInToday = data.body;
      });
      this.bookingService.getNoOfGuestChekingOutToday(+propertyId).subscribe(data => {
        this.noOfGuestCheckingOutToday = data.body;
      });
      this.bookingService.getNoOfGuestInHouseToday(+propertyId).subscribe(data => {
        this.noOfGuestInHouseToday = data.body;
      });
    }
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
  getTotalPayment(totalPayment: number) {
    this.totalPayment = totalPayment;
  }
  getTotalExpense(totalExpense: number) {
    this.totalExpense = totalExpense;
  }
  getBalance(): number {
     this.balance = this.totalPayment - this.totalExpense ;
     return this.balance ;
  }
}
