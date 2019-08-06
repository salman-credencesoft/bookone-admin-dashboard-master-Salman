import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PaymentService } from './../../services/payment.service';
import { TokenStorage } from './../../../../token.storage';
import { HTTPStatus } from './../../../../app.interceptor';
export interface PaymentSummary {
  mode: string;
  amount: number;
  count: number;
  status: string;
}

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = ['mode', 'amount', 'status', 'count'];
  paymentSummaries: PaymentSummary[] = [];
  loader = false ;
  totalPayment: number ;
  @Output() totalPaymentEmit = new EventEmitter<number>();
  @ViewChild(MatSort) sort: MatSort;
  constructor(private paymentService: PaymentService, private token: TokenStorage,
    private httpStatus: HTTPStatus) {
      this.showLoader();
     }
  ngOnInit() {
    this.paymentService.findPaymentSummaryByPropertyId(+this.token.getPropertyId()).subscribe(
      resp1 => {
        for (let num = 0; num < resp1.length; num++) {
          const paymentSummary: PaymentSummary = {
            amount: resp1[num][0],
            mode: resp1[num][1],
            status: resp1[num][2],
            count: resp1[num][3]

          };
          this.paymentSummaries.push(paymentSummary);
        }
        this.dataSource = new MatTableDataSource(this.paymentSummaries);
        this.dataSource.sort = this.sort;
        this.getTotalPayment();
      }
    );
  }
  getTotalPayment() {
    this.totalPayment =  this.paymentSummaries.map(t => t.amount).reduce((acc, value) => acc + value, 0);
    this.totalPaymentEmit.emit(this.totalPayment);
    return  this.totalPayment;
   }
   showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
}
