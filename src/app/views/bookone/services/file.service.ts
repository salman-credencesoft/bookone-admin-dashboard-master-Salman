import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './../../../app.component';
import { HttpHeaders } from '@angular/common/http';
import { TokenStorage } from './../../../token.storage';

import { Observable } from 'rxjs';
@Injectable()
export class FileService {
    headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
    constructor(private http: HttpClient, private token: TokenStorage) { }
    fileUploadToCloud(formData: any): Observable<any> {
        return this.http.post<any>(API_URL + '/api/file/fileUploadCloudBookingApp', formData, this.httpOptions);
    }
}

