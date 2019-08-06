import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from './../../../app.component';
import { HttpHeaders } from '@angular/common/http';
import { TokenStorage } from './../../../token.storage';
import { Expense } from '../manage-expense/expense/expense';
import { Observable } from 'rxjs';
export interface ExpenseSummary {
  name: string;
  amount: number;
}
@Injectable()
export class ExpenseService {
    headers = new Headers();
  httpOptions = {
    headers: new HttpHeaders({
      'USER_ID': this.token.getUserId()
    })
  };
    currentUser: any;
    constructor(private http: HttpClient, private token: TokenStorage) { }
    saveExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(API_URL + '/api/expense/add', expense, this.httpOptions);
    }
    findAllExpensesByUser(submittedBy: string): Observable<Expense[]> {
      return this.http.get<any>(API_URL + '/api/expense/findByUser/' + submittedBy , this.httpOptions);
    }
    findAllExpensesByBookingId(bookingId: number): Observable<Expense[]> {
      return this.http.get<any>(API_URL + '/api/expense/findByBookingId/' + bookingId , this.httpOptions);
    }
    findExpenseSummaryByPropertyId(propertyId: number): Observable<ExpenseSummary[]> {
      return this.http.get<any>(API_URL + '/api/expense/findExpenseSummaryByPropertyId/' + propertyId , this.httpOptions);
    }
}

