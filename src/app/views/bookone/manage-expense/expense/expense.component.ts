import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { Validators } from '@angular/forms';
import { ExpenseService } from './../../services/expense.service';
import { TokenStorage } from './../../../../token.storage';
import { AuthService } from './../../services/auth.service';
import { PropertyService } from './../../services/property.service';
import { ApplicationUser } from './../../../sessions/signup/user' ;
import { FileService } from './../../services/file.service';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HTTPStatus } from './../../../../app.interceptor';
import { Expense } from './expense';
export interface ExpenseItem {
  value: string;
  viewValue: string;
}
export interface Property {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})

export class ExpenseComponent implements OnInit {
  /* Declaration of the FormControl Element */
  dateOfExpense: FormControl = new FormControl("", [Validators.required]);
  //propertyName: FormControl = new FormControl();
  typeOfExpense: FormControl = new FormControl("", [Validators.required]);
  description: FormControl = new FormControl("", [Validators.required]);
  expenseAmount: FormControl = new FormControl("", [Validators.required]);
  receiptNumber: FormControl = new FormControl();
  referenceNumber: FormControl = new FormControl();
  externalReferenceNumber: FormControl = new FormControl();
  expenseNotes: FormControl = new FormControl();
  date: Date;


  expenseForm: FormGroup = new FormGroup({
    dateOfExpense: this.dateOfExpense,
    typeOfExpense: this.typeOfExpense,
    description: this.description,
    expenseAmount: this.expenseAmount
  });


  user: ApplicationUser;
  property: Property ;
 // propertyList: Property [] = [] ;
  formData: FormData;
  loaderText = 'Please wait';
  loadingTime = 3000;
  loader = false ;
  expense: Expense = {
    id: 0,
    date: '',
    propertyId: 0,
    name: '',
    description: '',
    amount: 0.0,
    receiptNumber: '',
    notes: '',
    submittedBy: '',
    receiptUrl: '',
    bookingId: '',
    receiptFileName: '',
    businessEmail: '',
    externalReference: '',
    email: ''
  };
  expensesList: ExpenseItem[] = [
    { value: 'Property Tax', viewValue: 'Property Tax' },
    { value: 'Property Damage', viewValue: 'Property Damage' },
    { value: 'Miscellaneous Damage', viewValue: 'Miscellaneous Damage' },
    { value: 'Cleaning Fee', viewValue: 'Cleaning Fee' },
    { value: 'House Insurance', viewValue: 'House Insurance' },
    { value: 'Vehicle Insurance', viewValue: 'Vehicle Insurance' },
    { value: 'Petrol', viewValue: 'Petrol' },
    { value: 'Grocery', viewValue: 'Grocery' },
    { value: 'Vehicle Maintenance', viewValue: 'Vehicle Maintenance' },
    { value: 'Garden & Garden Maintenace', viewValue: 'Garden & Garden Maintenace' },
    { value: 'Utility Bill', viewValue: 'Utility Bill' },
    { value: 'Meal & Restaurant Bill', viewValue: 'Meal & Restaurant Bill' },
    { value: 'Tea or Coffee or Soft Beverages or Alcohol', viewValue: 'Tea or Coffee or Soft Beverages or Alcohol' },
    { value: 'NetFlix , Amazon Prime ,Sportify,4G', viewValue: 'NetFlix , Amazon Prime ,Sportify,4G' },
    { value: 'Gym or Club Membership', viewValue: 'Gym or Club Membership' },
    { value: 'Brokerage/ThirdParty Expenses', viewValue: 'Brokerage/ThirdParty Expenses' },
    { value: 'Booking Refund', viewValue: 'Booking Refund' },
    { value: 'Miscellaneous', viewValue: 'Miscellaneous' },
    { value: 'Salary/Wages', viewValue: 'Salary/Wages' },
    { value: 'Property Rent/Mortgage', viewValue: 'Rent/Mortgage' }
  ];
  constructor(private token: TokenStorage, private fb: FormBuilder,
     private expenseService: ExpenseService, private authService: AuthService,
     private fileService: FileService ,
     private propertyService: PropertyService,
     public dialog: MatDialog, public snackBar: MatSnackBar,
     private httpStatus: HTTPStatus ,
   public dialogRef: MatDialogRef<ExpenseComponent>,
     @Inject(MAT_DIALOG_DATA) public expenseRef: Expense,
     ) {
       console.log('Expense Ref :' + expenseRef);
      this.showLoader();
      if ( expenseRef !== null ) {
      this.expense = expenseRef ;
      if ( expenseRef.date !== undefined ) {
      this.date = this.convertJavaSQLDateToCalenderDate(expenseRef.date) ;
    }
     }
    }

  ngOnInit() {
    this.showLoader();
    // this.expenseForm = new FormGroup({
    //   'dateOfExpense': new FormControl(this.dateOfExpense, [
    //     Validators.required
    //   ]),
    //   'typeOfExpense': new FormControl(this.typeOfExpense, [
    //     Validators.required
    //   ]),
    //   'description': new FormControl(this.description, [
    //     Validators.required
    //   ]),
    //   'expenseAmount': new FormControl(this.expenseAmount, [
    //     Validators.required
    //   ])
    // });
    /*
    if ( this.expenseRef !== null || this.expenseRef !== undefined ) {
      this.expense = this.expenseRef ;
    }
    */
    this.authService.getUserByUserId(this.token.getUserId()).subscribe(
      resp => {
        this.user = resp.body;
      }
    );
   /*
    this.propertyService.getPropertiesDetailsByUserId(this.token.getUserId()).subscribe(
      resp1 => {
        for ( let num = 0; num < resp1.length; num++) {
          const  property: Property =  { value: resp1[num].id , viewValue: resp1[num].name};
          this.propertyList.push(property);
       }
      }
    ); */
  }
  fileChange(event): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.formData = new FormData();
      this.expense.receiptFileName = file.name;
      this.formData.append('file', file, file.name);
      console.log(this.formData);
    }
  }
  uploadFile(event, file: ElementRef) {
    const file1 = event.target.files[0];
    file['value'] = (file1) ? file1.name : '';
    this.expense.receiptFileName = file1.name ;
    this.formData = new FormData();
    this.formData.append('file' , file1, this.expense.receiptFileName);
    this.fileService.fileUploadToCloud(this.formData).subscribe(fileUploadResponse => {
      if ( fileUploadResponse.status === 200) {
      this.expense.receiptUrl = fileUploadResponse.url ;
      this.expense.receiptFileName = fileUploadResponse.name ;
      this.openSuccessSnackBar(`File Uploaded Successfully`);
      } else {
        this.openErrorSnackBar(`File upload Error`);
      }
    } ) ;
  }
  convertDate(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let month1;
    let day1;
    if (month < 10) {
      month1 = `0${month}`;
    } else {
      month1 = `${month}`;
    }
    if (day < 10) {
      day1 = `0${day}`;
    } else {
      day1 = `${day}`;
    }
    return `${date.getFullYear()}-${month1}-${day1}`;
  }
  reset(): void {
    this.expense.propertyId = 0;
    this.expense.name = '';
    this.expense.description = '';
    this.expense.amount = 0.0;
    this.expense.receiptNumber = '';
    this.expense.notes = '';
    this.expense.submittedBy = '';
    this.expense.receiptUrl = '';
    this.expense.bookingId = '';
  }
  onSubmit() {
    console.log(this.expense);
    this.expense.date = this.convertDate(this.date);
    this.expense.submittedBy = this.user.username ;
    this.expense.businessEmail = this.user.username ;
    this.expenseService.saveExpense(this.expense)
      .subscribe(response => {
        console.log (response);
        if (response.id !== undefined && response.id != null && response.id !== 0 ) {
          this.openSuccessSnackBar('Expense created,ID#' +  response.id );
        }
      },
      error => {
        this.openErrorSnackBar(`Error Code ${error.message}`);
      });
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  openSuccessSnackBar(message: string) {
    this.snackBar.open('Saved Successfully!', 'Success!', {
      panelClass: ['mat--success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }

  openErrorSnackBar(message: string) {
    this.snackBar.open('Error in updation!', 'Error!', {
      panelClass: ['mat--errors'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
}
convertJavaSQLDateToCalenderDate(date: string): Date {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const calenderDate = new Date();
  calenderDate.setFullYear(+year, +month - 1, +day);
  return calenderDate;
}

close() {
  this.dialogRef.close();
}

}

