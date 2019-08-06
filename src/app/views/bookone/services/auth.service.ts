import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationUser } from './../../sessions/signup/user';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from './../../../app.component';
import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { Token } from './token' ;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class AuthService {
  currentUser: any;
  constructor(private http: HttpClient) { }
logout() {
    sessionStorage.removeItem('AuthToken');
    sessionStorage.removeItem('UserId');
    sessionStorage.removeItem('PropertyId');
    sessionStorage.removeItem('RoomDetails');
    sessionStorage.removeItem('PropertyDetails');
    window.sessionStorage.clear();
  }

  login(credentials) {
    return this.http.post<Token>(API_URL + '/user/login', credentials, { observe: 'response' });
  }
  createUser(applicationUser: ApplicationUser) {
    console.log(applicationUser);
    return this.http.post<ApplicationUser>(API_URL + '/user/signup', applicationUser, { observe: 'response' });
  }
  updateUser(applicationUser: ApplicationUser) {
    console.log(applicationUser);
    return this.http.post<ApplicationUser>(API_URL + '/api/user/update', applicationUser, { observe: 'response' });
  }
  getAll(): Observable<ApplicationUser[]> {
    console.log(API_URL + '/users');
    return this.http.get<ApplicationUser[]>(API_URL + '/api/user/findAll');
}
  getUserDetailsByUserName(userName: string ) {
    return this.http.get<ApplicationUser>(API_URL + '/api/user/findByName/' + userName, { observe: 'response' } );
  }
  getUserByUsername(userName: string ) {
    return this.http.get<ApplicationUser>(API_URL + '/api/user/findByName/' + userName, { observe: 'response' } );
  }
  getUserByUserId(userId: string ) {
    return this.http.get<ApplicationUser>(API_URL + '/api/user/findById/' + userId, { observe: 'response' } );
  }
}

