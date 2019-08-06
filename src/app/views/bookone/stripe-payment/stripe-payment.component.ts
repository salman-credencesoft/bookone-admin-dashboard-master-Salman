import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { Message } from 'primeng/components/common/api';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Payment } from './../payment/payment';
import { MonthType } from './../enums/Month';
import {MatSnackBar} from '@angular/material';
import { HTTPStatus } from './../../../app.interceptor';

export interface Year {
  value: string;
  viewValue: string;
}
export interface Currency {
  value: string;
  viewValue: string;
}
export interface Month {
  value: string;
  viewValue: string;
}
export interface PaymentMode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})

export class StripePaymentComponent implements OnInit {
  cardNumber: FormControl = new FormControl();
  referenceNumber: FormControl = new FormControl();
  name: FormControl = new FormControl();
  email: FormControl = new FormControl();
  currency: FormControl = new FormControl();
  amount: FormControl = new FormControl();
  cardHolderName: FormControl = new FormControl();
  description: FormControl = new FormControl();
  externalReference: FormControl = new FormControl();
  paymentMode: FormControl = new FormControl();
  expMonth: FormControl = new FormControl();
  expYear: FormControl = new FormControl();
  cvv: FormControl = new FormControl();
  data: Payment ;
  MonthType = MonthType;
  loader = false ;
  paymentModes: PaymentMode[] = [
    { value: 'Card', viewValue: 'Card' },
    { value: 'Cash', viewValue: 'Cash' },
    { value: 'Bank Transfer', viewValue: 'Bank Transfer' },
    { value: 'Wallet', viewValue: 'Wallet' },
    { value: 'Cheque', viewValue: 'Cheque' },
    { value: 'DemandDraft', viewValue: 'DemandDraft' }
  ];
  years: Year[] = [
    {value: '2018', viewValue: '2018'},
    {value: '2019', viewValue: '2019'},
    {value: '2020', viewValue: '2020'},
    {value: '2021', viewValue: '2021'},
    {value: '2022', viewValue: '2022'},
    {value: '2023', viewValue: '2023'}
  ];
  currencies: Currency[] = [
    {value: 'NZD', viewValue: 'NZD'},
    {value: 'AUD', viewValue: 'AUD'},
    {value: 'GBP', viewValue: 'GBP'},
    {value: 'USD', viewValue: 'USD'},
    {value: 'EUR', viewValue: 'EUR'},
  ];
  months: Month[] = [
    {value: '01', viewValue: '01'},
    {value: '02', viewValue: '02'},
    {value: '03', viewValue: '03'},
    {value: '04', viewValue: '04'},
    {value: '05', viewValue: '05'},
    {value: '06', viewValue: '06'},
    {value: '07', viewValue: '07'},
    {value: '08', viewValue: '08'},
    {value: '09', viewValue: '09'},
    {value: '10', viewValue: '10'},
    {value: '11', viewValue: '11'},
    {value: '12', viewValue: '12'}
  ];
  constructor(private paymentService: PaymentService,private snackBar: MatSnackBar, 
    private httpStatus: HTTPStatus) {
      this.showLoader();
     }
  ngOnInit() {
    this.data = new Payment();
  }
  submit(){
    console.log(this.data.paymentMode);
    if(this.data.paymentMode != null && this.data.paymentMode === 'CARD' ) {
      this.chargeCreditCard();
    }
    else{
      this.processPayment(this.data);
    }
  }
  chargeCreditCard() {
    console.log(this.data);
    (<any>window).Stripe.card.createToken({
      number: this.data.cardNumber,
      exp_month: this.data.expMonth,
      exp_year: this.data.expYear,
      cvc: this.data.cvv,

    }, (status: number, response: any) => {
      if (status === 200) {
        const token = response.id;
        this.data.token = token ;
        this.processPayment(this.data);
      } else {
        const snackBarRef = this.snackBar.open('Error message :' + response.error.message );
        snackBarRef.dismiss();
      }
    });
  }
  processPayment(payment: Payment) {
    this.paymentService.processPayment(payment)
      .subscribe(data => {
        this.data = data.body;
        if (this.data.paymentMode === 'CARD' && this.data.status === 'succeeded' && this.data.id != null) {
          this.openSuccessSnackBar();
          this.reset();
        }else if ( (this.data.paymentMode === 'CASH' || this.data.paymentMode === 'BANK_TRANSFER') && this.data.id != null ) {
          this.openSuccessSnackBar();
          this.reset();
        }else {
         this.snackBar.open('ErroCode:' + data.body.failureCode + 'and Error message :' + data.body.failureMessage, '' , {
            duration: 10000,
          });
        }

      });

}
reset() {
  console.log(this.data);
  this.data = new Payment();
}
showLoader(): void {
  this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
    this.loader = status;
  });
}
openSuccessSnackBar() {
  this.snackBar.open('Payment processed Successfully!', 'Success!', {
    panelClass: ['mat--success'],
    verticalPosition: 'top',
    horizontalPosition: 'right',
    duration: 4000
  });
}

openErrorSnackBar(erroCode: string , errorMessage: string) {
  this.snackBar.open('Error in Processing the Card!', `Error Code: ${erroCode} & Error Message: ${errorMessage}`, {
    panelClass: ['mat--errors'],
    verticalPosition: 'top',
    horizontalPosition: 'right',
    duration: 4000
  });
}
}
