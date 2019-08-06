import { Component, OnInit, Input, Inject } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { Message } from 'primeng/components/common/api';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Payment } from './payment';
import { MonthType } from '../enums/Month';
import { MatSnackBar } from '@angular/material';
import { HTTPStatus } from './../../../app.interceptor';
import { Booking } from '../booking/booking';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
export interface PaymentStaus {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  cardNumber: FormControl = new FormControl();
  referenceNumber: FormControl = new FormControl('', [Validators.required]);
  name: FormControl = new FormControl();
  email: FormControl = new FormControl();
  currency: FormControl = new FormControl('', [Validators.required]);
  amount: FormControl = new FormControl('', [Validators.required]);
  cardHolderName: FormControl = new FormControl();
  description: FormControl = new FormControl();
  externalReference: FormControl = new FormControl();
  paymentMode: FormControl = new FormControl('', [Validators.required]);
  expMonth: FormControl = new FormControl();
  expYear: FormControl = new FormControl();
  cvv: FormControl = new FormControl();
  status: FormControl = new FormControl();
  isControlEnabled: boolean ;


  paymentForm: FormGroup = new FormGroup({
    referenceNumber: this.referenceNumber,
    amount: this.amount,
    paymentMode: this.paymentMode,
    currency: this.currency
  });



  data: Payment;
  MonthType = MonthType;
  loader = false;
  @Input() booking: Booking;
  payments: Payment[];
  dataSource = new MatTableDataSource();
  paymentStatuses: PaymentStaus[] = [
    { value: 'Paid', viewValue: 'Paid' },
    { value: 'NotPaid', viewValue: 'NotPaid' }
  ];

  paymentModes: PaymentMode[] = [
    { value: 'BankTransfer', viewValue: 'BankTransfer' },
    { value: 'Card', viewValue: 'Card' },
    { value: 'Cash', viewValue: 'Cash' },
    { value: 'Cheque', viewValue: 'Cheque' },
    { value: 'DemandDraft', viewValue: 'DemandDraft' },
    { value: 'PaymentTerminal', viewValue: 'PaymentTerminal' },
    { value: 'Wallet', viewValue: 'Wallet' }
  ];
  years: Year[] = [
    { value: '2018', viewValue: '2018' },
    { value: '2019', viewValue: '2019' },
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' },
    { value: '2025', viewValue: '2025' },
    { value: '2026', viewValue: '2026' },
    { value: '2027', viewValue: '2027' },
    { value: '2028', viewValue: '2028' },
    { value: '2029', viewValue: '2029' },
    { value: '2030', viewValue: '2030' }

  ];
  currencies: Currency[] = [
    { value: 'nzd', viewValue: 'NZD' },
    { value: 'inr', viewValue: 'INR' },
    { value: 'aud', viewValue: 'AUD' },
    { value: 'gbp', viewValue: 'GBP' },
    { value: 'usd', viewValue: 'USD' },
    { value: 'eur', viewValue: 'EUR' },
  ];
  months: Month[] = [
    { value: '01', viewValue: '01' },
    { value: '02', viewValue: '02' },
    { value: '03', viewValue: '03' },
    { value: '04', viewValue: '04' },
    { value: '05', viewValue: '05' },
    { value: '06', viewValue: '06' },
    { value: '07', viewValue: '07' },
    { value: '08', viewValue: '08' },
    { value: '09', viewValue: '09' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' }
  ];
  constructor(private paymentService: PaymentService, private snackBar: MatSnackBar,
    private httpStatus: HTTPStatus,
    public dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public paymentRef: Payment,
  ) {
    this.data = paymentRef;
    console.log(`${this.data.businessEmail} ${this.data.propertyId} ${this.data.referenceNumber}`);
    console.log(`insie the constructor`);
    console.log(this.booking);
  }
  ngOnInit() {
    this.showLoader();
    if (this.booking != null || this.booking !== undefined) {
      this.paymentService.findPaymentByReferenceNumber(this.booking.id.toString())
        .subscribe(res => {
          this.payments = res;
          this.dataSource = new MatTableDataSource(this.payments);
        });
    } else if (this.paymentRef !== undefined) {
      this.data = this.paymentRef;
      console.log(` Control Enabled ${this.isControlEnabled}`);
    } else {
      this.data = new Payment();
      this.isControlEnabled = true;
      console.log(` Control Enabled ${this.isControlEnabled}`);
    }
    this.isControlEnabled = this.enableControl();
  }
  submit() {
    console.log(this.data.paymentMode);
    if (this.data.paymentMode != null && this.data.paymentMode === 'Card') {
      this.chargeCreditCard();
    } else {
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
        this.data.token = token;
        this.processPayment(this.data);
      } else {
        const snackBarRef = this.snackBar.open('Error message :' + response.error.message);
        snackBarRef.dismiss();
      }
    });
  }
  processPayment(payment: Payment) {
    this.showLoader();
    console.log(payment);
    this.paymentService.processPayment(payment)
      .subscribe(data => {
        this.data = data.body;
        if (this.data.paymentMode === 'Card' && this.data.status === 'Paid') {
          this.openSuccessSnackBar('Payment processed successfully.Saving Payment ...');
          this.paymentService.savePayment(this.data).subscribe(res => {
            if (res.status === 200) {
              this.openSuccessSnackBar(`Payment Details Saved`);
            } else {
              this.openErrorSnackBar(`Error in updating payment details`);
            }
          });
        //  this.reset();
        } else if (this.data.paymentMode != null) {
          this.paymentService.savePayment(this.data).subscribe(res => {
            if (res.status === 200) {
              this.openSuccessSnackBar(`Payment Details Saved`);
            } else {
              this.openErrorSnackBar(`Error in updating payment details`);
            }
          });
        //  this.reset();
        } else {
          this.snackBar.open('ErroCode:' + data.body.failureCode + 'and Error message :' + data.body.failureMessage, '', {
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
  openSuccessSnackBar(message: string) {
    this.snackBar.open(message, 'Success!', {
      panelClass: ['mat--success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }
  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Error!', {
      panelClass: ['mat--errors'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }
  close() {
    this.dialogRef.close();
  }
  enableControl(): boolean {
    console.log(this.data.status);
    return (this.data.status === 'NotPaid'
    || this.data.status === undefined
    || this.data.status === ''
    );
  }
}
