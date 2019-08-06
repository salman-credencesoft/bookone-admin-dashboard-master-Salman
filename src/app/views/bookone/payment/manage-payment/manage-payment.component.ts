
import { Component, AfterViewChecked, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Payment } from './../../payment/payment';
import { Booking } from './../../booking/booking';
import { PaymentService } from '../../services/payment.service';
import { HTTPStatus } from './../../../../app.interceptor';
import { PaymentComponent } from './../../payment/payment.component';
import { TokenStorage } from './../../../../token.storage';
import { AuthService } from './../../services/auth.service';
import { ApplicationUser } from './../../../sessions/signup/user';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.scss']
})
export class ManagePaymentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchByUserNameControl: FormControl = new FormControl();
  dataSource = new MatTableDataSource();
  msgs: Message[] = [];
  displayedColumns = ['id', 'paymentReference', 'description', 'amount', 'paymentMode', 'status',
    'action'];
  name: FormControl = new FormControl();
  form: NgForm;
  spinner: Boolean = false;
  payments: Payment[] = [];
  loader = false;
  user: ApplicationUser;
  showNavbar: Boolean = true;
  @Input() booking: Booking;
  constructor(private paymentService: PaymentService,
    private httpStatus: HTTPStatus, private dialog: MatDialog,
    private authService: AuthService, private token: TokenStorage) {
    this.showLoader();
  }

  ngOnInit() {
    this.spinner = false;
    this.user = new ApplicationUser();
    this.authService.getUserByUserId(this.token.getUserId()).subscribe(
      resp => {
        this.user.username = resp.body.username;
      });
    if (this.booking != null && this.booking !== undefined && this.booking.id > 0) {
      this.showNavbar = false;
      this.paymentService.findPaymentByReferenceNumber(this.booking.id.toString())
        .subscribe(res => {
          this.payments = res;
          this.dataSource = new MatTableDataSource(this.payments);
        });
    } else {
      this.showNavbar = true;
      this.refresh();
    }
  }
  updatePaymentDialog(row) {
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '600px',
      data: {
        id: row.id,
        referenceNumber: row.referenceNumber,
        amount: row.amount,
        email: row.email,
        description: row.description,
        externalReference: row.externalReference,
        currency: row.currency,
        paymentMode: row.paymentMode,
        status: row.status,
        businessEmail: row.businessEmail,
        propertyId: row.propertyId,
        name: row.name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.refresh();
    });
  }
  createPaymentDialog() {
    const dialogRef = this.dialog.open(PaymentComponent, {
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
  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource(this.payments);

  }
  refresh() {
    this.paymentService.findAllPaymentsForUser().subscribe(data => {
      this.payments = data;
      this.dataSource = new MatTableDataSource(this.payments);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
}
