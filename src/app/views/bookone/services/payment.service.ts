import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './../../../app.component';
import { Payment } from './../payment/payment';
import { HttpHeaders } from '@angular/common/http';
import { TokenStorage } from './../../../token.storage';
import { Observable } from 'rxjs';
@Injectable()
export class PaymentService {
    headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
    currentUser: any;
    constructor(private http: HttpClient, private token: TokenStorage) { }
    processPayment(paymentDetails: Payment) {
        return this.http.post<Payment>(API_URL + '/api/payment/process', paymentDetails, { observe: 'response' });
    }
    findAllPaymentsForUser() {
    return this.http.get<Payment[]>(API_URL + '/api/payment/findAllByBusinessEmail', this.httpOptions);
    }
    savePayment(paymentDetails: Payment) {
      return this.http.post<Payment>(API_URL + '/api/payment/savePayment', paymentDetails, { observe: 'response' });
  }
  findPaymentByReferenceNumber(referenceNumber: string){
    return this.http.get<Payment[]>(API_URL + '/api/payment/findPaymentByBookingId/' + referenceNumber, this.httpOptions);
  }
  findPaymentSummaryByPropertyId(propertyId: number): Observable<any> {
    return this.http.get<any>(API_URL + '/api/payment/findPaymentSummaryByPropertyId/' + propertyId , this.httpOptions);
  }
}

