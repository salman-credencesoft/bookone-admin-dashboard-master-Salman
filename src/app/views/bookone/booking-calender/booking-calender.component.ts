import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { egretAnimations } from './../../../shared/animations/egret-animations';
import { BookingCalendarEvent } from './booking.event.model';
import { BookingCalendarService } from '../services/booking-calendar.service';
import { Host } from '../host/host';
import { TokenStorage } from './../../../token.storage';
import { BookingService } from './../services/booking.service';
import { Booking } from '../booking/booking';
import { HTTPStatus } from './../../../app.interceptor';
import { BookingComponent } from './../booking/booking.component';

@Component({
  selector: 'app-booking-calender',
  templateUrl: './booking-calender.component.html',
  styleUrls: ['./booking-calender.component.scss'],
  animations: egretAnimations
})
export class BookingCalenderComponent implements OnInit {
  public view = 'month';
  public viewDate = new Date();
  public activeDayIsOpen: boolean = true;
  public refresh: Subject<any> = new Subject();
  public events: BookingCalendarEvent[];
  private actions: CalendarEventAction[];
  private host: Host ;
  private bookings: Booking[];
  private booking: Booking;
  loader = false;
  constructor(
    public dialog: MatDialog,
    private calendarService: BookingCalendarService,
    private token: TokenStorage,
    private bookingService: BookingService,
    private httpStatus: HTTPStatus
  ) {
    this.actions = [{
      label: '<i class="material-icons icon-sm">edit</i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      }
    }
    //, {
    //  label: '<i class="material-icons icon-sm">close</i>',
    //  onClick: ({ event }: { event: CalendarEvent }): void => {
     //   this.removeEvent(event);
    //  }
   // }
  ];
    this.host = new Host();
    this.host.businessEmail = this.token.getProperty().email;
    this.host.businessName = this.token.getProperty().name;
  }
  ngOnInit() {
    this.showLoader();
    this.loadEvents();
  }

  public async loadEvents() {
    await  this.bookingService.populateCalenderBookings(this.token.getProperty().id).subscribe(
      response => {
        console.log('2');
        this.bookings = response.body;
        this.events = this.prepareBookingCalenderDB(this.bookings);
        this.events = this.initEvents(this.events);
      }
    );
  }
  private initEvents(events): BookingCalendarEvent[] {
    return events.map(event => {
      event.actions = this.actions;
      return new BookingCalendarEvent(event);
    });
  }
  public dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  public handleEvent(action: string, event: BookingCalendarEvent): void {
   // this.dialog = this.dialog.open()
   this.bookingService.findBooking(+event._id).subscribe(response => {
    this.booking = response.body ;
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        id: this.booking.id,
        firstName: this.booking.firstName,
        lastName: this.booking.lastName,
        email: this.booking.email,
        mobile: this.booking.mobile,
        fromDate: this.booking.fromDate,
        toDate: this.booking.toDate,
        roomPrice: this.booking.roomPrice,
        noOfPersons: this.booking.noOfPersons,
        noOfRooms: this.booking.noOfRooms,
        // airportService: this.getAirPortServiceType(this.booking.airportShuttlePrice),
        externalBookingID: this.booking.externalBookingID,
        bookingStatus: this.booking.bookingStatus,
        externalSite: this.booking.externalSite,
        payableAmount: this.booking.payableAmount,
        businessEmail: this.booking.businessEmail,
        roomId: this.booking.roomId,
        roomName: this.booking.roomName,
        propertyId: this.booking.propertyId,
        notes: this.booking.notes,
        services: this.booking.services,
        totalServiceAmount: this.booking.totalServiceAmount,
        totalExpenseAmount: this.booking.totalExpenseAmount,
        totalPaymentAmount: this.booking.totalPaymentAmount,
        outstandingAmount: this.booking.outstandingAmount,
        discountAmount: this.booking.discountAmount,
        modeOfPayment: this.booking.modeOfPayment,
        createdBy: this.booking.createdBy,
        createdDate: this.booking.createdDate,
        lastModifiedBy: this.host.businessEmail,
        lastModifiedDate: this.booking.lastModifiedDate
      }
    });
   });
}
public prepareBookingCalenderDB(bookings: Booking[]): BookingCalendarEvent[] {
  this.events = new Array<BookingCalendarEvent> ();
    bookings.forEach(booking => {
      const bookingCalenderEvent = new BookingCalendarEvent();
      bookingCalenderEvent._id = booking.id.toString();
      bookingCalenderEvent.start = this.convertJavaSQLDateToCalenderDate(booking.fromDate);
      bookingCalenderEvent.end = this.convertJavaSQLDateToCalenderDate(booking.toDate);
      bookingCalenderEvent.title = `${booking.firstName} ${booking.lastName}` ;
      bookingCalenderEvent.meta.notes = booking.notes ;
      this.events.push(bookingCalenderEvent);
    });
console.log('3');
return this.events;
}
convertJavaSQLDateToCalenderDate(date: string): Date {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const calenderDate = new Date();
  calenderDate.setFullYear(+year, +month - 1, +day);
  return calenderDate;
}
showLoader(): void {
  this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
    this.loader = status;
  });
}


}
