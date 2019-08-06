
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
// Cool library to deal with errors: https://www.stacktracejs.com
import * as StackTraceParser from 'error-stack-parser';
import { TokenStorage } from './../../../token.storage';
import { API_URL } from './../../../app.component';


@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor(
    private injector: Injector,
    private tokenStorage: TokenStorage,
    private http: HttpClient
  ) { }
log(error) {
    // Log the error to the console
    console.error(error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    // need to add an email
   return this.sendErrorMessage(errorToSend);
}
addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'BookOne';
    const user = this.tokenStorage.getUserId;
    const propertyId = this.tokenStorage.getPropertyId;
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const errorToSend = {name, appId, user, propertyId,  time, id, url, status, message, stack};
    return errorToSend;
  }
  sendErrorMessage(errorToSend: any): Observable<Boolean> {
    return this.http.post<Boolean>(API_URL, errorToSend);
}
}
