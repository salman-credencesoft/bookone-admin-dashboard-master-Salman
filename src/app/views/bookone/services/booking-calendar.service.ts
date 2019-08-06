import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingCalendarEvent } from '../booking-calender/booking.event.model';
import { API_URL } from './../../../app.component';
import { Host } from '../host/host';
import { TokenStorage } from './../../../token.storage';
import { BookingService } from './../services/booking.service';
import { Booking } from '../booking/booking';

@Injectable()
export class BookingCalendarService {
  public bookingsevents: BookingCalendarEvent[];
  private host: Host;
  private bookings: Booking[];
  constructor(
    private token: TokenStorage,
    private bookingService: BookingService,
    private httpClient: HttpClient
  ) {
    this.host = new Host();
    this.host.businessEmail = this.token.getProperty().email;
    this.host.businessName = this.token.getProperty().name;
  }

  public async    getEvents(): Promise<any>  {
   await  this.bookingService.getAllBookingsByHost(this.host).subscribe(
      response => {
        console.log('2');
        this.bookings = response.body;
        this.bookingsevents = this.prepareBookingCalenderDB(this.bookings);
      }
    );
    console.log('3');
      return of (this.bookingsevents) ;
    }
  public prepareBookingCalenderDB(bookings: Booking[]): BookingCalendarEvent[] {
      this.bookingsevents = new Array<BookingCalendarEvent> ();
        bookings.forEach(booking => {
          const bookingCalenderEvent = new BookingCalendarEvent();
          bookingCalenderEvent._id = booking.id.toString();
          bookingCalenderEvent.start = this.convertJavaSQLDateToCalenderDate(booking.fromDate);
          bookingCalenderEvent.end = this.convertJavaSQLDateToCalenderDate(booking.toDate);
          this.bookingsevents.push(bookingCalenderEvent);
        });
    console.log('3');
    return this.bookingsevents;
  }

  public addEvent(event): Observable<BookingCalendarEvent[]> {
    // return this.http.post('api/calendar/events', event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.bookingsevents.push(event);
    return of(this.bookingsevents);
  }

  public updateEvent(event): Observable<BookingCalendarEvent[]> {
    // return this.http.put('api/calendar/events/'+event._id, event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.bookingsevents = this.bookingsevents.map(e => {
      if (e._id === event._id) {
        return Object.assign(e, event);
      }
      return e;
    });
    return of(this.bookingsevents);
  }

  public deleteEvent(eventID: string): Observable<BookingCalendarEvent[]> {
    // return this.http.delete('api/calendar/events/'+eventID)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.bookingsevents = this.bookingsevents.filter(e => e._id !== eventID);
    return of(this.bookingsevents);
  }


  convertJavaSQLDateToCalenderDate(date: string): Date {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const calenderDate = new Date();
    calenderDate.setFullYear(+year, +month - 1, +day);
    return calenderDate;
  }
  async   getAllBookings() {
    await this.bookingService.getAllBookingsByHost(this.host).subscribe(
    response => {
      console.log('2');
      this.bookings = response.body;
      this.bookingsevents = this.prepareBookingCalenderDB(this.bookings);
    }

  );
  }
}

