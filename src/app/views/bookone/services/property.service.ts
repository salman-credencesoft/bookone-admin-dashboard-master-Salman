import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../property/property';
import { API_URL } from './../../../app.component';
import { TokenStorage } from './../../../token.storage';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from './../room/room' ;

@Injectable()
export class PropertyService {
  headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
  constructor(private http: HttpClient, private token: TokenStorage) { }
  createProperty(property: Property): Observable<Property> {
    console.log(property);
     return this.http.post<Property>(API_URL + '/api/property/user/add/property', property, this.httpOptions);
  }
  getPropertiesDetailsByUserId(userId: string): Observable<Property[]> {
    return this.http.get<Property[]>(API_URL + '/api/property/findByUserId/' + userId);
  }
  addRoomToProperty(propertyId: number , room: Room ): Observable<Room> {
    return this.http.post<Room>(API_URL + '/api/property/' +  propertyId + '/user/add/room' , room, this.httpOptions);
  }
  addYearlyRatesForProperty(property: Property ) {
    return this.http.post<any>(API_URL + '/api/property/addYearlyRates' , property , this.httpOptions);
  }
  addYearlyRatesForRoom(room: Room ) {
    return this.http.post<any>(API_URL + '/api/room/addYearlyRates' , room , this.httpOptions);
  }
  findAllRoomsForProperty(propertyId: number) {
    console.log('User ID from Token'+ this.token.getUserId());
    console.log('HTTP Options'+ this.httpOptions);
    return this.http.get<any>(API_URL + '/api/property/' + propertyId + '/user/findAll/rooms', this.httpOptions);
  }
  getPropertyDetailsByPropertyId(propertyId: number): Observable <Property> {
    return this.http.get<Property>(API_URL + '/api/property/findById/' + propertyId, this.httpOptions);
  }
}
