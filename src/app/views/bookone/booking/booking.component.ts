import { Component, AfterViewChecked, OnInit, Inject, ViewChild } from '@angular/core';
import { Booking } from './booking';
import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Message } from 'primeng/components/common/api';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, ErrorStateMatcher } from '@angular/material/core';
import { HTTPStatus } from './../../../app.interceptor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Payment } from '../payment/payment';
import { BookingService } from '../services/booking.service';
import { PaymentService } from './../services/payment.service';
import { PaymentComponent } from './../payment/payment.component';
import { Service } from './../service/service';
import { ExpenseComponent } from './../manage-expense/expense/expense.component';
import { NotificationService } from './../services/notification.service';

import { SMS_NUMBER } from './../../../app.component';
import { TokenStorage } from './../../../token.storage';
import { Room } from './../room/room';
import { Property } from '../property/property';
import {Msg} from './../msg';
declare let paypal: any;

export interface Year {
  value: string;
  viewValue: string;
}
export interface Currency {
  value: string;
  viewValue: string;
}
export interface Month {
  value: string;
  viewValue: string;
}
export interface PaymentMode {
  value: string;
  viewValue: string;
}
export interface ExternalBookingSites {
  value: string;
  viewValue: string;
}
export interface PaymentStaus {
  value: string;
  viewValue: string;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-NZ' }
  ]
})
export class BookingComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  msgs: Message[] = [];
  title = 'app';
  booking: Booking;
  availabilityCheck: Boolean = false;
  name: FormControl = new FormControl();
  currency: FormControl = new FormControl();
  amount: FormControl = new FormControl();
  firstName: FormControl = new FormControl();
  lastName: FormControl = new FormControl();
  bookingEmail: FormControl = new FormControl();
  bookingContact: FormControl = new FormControl();
  bookingFromDate: FormControl = new FormControl(new Date());
  bookingRoomPrice: FormControl = new FormControl();
  bookingToDate: FormControl = new FormControl({ disabled: this.availabilityCheck });
  bookingAmount: FormControl = new FormControl();
  airportShuttle: FormControl = new FormControl();
  addScript: Boolean = false;
  paypalLoad: Boolean = true;
  isShuttleBooked: Boolean = false;
  referenceNumber: FormControl = new FormControl();
  paymentMode: FormControl = new FormControl();
  expMonth: FormControl = new FormControl();
  expYear: FormControl = new FormControl();
  cvv: FormControl = new FormControl();
  cardHolderName: FormControl = new FormControl();
  cardNumber: FormControl = new FormControl();
  externalBookingRef: FormControl = new FormControl();
  externalSite: FormControl = new FormControl();
  bookingNotes: FormControl = new FormControl();
  noOfPersons: FormControl = new FormControl();
  noOfRooms: FormControl = new FormControl();
  roomType: FormControl = new FormControl();
  todayDate = new Date();
  fromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  toDateMinMilliSeconds: number;
  toDateMaxMilliSeconds: number;
  form: NgForm;
  //Spinner Properties
  spinner: Boolean = false;
  submitDisabled: Boolean = false;
  bookingButtonLabel = 'Check Availability';
  resetButtonLabel = 'Reset';
  pageTitle = 'New Booking Entry';
  payment: Payment;
  loader = false;
  propertyEmail: string;
  propertyName: string;
  propertyContact: string;
  services: Service[];
  rooms: Room[];
  property: Property;
  room: Room;
  noOfPersonPlaceHolder: string ;
  noOfRoomsPlaceHolder: string ;
  changeType: string ;

  paymentStatus: PaymentStaus[] = [
    { value: 'Paid', viewValue: 'Paid' },
    { value: 'NotPaid', viewValue: 'NotPaid' }
  ];
  paymentModes: PaymentMode[] = [
    { value: 'Card', viewValue: 'Card' },
    { value: 'Cash', viewValue: 'Cash' },
    { value: 'BankTransfer', viewValue: 'BankTransfer' },
    { value: 'Wallet', viewValue: 'Wallet' },
    { value: 'Cheque', viewValue: 'Cheque' },
    { value: 'DemandDraft', viewValue: 'DemandDraft' }
  ];
  years: Year[] = [
    { value: '2018', viewValue: '2018' },
    { value: '2019', viewValue: '2019' },
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' }
  ];
  currencies: Currency[] = [
    { value: 'NZD', viewValue: 'NZD' },
    { value: 'AUD', viewValue: 'AUD' },
    { value: 'GBP', viewValue: 'GBP' },
    { value: 'USD', viewValue: 'USD' },
    { value: 'EUR', viewValue: 'EUR' },
    { value: 'INR', viewValue: 'INR' }
  ];
  months: Month[] = [
    { value: '01', viewValue: '01' },
    { value: '02', viewValue: '02' },
    { value: '03', viewValue: '03' },
    { value: '04', viewValue: '04' },
    { value: '05', viewValue: '05' },
    { value: '06', viewValue: '06' },
    { value: '07', viewValue: '07' },
    { value: '08', viewValue: '08' },
    { value: '09', viewValue: '09' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' }
  ];
  externalBookingSites: ExternalBookingSites[] = [
    { value: 'Agoda', viewValue: 'Agoda' },
    { value: 'AirBnB', viewValue: 'AirBnB' },
    { value: 'BookABach', viewValue: 'BookABach' },
    { value: 'Booking.com', viewValue: 'Booking.com' },
    { value: 'goibibo', viewValue: 'goibibo' },
    { value: 'Expedia', viewValue: 'Expedia' },
    { value: 'Google', viewValue: 'Google' },
    { value: 'Homes&Away', viewValue: 'Homes&Away' },
    { value: 'MakeMyTrip', viewValue: 'MakeMyTrip' },
    { value: 'WebSite', viewValue: 'WebSite' },
    { value: 'Others', viewValue: 'Others' }
  ];


  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<BookingComponent>,
    @Inject(MAT_DIALOG_DATA) public bookingRef: Booking,
    private snackBar: MatSnackBar,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private httpStatus: HTTPStatus,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private token: TokenStorage
  ) {
    this.showLoader();
    this.booking = bookingRef;
    this.rooms = this.token.getRoomTypes();
    this.property = this.token.getProperty();
    this.propertyEmail = this.property.email;
    this.propertyName = this.property.name;
    this.propertyContact = this.property.managerContactNo;
    this.booking.propertyId = this.property.id;
    if (this.bookingRef.roomId !== null || this.bookingRef.roomId !== undefined) {
      this.booking.roomId = this.bookingRef.roomId;
      this.setRoom(this.booking.roomId);
    }
    if ( this.bookingRef.changeType !== undefined && this.bookingRef.changeType !== null ) {
      this.bookingButtonLabel = 'Modify Booking';
    }
  }
  ngOnInit() {
    this.spinner = false;
    this.submitDisabled = false;
    this.availabilityCheck = false;
    this.bookingFromDate.enable();
    this.bookingToDate.enable();
    //this.bookingFromDate = new FormControl();
    this.payment = new Payment();
    if (this.bookingRef !== null) {
      this.booking = this.bookingRef;
      console.log(`booking` + this.booking + 'Amendment Type' + this.booking.changeType);
      if (this.booking.id > 0  && this.booking.changeType === undefined) {
        this.bookingButtonLabel = 'Save';
        this.resetButtonLabel = 'Cancel';
        this.enableDisableForSave();
        console.log(this.booking.bookingStatus);
        this.pageTitle = `${this.booking.firstName}'s Booking Reference:${this.booking.id}`;
        this.getAllServices();
      } else if (this.booking.changeType !== undefined && this.booking.changeType === 'date' ) {
        this.bookingFromDate.setValue(this.convertJavaSQLDateToCalenderDate(this.booking.fromDate));
        this.bookingToDate.setValue(this.convertJavaSQLDateToCalenderDate(this.booking.toDate));
        console.log(` From Date : ${this.bookingFromDate.value} To Date : ${this.bookingToDate.value} `);
        this.bookingButtonLabel = 'Change Date';
        this.resetButtonLabel = 'Cancel';
        this.pageTitle = `${this.booking.firstName}'s Booking Reference:${this.booking.id}`;
        this.getAllServices();
        this.enableDisableForDateChange();
      } else if (this.booking.changeType !== undefined && this.booking.changeType === 'room' ) {
        this.bookingButtonLabel = 'Change Room';
        this.resetButtonLabel = 'Cancel';
        this.pageTitle = `${this.booking.firstName}'s Booking Reference:${this.booking.id}`;
        this.getAllServices();
        this.enableDisableForRoomChange();
      } else if (this.booking.changeType !== undefined && this.booking.changeType === 'noOfGuest' ) {
        this.bookingButtonLabel = 'Change No Of Guest';
        this.resetButtonLabel = 'Cancel';
        this.pageTitle = `${this.booking.firstName}'s Booking Reference:${this.booking.id}`;
        this.getAllServices();
        this.enableDisableForNoOfPersonChange();
      }
    } else {
      this.booking = new Booking();
    }
  }
  onCloseBooking(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  checkAvailabilty() {
    this.submitDisabled = true;
    this.spinner = !this.spinner;
    this.msgs = [];
    console.log(` From Date : ${this.booking.fromDate} To Date : ${this.booking.toDate} `);
    this.booking.fromDate = this.convertCalenderDateToJavaSQLDate(this.bookingFromDate.value);
    this.booking.toDate = this.convertCalenderDateToJavaSQLDate(this.bookingToDate.value);
    console.log(` From Date : ${this.booking.fromDate} To Date : ${this.booking.toDate} `);
    console.log(' Booking: ' + this.booking.roomId + this.booking.propertyId);
    const checkAvailabilityObsrv = this.bookingService.checkAvailability(this.booking).subscribe(response => {
      this.spinner = !this.spinner;
      this.availabilityCheck = !this.availabilityCheck;
      if (response.status === 200) {
        this.bookingFromDate.disable();
        this.bookingToDate.disable();
        this.roomType.disable();
        this.submitDisabled = false;
        this.booking.available = response.body.available;
        this.booking.totalAmount = response.body.bookingAmount ;
        this.booking.payableAmount = response.body.bookingAmount;
        this.booking.noOfExtraPerson = response.body.noOfExtraPerson;
        this.booking.extraPersonCharge = response.body.extraPersonCharge;

        if (this.booking.available === false) {
          this.msgs.push({
            severity: 'warn',
            summary:
              'Appologies ! Seems we are soldout for the selected dates,please leave your details we will getback with in 24 hours. '
          });
          this.bookingButtonLabel = 'Enquire';
        } else {
          this.bookingButtonLabel = 'Book';
        }
      } else {
        this.msgs.push({
          severity: 'error',
          summary: response.status + ':' + response.statusText
        });

      }
    },
      error => this.handleError(error)
    );
  }
  submit() {
    if (this.bookingButtonLabel === 'Check Availability') {
      this.checkAvailabilty();
    } else if (this.bookingButtonLabel === 'Book' && this.booking.modeOfPayment != null && this.booking.modeOfPayment === 'Card') {
      this.chargeCreditCard();
      // this.processPayment(this.payment);
    } else if (this.bookingButtonLabel === 'Book' && this.booking.modeOfPayment != null) {
      this.payment.amount = this.booking.payableAmount;
      this.payment.paymentMode = this.booking.modeOfPayment;
      this.payment.currency = 'NZD';
      this.payment.email = this.booking.email;
      this.payment.businessEmail = this.booking.businessEmail;
      this.payment.description = `Accomodation for  ${this.booking.firstName}  at  ${this.propertyName}`;
      this.createBooking(this.booking);
    } else if (this.bookingButtonLabel === 'Enquire') {
      this.createBooking(this.booking);
    } else if (this.bookingButtonLabel === 'Save') {
      this.saveBooking(this.booking);
    } else if (this.bookingButtonLabel === 'Change Date') {
      this.changeDate(this.booking);
    } else if (this.bookingButtonLabel === 'Change Room') {
      this.changeRoom(this.booking);
    } else if (this.bookingButtonLabel === 'Change No Of Guest') {
      this.changePerson(this.booking);
  }



  }
  chargeCreditCard() {
    this.submitDisabled = true;
    (<any>window).Stripe.card.createToken({
      number: this.payment.cardNumber,
      exp_month: this.payment.expMonth,
      exp_year: this.payment.expYear,
      cvc: this.payment.cvv,

    }, (status: number, response: any) => {
      if (status === 200) {
        const token = response.id;
        this.payment.token = token;
        this.payment.amount = this.booking.payableAmount;
        this.payment.currency = 'NZD';
        this.payment.email = this.booking.email;
        this.payment.businessEmail = this.booking.businessEmail;
        this.payment.paymentMode = this.booking.modeOfPayment;
        this.payment.description = `Accomodation for   ${this.booking.firstName}   at ${this.booking.businessName}`;
        this.processPayment(this.payment);
      } else {
        const snackBarRef = this.snackBar.open('Error message :' + response.error.message);
        snackBarRef.dismiss();
      }
    });
    this.submitDisabled = false;
  }
  processPayment(payment: Payment) {
    this.paymentService.processPayment(payment)
      .subscribe(response => {
        if (response.status === 200) {
          this.payment = response.body;
          console.log(`Payment Status:${this.payment.status}`);
          if (this.payment.status === 'Paid') {
            const snackBarRef = this.snackBar.open('Payment processed successfully.Creating booking ...', 'close');
            snackBarRef._dismissAfter(5000);
            this.createBooking(this.booking);
          } else {
            this.snackBar.open('ErroCode:' + payment.failureCode + 'and Error message :' + payment.failureMessage, '', {
              duration: 5000,
            });
          }
        } else {
          this.msgs.push({
            severity: 'error',
            summary: 'Seems there is a problem in processing the payment, we have received your booking and will get in touch . !'
          });
        }

      });

  }
  saveBooking(booking: Booking) {
    this.msgs = [];
    this.spinner = !this.spinner;
    const createBookingObsr = this.bookingService.saveBooking(booking).
      subscribe(response => {
        this.spinner = !this.spinner;
        if (response.status === 200) {
          this.booking = response.body;
          //Get All Services
          this.getAllServices();
          this.openSuccessSnackBar(`Booking Details Saved`);
        } else {
          this.openErrorSnackBar(`Error in updating Booking Details`);
        }
      });
  }
  changeDate(booking: Booking) {
    this.msgs = [];
    this.spinner = !this.spinner;
    this.bookingFromDate.valueChanges.subscribe(response => {
      console.log(`Hello`);
      console.log(` From Date : ${this.bookingFromDate.value} To Date : ${this.bookingToDate.value} `);
      this.booking.fromDate = this.bookingFromDate.value;
    });
    this.bookingToDate.valueChanges.subscribe(response => {
      console.log(`Hello`);
     this.booking.toDate =  this.bookingToDate.value;
    });
 // console.log(` From Date : ${this.bookingFromDate.value} To Date : ${this.bookingToDate.value} `);
 // this.booking.fromDate = this.bookingFromDate.value;
  //this.booking.toDate = this.bookingToDate.value;
  const createBookingObsr = this.bookingService.modifyDate(booking).
      subscribe(response => {
        this.spinner = !this.spinner;
        if (response.status === 200) {
          this.booking = response.body;
          //Get All Services
          this.getAllServices();
          if ( this.booking.message !== null && this.booking.message === 'success') {
          this.openSuccessSnackBar(this.booking.message);
        } else {
          this.openErrorSnackBar(this.booking.message);
        }
        } else {
          this.openErrorSnackBar(`Error in updating Booking Details`);
        }
      });
  }
  changeRoom(booking: Booking) {
    this.msgs = [];
    this.spinner = !this.spinner;
    const createBookingObsr = this.bookingService.modifyRoom(booking).
      subscribe(response => {
        this.spinner = !this.spinner;
        if (response.status === 200) {
          this.booking = response.body;
          //Get All Services
          this.getAllServices();
          if ( this.booking.message !== null && this.booking.message === 'success') {
          this.openSuccessSnackBar(this.booking.message);
        } else {
          this.openErrorSnackBar(this.booking.message);
        }
        } else {
          this.openErrorSnackBar(`Error in updating Booking Details`);
        }
      });
  }
  changePerson(booking: Booking) {
    this.msgs = [];
    this.spinner = !this.spinner;
    const createBookingObsr = this.bookingService.modifyGuestNumber(booking).
      subscribe(response => {
        this.spinner = !this.spinner;
        if (response.status === 200) {
          this.booking = response.body;
          //Get All Services
          this.getAllServices();
          if ( this.booking.message !== null && this.booking.message === 'success') {
          this.openSuccessSnackBar(this.booking.message);
        } else {
          this.openErrorSnackBar(this.booking.message);
        }
        } else {
          this.openErrorSnackBar(`Error in updating Booking Details`);
        }
      });
  }

  createBooking(booking: Booking) {
    console.log(`Inside Create Booking ${booking}`);
    this.msgs = [];
    const createBookingObsr = this.bookingService.saveBooking(booking).subscribe(response => {
      this.spinner = !this.spinner;
      if (response.status === 200) {
        this.booking = response.body;
        if (this.booking.id != null) {
          this.msgs.push({
            severity: 'success',
            detail:
              `Thanks for the booking .Please not the Reservation No:  # ${this.booking.id} and an email is sent with the booking details.`
          });
          if (this.booking.mobile !== null && this.booking.mobile !== undefined) {
            this.sendConfirmationMessage();
          }
          this.payment.referenceNumber = this.booking.id.toString();
          this.payment.externalReference = this.booking.externalBookingID;
          this.payment.propertyId = this.booking.propertyId;
          this.paymentService.savePayment(this.payment).subscribe(res => {
            if (res.status === 200) {
              this.openSuccessSnackBar(`Payment Details Saved`);
            } else {
              this.openErrorSnackBar(`Error in updating payment details`);
            }
            this.submitDisabled = true;
          }
          );
        } else {
          this.msgs.push({
            severity: 'error',
            summary: 'Please check the booking details and try again !'
          });
        }
      } else {
        this.msgs.push({
          severity: 'error',
          summary: response.statusText + ':' + response.statusText
        });
      }
    });
    setTimeout(() => {
      this.msgs = [];
      createBookingObsr.unsubscribe();
      this.spinner = false;
      this.msgs.push({
        severity: 'error',
        summary: 'The server is taking more than usual time,please try again after sometime.'
      });
    }, 100000);
  }
  reset() {
    if (this.resetButtonLabel === 'Cancel') {
      this.dialogRef.close();
    }
    this.bookingFromDate.enable();
    this.bookingToDate.enable();
    this.roomType.enable();
    this.booking = new Booking();
    this.bookingFromDate = new FormControl();
    this.bookingToDate = new FormControl();
    this.propertyEmail = this.property.email;
    this.propertyName = this.property.name;
    this.propertyContact = this.property.managerContactNo;
    this.booking.propertyId = this.property.id;
    if (this.bookingRef.roomId !== null || this.bookingRef.roomId !== undefined) {
      this.booking.roomId = this.bookingRef.roomId;
    }
    this.availabilityCheck = false;
    this.spinner = false;
    this.msgs = [];
    this.bookingButtonLabel = 'Check Availability';
  }
  setCheckOutDateOnReset(date: Date) {
    const fromDateMilliSeconds = date.getTime();
    this.toDateMinMilliSeconds = fromDateMilliSeconds + 86400000;
    this.toDateMaxMilliSeconds = fromDateMilliSeconds + (86400000 * 30);
    this.minToDate = new Date(this.toDateMinMilliSeconds);
    this.maxToDate = new Date(this.toDateMaxMilliSeconds);

  }
  setCheckOutDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const fromDateMilliSeconds = event.value.getTime();
    this.toDateMinMilliSeconds = fromDateMilliSeconds + 86400000;
    this.toDateMaxMilliSeconds = fromDateMilliSeconds + (86400000 * 30);
    this.minToDate = new Date(this.toDateMinMilliSeconds);
    this.maxToDate = new Date(this.toDateMaxMilliSeconds);
  }
  convertCalenderDateToJavaSQLDate(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let month1;
    let day1;
    if (month < 10) {
      month1 = `0${month}`;
    } else {
      month1 = `${month}`;
    } if (day < 10) {
      day1 = `0${day}`;
    } else {
      day1 = `${day}`;
    }
    return `${date.getFullYear()}-${month1}-${day1}`;
  }
  convertJavaSQLDateToCalenderDate(date: string): Date {
    console.log(date);
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const calenderDate = new Date();
    calenderDate.setFullYear(+year, +month - 1, +day);
    return calenderDate;
  }
  private handleError(error: HttpErrorResponse) {
    this.msgs = [];
    this.spinner = !this.spinner;
    if (error.error instanceof ErrorEvent) {
      this.msgs.push({
        severity: 'error',
        summary: ` The server responded with  erorr code : ${error.status} ,
            please email   ${this.booking.businessEmail} to the proceed with the booking `

      });
    } else {
      this.msgs.push({
        severity: 'error',
        summary: ` Erorr code : ${error.status} ,
            please  email   ${this.booking.businessEmail} to the proceed with the booking `
      });
    }
    // return an observable with a user-facing error message
    /*return throwError(
      ` The server responded with  erorr code : ${error.status} ,
            please  email   ${this.booking.businessEmail} to the proceed with the booking `
    );*/
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
  openSuccessSnackBar(message: string) {
    this.snackBar.open(message, 'Success!', {
      panelClass: ['mat--success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }
  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Error!', {
      panelClass: ['mat--errors'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }

  createPaymentDialog() {
    console.log(this.booking);
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '600px',
      data: {
        email: this.booking.email,
        referenceNumber: this.booking.id,
        amount: this.booking.payableAmount,
        externalReference: this.booking.externalBookingID,
        businessEmail: this.booking.businessEmail,
        propertyId: this.booking.propertyId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPayments();
    });

  }
  createExpenseDialog() {
    const dialogRef = this.dialog.open(ExpenseComponent, {
      width: '600px',
      data: {
        email: this.booking.email,
        bookingId: this.booking.id,
        externalReference: this.booking.externalBookingID,
        businessEmail: this.booking.businessEmail,
        propertyId: this.booking.propertyId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllPayments();
    });
  }
  onConfirmedServices(services: Array<Service>) {
    this.booking.services = services;
    this.saveBooking(this.booking);
  }
  addService(service: Service) {
    this.bookingService.addServiceTOBooking(this.booking.id, service).subscribe(
      response => {
        if (response.status === 200) {
          this.getAllServices();
        }
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          this.openErrorSnackBar(error.message);
        }
      }
    );
  }
  getAllServices() {
    this.bookingService.getAllServicesByBooking(this.booking.id).subscribe(response1 => {
      this.booking.services = response1.body;
      console.log(`Services: ${this.booking.services}`);
    });
  }
  getAllPayments() {
  }
  sendConfirmationMessage() {
    let msg = new Msg();
    msg.fromNumber = SMS_NUMBER;
    msg.toNumber = this.booking.mobile;
    msg.message = `Dear ${this.booking.firstName},Rsvn#:${this.booking.id},${this.booking.roomName},Chk-In:${this.booking.fromDate},Chk-Out:${this.booking.toDate},Amt:${this.booking.payableAmount}.Thx.${this.propertyName},${this.propertyContact}`;
    console.log(msg.message);
    this.notificationService.sendTextMessage(msg).subscribe(response1 => {
      msg = response1.body;
      if (msg.sid !== undefined || msg.sid !== null) {
        this.openSuccessSnackBar('Booking Confirmation Sent.');
      }
    },
      error => {
        if (error instanceof HttpErrorResponse) {
          this.openErrorSnackBar('Error in sending sms');
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
  setRoom(roomId: number) {
    this.room = this.rooms.find(room =>
      room.id === roomId
    );
    if ( this.room !== undefined && this.room.shared === true ) {
      this.noOfRoomsPlaceHolder = 'No Of Beds';
    } else {
      this.noOfRoomsPlaceHolder = 'No Of Rooms';
    }
  }
  enableDisableForDateChange() {
    this.roomType.disable();
    this.bookingFromDate.enable();
    this.bookingToDate.enable();
    this.noOfPersons.disable();
    this.noOfRooms.disable();
    this.firstName.disable();
    this.lastName.disable();
    this.bookingEmail.disable();
    this.bookingContact.disable();
    this.bookingNotes.disable();
    this.externalBookingRef.disable();
    this.externalSite.disable();

  }
  enableDisableForRoomChange() {
    this.roomType.enable();
    this.bookingFromDate.disable();
    this.bookingToDate.disable();
    this.noOfPersons.disable();
    this.noOfRooms.enable();
    this.firstName.disable();
    this.lastName.disable();
    this.bookingEmail.disable();
    this.bookingContact.disable();
    this.bookingNotes.disable();
    this.externalBookingRef.disable();
    this.externalSite.disable();

  }
  enableDisableForNoOfPersonChange() {
    this.roomType.disable();
    this.bookingFromDate.disable();
    this.bookingToDate.disable();
    this.noOfPersons.enable();
    this.noOfRooms.disable();
    this.firstName.disable();
    this.lastName.disable();
    this.bookingEmail.disable();
    this.bookingContact.disable();
    this.bookingNotes.disable();
    this.externalBookingRef.disable();
    this.externalSite.disable();

  }
  enableDisableForSave() {
    this.roomType.disable();
    this.bookingFromDate.disable();
    this.bookingToDate.disable();
    this.noOfPersons.disable();
    this.noOfRooms.disable();
  }
}
