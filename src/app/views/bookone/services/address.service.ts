
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpClient , HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
export interface Results {
  addresses: string[];
}
@Injectable ()
export class AddressService {
    constructor(
        private http: HttpClient
    ){}
    googleAddressApi= 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    googleAddressApiKey= 'AIzaSyDjFN8G7LSVfyGd6jw6mj4PHh_djP0b0fA';
 public getAddressFromKeyWord(key: string): Observable<any>{
    console.log('Trying to call google api with pincode' + key);
    const URL = `${this.googleAddressApi}` + `${key}` + '&region=nz' + '&key=' + `${this.googleAddressApiKey}`;
    console.log('URL for google api:' + URL);
    return this.http.get<any>(URL, { observe: 'response' } );
    }
}
