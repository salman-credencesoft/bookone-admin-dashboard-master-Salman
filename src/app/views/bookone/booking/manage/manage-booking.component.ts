import {
  Component,
  AfterViewChecked,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { BookingService } from '../../services/booking.service';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BookingComponent } from '../booking.component';
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  HttpModule
} from '@angular/http';
import { MatProgressSpinnerModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { Host } from '../../host/host';
import { Booking } from '../booking';
import { AirPortServiceType } from '../../enums/AirPortServiceType';
import { HTTPStatus } from './../../../../app.interceptor';
import { ApplicationUser } from './../../../sessions/signup/user';
import { MatSnackBar } from '@angular/material';
import { AuthService } from './../../services/auth.service';
import { TokenStorage } from './../../../../token.storage';
import { AvailabilityComponent } from '../../availability/availability.component';
import { Room } from '../../room/room';
import { Property } from '../../property/property';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

const BUSINESS_EMAIL = 'bookings@samsfamilyhome.co.nz';
//const BUSINESS_NAME = 'Sam's Family Home';
const MOBILE_NUMBER = '021548329';
export interface RoomPrice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-manage-booking.',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})

export class ManageBookingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchByUserNameControl: FormControl = new FormControl();
  dataSource = new MatTableDataSource();
  msgs: Message[] = [];
  displayedColumns = [
    'bookingId',
    'checkin',
    'checkout',
    'guestName',
    'status',
    'action'
  ];
  name: FormControl = new FormControl();
  form: NgForm;
  //Spinner Properties
  spinner: Boolean = false;
  submitDisabled: Boolean = false;
  bookings: Booking[] = [];
  host: Host;
  airportService: string;
  user: ApplicationUser;
  ////
  title = 'Confirm Dialog';
  text = 'Just click a button!';
  selected: string;

  loaderText = 'Please wait';
  loadingTime = 3000;
  rooms: Room[];
  property: Property;
  pageTitle : string ;
  loader = false;
  bookingFromDate: FormControl = new FormControl();
  bookingToDate: FormControl = new FormControl();
  firstName: FormControl = new FormControl();
  lastName: FormControl = new FormControl();
  bookingEmail: FormControl = new FormControl();
  bookingContact: FormControl = new FormControl();
  todayDate = new Date();
  fromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  toDateMinMilliSeconds: number;
  toDateMaxMilliSeconds: number;
  booking: Booking;
  constructor(
    private http: HttpClient,
    private bookingService: BookingService,
    private dialog: MatDialog,
    private httpStatus: HTTPStatus,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private token: TokenStorage
  ) {
    this.showLoader();
    this.booking = new Booking();
  }
  ngOnInit() {
    this.spinner = false;
    this.submitDisabled = false;
    this.host = new Host();
    this.showLoader();
    this.user = new ApplicationUser();
    this.authService.getUserByUserId(this.token.getUserId()).subscribe(resp => {
      this.host.businessEmail = resp.body.username;
      this.host.businessName = resp.body.businessName;
      this.pageTitle = `Manage Bookings for property ${this.host.businessName}`;
      this.refresh();
    });
    const roomTypes = this.token.getRoomTypes();
    console.log(roomTypes);
  }
  onCloseBooking(): void {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
  ngAfterViewInit() {
    // console.log('here I am in ngAfterViewInit');
    // this.dataSource = new MatTableDataSource(this.payments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /*ngOnChanges() {
    console.log('here I am in ngOnChanges') ;
    if ( this.loader === true) {
      this.showLoader() ;
    }
  }*/

  refresh() {
  //  this.bookingService.getAllBookingsByHost(this.host).subscribe(data => {
    this.bookingService.getCurrentAndFutureBookings(+this.token.getPropertyId()).subscribe(data => {
      this.bookings = data.body;
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.bookings);
    });
  }
  findBookings() {
    console.log(this.booking);
    this.booking.propertyId = this.token.getProperty().id ;
    this.bookingService.findBookings(this.booking).subscribe(data => {
      this.bookings = data.body;
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getGuestsCheckingInToday() {
    console.log(this.booking);
    this.booking.propertyId = this.token.getProperty().id ;
    this.bookingService.getGuestChekingInToday(this.booking.propertyId).subscribe(data => {
      this.bookings = data.body;
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  getGuestsCheckingOutToday() {
    console.log(this.booking);
    this.booking.propertyId = this.token.getProperty().id ;
    this.bookingService.getGuestChekingOutToday(this.booking.propertyId).subscribe(data => {
      this.bookings = data.body;
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  getGuestsInHouseToday() {
    console.log(this.booking);
    this.booking.propertyId = this.token.getProperty().id ;
    this.bookingService.getGuestInHouseToday(this.booking.propertyId).subscribe(data => {
      this.bookings = data.body;
      this.dataSource = new MatTableDataSource(this.bookings);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  getAllBookings() {
    this.bookingService.getAllBookingsByHost(this.host).subscribe(response => {
      console.log(response);
    });
  }

  createBookingDialog() {
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        businessEmail: this.host.businessEmail,
        businessName: this.host.businessName,
        mobile: this.host.mobile
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  updateBookingDialog(row): void {
    console.log(row);
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        mobile: row.mobile,
        fromDate: row.fromDate,
        toDate: row.toDate,
        roomPrice: row.roomPrice,
        noOfPersons: row.noOfPersons,
        noOfRooms: row.noOfRooms,
        // airportService: this.getAirPortServiceType(row.airportShuttlePrice),
        externalBookingID: row.externalBookingID,
        bookingStatus: row.bookingStatus,
        externalSite: row.externalSite,
        payableAmount: row.payableAmount,
        businessEmail: row.businessEmail,
        roomId: row.roomId,
        roomName: row.roomName,
        propertyId: row.propertyId,
        notes: row.notes,
        services: row.services,
        totalServiceAmount: row.totalServiceAmount,
        totalExpenseAmount: row.totalExpenseAmount,
        totalPaymentAmount: row.totalPaymentAmount,
        outstandingAmount: row.outstandingAmount,
        discountAmount: row.discountAmount,
        modeOfPayment: row.modeOfPayment,
        createdBy: row.createdBy,
        createdDate: row.createdDate,
        lastModifiedBy: this.host.businessEmail,
        lastModifiedDate: row.lastModifiedDate
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh();
    });
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
      //    console.log(status);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  checkout(row) {
    row.checkoutTime = new Date();
    this.bookingService.checkout(row).subscribe(
      response => {
        if (response.status === 200) {
          this.openSuccessSnackBar('Guest CheckOut Done');
          this.refresh();
        }
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 417) {
            this.openErrorSnackBar(
              'CheckOut Error,Please check booking status and outstanding amount in booking details section'
            );
          }
        }
      }
    );
  }
  cancel(row) {
    this.bookingService.cancel(row.id).subscribe(
      response => {
        if (response.status === 200) {
          this.openSuccessSnackBar(
            'Booking Cancelled,Please check the expense section.'
          );
          this.refresh();
        }
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 417) {
            this.openErrorSnackBar(
              'Cancellation Error,Please check booking status ,only confirmed booking can be cancelled'
            );
          }
        }
      }
    );
  }
  checkin(row) {
    const dialogRef = this.dialog.open(AvailabilityComponent, {
      width: '450px',
      height: '250px',
      data: {
        id: row.id,
        roomId: row.roomId,
        noOfRooms: row.noOfRooms,
        firstName: row.firstName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  sendPaymentLink(row) {
    this.bookingService.sendPaymentLink(row.id).subscribe(
      response => {
        if (response.status === 200) {
          if (response.body === true) {
            this.openSuccessSnackBar('Payment Link Sent');
          } else {
            this.openErrorSnackBar('Problem in sending the payment link');
          }
        }
      },
      error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 417 || error.status === 500) {
            this.openErrorSnackBar('Paymentlink sent Error');
          }
        }
      }
    );
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
  downloadInvoice(url: string) {
    window.open(url, '_blank');
  }
  copyBooking(row): void {
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        roomId: row.roomId,
        noOfPersons: row.noOfPersons,
        noOfRooms: row.noOfRooms,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        mobile: row.mobile,
        businessEmail: row.businessEmail,
        propertyId: row.propertyId,
        notes: row.notes,
        modeOfPayment: row.modeOfPayment,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.refresh();
    });
  }

  modifyBooking(row, changeType): void {
    console.log(row);
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        mobile: row.mobile,
        fromDate: row.fromDate,
        toDate: row.toDate,
        roomPrice: row.roomPrice,
        noOfPersons: row.noOfPersons,
        noOfRooms: row.noOfRooms,
        noOfNights: row.noOfNights,
        externalBookingID: row.externalBookingID,
        bookingStatus: row.bookingStatus,
        externalSite: row.externalSite,
        payableAmount: row.payableAmount,
        businessEmail: row.businessEmail,
        roomId: row.roomId,
        roomName: row.roomName,
        propertyId: row.propertyId,
        notes: row.notes,
        services: row.services,
        totalServiceAmount: row.totalServiceAmount,
        totalExpenseAmount: row.totalExpenseAmount,
        totalPaymentAmount: row.totalPaymentAmount,
        outstandingAmount: row.outstandingAmount,
        discountAmount: row.discountAmount,
        modeOfPayment: row.modeOfPayment,
        totalAmount: row.payableAmount,
        createdBy: row.createdBy,
        createdDate: row.createdDate,
        lastModifiedBy: this.host.businessEmail,
        lastModifiedDate: row.lastModifiedDate,
        extraPersonCharge: row.extraPersonCharge,
        noOfExtraPerson: row.noOfExtraPerson,
        changeType: changeType

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
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
  enableDisableFindBookings(): boolean {
    if (
      (this.booking.firstName !== undefined && this.booking.firstName.length >= 3 ) ||
      (this.booking.lastName !== undefined && this.booking.lastName.length >= 2 ) ||
      (this.booking.email !== undefined && this.bookingEmail.valid) ||
      (this.booking.mobile !== undefined && this.bookingContact.valid) ||
      (this.booking.fromDate !== undefined && this.booking.toDate !== undefined)
      ) {
        return false;
    }else {
     return true ;
    }
  }
  searchReset(){
    this.booking = new Booking();
  }
}
