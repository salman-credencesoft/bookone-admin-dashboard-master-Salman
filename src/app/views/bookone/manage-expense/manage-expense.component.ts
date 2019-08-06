import {
  Component,
  AfterViewChecked,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input
} from '@angular/core';

import { ApplicationUser } from './../../sessions/signup/user';
import { TokenStorage } from './../../../token.storage';
import { AuthService } from './../services/auth.service';
import { ExpenseService } from './../services/expense.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import { HTTPStatus } from './../../../app.interceptor';
import { ExpenseComponent } from './expense/expense.component';
import { Expense } from './expense/expense';
import { Booking } from './../booking/booking';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-manage-expense',
  templateUrl: './manage-expense.component.html',
  styleUrls: ['./manage-expense.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ManageExpenseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    'id',
    'date',
    'type',
    'description',
    'amount',
    'receiptno',
    'action'
  ];
  /* , 'date', 'name', 'description',
  'amount', 'receiptno', 'bookingrefno'*/
  user: ApplicationUser;
  expenses: Expense[] = [];
  loader = false;
  showNavbar = true;
  //@ViewChild(DatatableComponent) table: DatatableComponent;
  @Input() booking: Booking;
  constructor(
    private token: TokenStorage,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private httpStatus: HTTPStatus,
    private dialog: MatDialog
  ) {}
  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource(this.payments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.showLoader();
    this.user = new ApplicationUser();
    if (
      this.booking != null &&
      this.booking !== undefined &&
      this.booking.id > 0
    ) {
      this.showNavbar = false;
      console.log(this.booking.id);
      this.refreshExpenses();
    } else {
      this.authService
        .getUserByUserId(this.token.getUserId())
        .subscribe(resp => {
          this.user.username = resp.body.username;
          this.refresh();
        });
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
      //  console.log(status);
    });
  }
  updateExpenseDialog(row) {
    console.log(row.date);
    const dialogRef = this.dialog.open(ExpenseComponent, {
      width: '600px',
      data: {
        id: row.id,
        name: row.name,
        date: row.date,
        propertyId: row.propertyId,
        email: row.email,
        description: row.description,
        amount: row.amount,
        receiptNumber: row.receiptNumber,
        notes: row.notes,
        submittedBy: row.submittedBy,
        bookingId: row.bookingId,
        receiptFileName: row.receiptFileName,
        businessEmail: row.businessEmail,
        externalReference: row.externalReference
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  createExpenseDialog() {
    const dialogRef = this.dialog.open(ExpenseComponent, {
      width: '600px',
      data: {
        businessEmail: this.user.username,
        propertyId: this.token.getPropertyId()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  refresh() {
    if (this.booking !== undefined) {
      this.refreshExpenses();
    } else {
      this.expenseService
        .findAllExpensesByUser(this.user.username)
        .subscribe(resp1 => {
          this.expenses = resp1;
          this.dataSource = new MatTableDataSource(this.expenses);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    }
  }
  refreshExpenses() {
    this.expenseService
      .findAllExpensesByBookingId(this.booking.id)
      .subscribe(res => {
        this.expenses = res;
        this.dataSource = new MatTableDataSource(this.expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}
