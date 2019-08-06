import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { ExpenseService } from './../../services/expense.service';
import { TokenStorage } from './../../../../token.storage';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Expense } from './../expense/expense';
export interface ExpenseSummary {
  name: string;
  amount: number;
}
@Component({
  selector: 'app-expense-summary',
  templateUrl: './expense-summary.component.html',
  styleUrls: ['./expense-summary.component.css']
})

export class ExpenseSummaryComponent implements OnInit {
  dataSource = new MatTableDataSource();
  constructor(private expenseService: ExpenseService, private token: TokenStorage) { }
  displayedColumns = ['type', 'amount'];
  expenseSummaries: ExpenseSummary[] = [];
  totalExpense: number ;
  @Output() totalExpenseEmit = new EventEmitter<number>();
  loader = false ;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this.expenseService.findExpenseSummaryByPropertyId(+this.token.getPropertyId()).subscribe(
      resp1 => {
        for (let num = 0; num < resp1.length; num++) {
          const expenseSummary: ExpenseSummary = {
            name: resp1[num][1],
            amount: resp1[num][0]
          };
          this.expenseSummaries.push(expenseSummary);
        }
        this.dataSource = new MatTableDataSource(this.expenseSummaries);
        this.dataSource.sort = this.sort;
        this.getTotalExpense();
      }
    );
  }

  /** Gets the total cost of all transactions. */
  getTotalExpense() {
   this.totalExpense =  this.expenseSummaries.map(t => t.amount).reduce((acc, value) => acc + value, 0);
   this.totalExpenseEmit.emit(this.totalExpense);
   return  this.totalExpense;
  }

}
