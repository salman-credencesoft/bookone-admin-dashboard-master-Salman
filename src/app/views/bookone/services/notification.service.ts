import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../booking/booking';
import { API_URL } from './../../../app.component';
import { Msg } from '../msg';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publish';


@Injectable()
export class NotificationService {
  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().publish().refCount();
  constructor(private http: HttpClient) { }
  sendTextMessage(message: Msg ) {
    return this.http.post<Msg>(API_URL + '/api/message/send', message, { observe: 'response' });
  }
  notify(message) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }
}
