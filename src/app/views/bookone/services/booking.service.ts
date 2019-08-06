import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from './../payment/payment';
import { Host } from './../host/host';
import { Booking } from './../booking/booking';
import { API_URL } from './../../../app.component';
import { Service } from './../service/service';
import { RoomDetails } from './../availability/availability.component';
import { Observable } from 'rxjs';
@Injectable()
export class BookingService {
  constructor(private http: HttpClient) { }
  processPayPalPayment(payment: Payment) {
    return this.http.post(API_URL + '/api/payment/create', payment, { observe: 'response' });
  }
  getAllBookingsByHost(host: Host) {
    return this.http.post<Booking[]>(API_URL + '/api/booking/findAll', host, { observe: 'response' });
  }
  getCurrentAndFutureBookings(propertyId: number) {
    return this.http.get<Booking[]>(API_URL + '/api/booking/getCurrentAndFutureBookings/' + propertyId, { observe: 'response' });
  }
  saveBooking(booking: Booking) {
    return this.http.post<Booking>(API_URL + '/api/booking/save', booking, { observe: 'response' });
  }
  checkAvailability(booking: Booking) {
    return this.http.post<Booking> (API_URL + '/api/availability/checkAvailability', booking ,  { observe: 'response' });
  }
  getAllServicesByBooking(bookingId: number) {
    return this.http.get<Service[]>(API_URL + '/api/booking/findAllServices/' + bookingId , { observe: 'response' });
  }
  addServiceTOBooking(bookingId: number, service: Service) {
     return this.http.post<Booking> (API_URL + '/api/booking/add/service/' + bookingId, service ,  { observe: 'response' });
  }
  deleteService(serviceId: number) {
    return this.http.get (API_URL + '/api/booking/delete/service/' + serviceId ,  { observe: 'response' });
  }
  updateService(bookingId: number, service: Service) {
    return this.http.post<Service> (API_URL + '/api/booking/update/service/' + bookingId  , service ,  { observe: 'response' });
  }
  checkin( booking: Booking ) {
    return this.http.post<Booking>(API_URL + '/api/booking/checkin', booking, { observe: 'response' });
  }
  checkout(booking: Booking) {
    return this.http.post<Booking>(API_URL + '/api/booking/checkout', booking, { observe: 'response' });
  }
  cancel(bookingId: number) {
    return this.http.get<Booking>(API_URL + '/api/booking/cancel/' + bookingId , { observe: 'response' });
  }
  getNoOfGuestChekingInToday(propertyId: number) {
    return this.http.get<number>(API_URL + '/api/booking/getNoOfGuestCheckInToday/' + propertyId , { observe: 'response' });
  }
  getNoOfGuestChekingOutToday(propertyId: number) {
    return this.http.get<number>(API_URL + '/api/booking/getNoOfGuestCheckOutToday/' + propertyId , { observe: 'response' });
  }
  getNoOfGuestInHouseToday(propertyId: number){
    return this.http.get<number>(API_URL + '/api/booking/getNoOfGuestInHouseToday/' + propertyId , { observe: 'response' });
  }
  getGuestChekingInToday(propertyId: number) {
    return this.http.get<Booking[]>(API_URL + '/api/booking/getGuestsCheckInToday/' + propertyId , { observe: 'response' });
  }
  getGuestChekingOutToday(propertyId: number) {
    return this.http.get<Booking[]>(API_URL + '/api/booking/getGuestsCheckOutToday/' + propertyId , { observe: 'response' });
  }
  getGuestInHouseToday(propertyId: number){
    return this.http.get<Booking[]>(API_URL + '/api/booking/getGuestsInHouseToday/' + propertyId , { observe: 'response' });
  }
  sendPaymentLink(bookingId: number ) {
    return this.http.get<boolean>(API_URL + '/api/booking/requestPayment/' + bookingId , { observe: 'response' });
  }
  modifyDate(booking: Booking) {
    console.log(booking);
    return this.http.post<Booking>(API_URL + '/api/booking/dateAmendment', booking, { observe: 'response' });
  }
  modifyRoom(booking: Booking) {
    return this.http.post<Booking>(API_URL + '/api/booking/roomAmendment', booking, { observe: 'response' });
  }
  modifyGuestNumber(booking: Booking) {
    return this.http.post<Booking>(API_URL + '/api/booking/guestAmendment', booking, { observe: 'response' });
  }
  findBookings(booking: Booking) {
    return this.http.post<Booking[]>(API_URL + '/api/booking/findBookings', booking, { observe: 'response' });
  }
  populateCalenderBookings(propertyId: number){
    return this.http.get<Booking[]>(API_URL + '/api/booking/getCalenderBookings/' + propertyId , { observe: 'response' });
  }
  findBooking(bookingId: number) {
    return this.http.get<Booking>(API_URL + '/api/booking/findById?BookingId=' +  bookingId, { observe: 'response' });
  }
}
