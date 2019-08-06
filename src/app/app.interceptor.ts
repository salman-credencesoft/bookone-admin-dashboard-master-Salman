import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {TokenStorage} from './token.storage';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';


const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private token: TokenStorage, private router: Router, private status: HTTPStatus) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    let authReq = req;
    this.status.setHttpStatus(true);
  //  console.log('URL:->' + req.url);
  //   console.log('Token:->' + this.token.getToken());
    if (this.token.getToken() != null && req.url.indexOf('googleapis') < 0 ) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken())});
    }
          /*return next.handle(authReq).pipe(
            map(event => {
              return event;
            }),*/
            return next.handle(authReq).pipe(
              map(event => {
                return event;
              }),
            catchError( error => {
              if (error instanceof HttpErrorResponse) {
                console.log('error :->' + error.message);
                if (error.status === 401) {
                  this.router.navigate(['user']);
                }
              }
              return next.handle(req);
            }),
            finalize(() => {
              this.status.setHttpStatus(false);
            })
            );
           /* catchError(error => {
              if (error instanceof HttpErrorResponse) {
                console.log('error :->' + error.message);
                if (error.status === 401) {
                  this.router.navigate(['user']);
                }
              }
              return error;
            }),
            finalize(() => {
              this.status.setHttpStatus(false);
            })
          );*/
  }

}
