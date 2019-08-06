import { API_URL } from './../../../app.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoomDetails } from './../availability/availability.component';
import { RatesAndAvailability } from './../rates-availability/manage/manage-rates-availability.component';
import { Bed } from './../bed/bed';
@Injectable()
export class AvailabilityService {
    constructor(private http: HttpClient) { }
    getAvailableRooms(bookingId: number) {
        return this.http.get<RoomDetails[]>(API_URL + '/api/availability/getAvailableRooms/' + bookingId , { observe: 'response' });
      }
    getAvailableBeds(bookingId: number) {
        return this.http.get<Bed[]>(API_URL + '/api/availability/getAvailableBeds/' + bookingId , { observe: 'response' });
      }
    getAllRoomStatusForToday(propertyId: number){
        return this.http.get<RoomDetails[]>(API_URL + '/api/availability/getAllRoomsOnCurrentDate/' + propertyId , { observe: 'response' });
    }
    getAvailabilityForPropertyAllNext7Days(propertyId: number) {
        return this.http.get<RatesAndAvailability[]>(API_URL + '/api/availability/getNext7daysRatesAndAvailabilityForProperty?PropertyId='
         + propertyId , { observe: 'response' });
    }
    getAvailabilityForRoomAllNext7Days(propertyId: number, roomId: number) {
        return this.http.get<RatesAndAvailability[]>(API_URL + '/api/availability/getNext7daysRatesAndAvailabilityForRoom?PropertyId='
         + propertyId + '&RoomId=' + roomId , { observe: 'response' });
    }
    updateRatesAvailability(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<RatesAndAvailability>(API_URL + '/api/availability/updateAvailability', rateAndAvailability,
        { observe: 'response' } ) ;
    }
    getAvailabilityForPropertyByDate(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<RatesAndAvailability[]>(API_URL + '/api/availability/getRatesAndAvailabilityForPropertyByDate',
         rateAndAvailability, { observe: 'response' } ) ;
    }
    getAvailabilityForRoomByDate(rateAndAvailability: RatesAndAvailability) {
        return this.http.post<RatesAndAvailability[]>(API_URL + '/api/availability/getRatesAndAvailabilityForRoomByDate',
         rateAndAvailability, { observe: 'response' } ) ;
    }
}
