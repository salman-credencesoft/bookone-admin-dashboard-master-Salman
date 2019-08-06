import { Component, OnInit , Output , Input , EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service } from './service';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { Booking } from './../booking/booking';
import { BookingService } from '../services/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPStatus } from './../../../app.interceptor';
import { FormGroup, Validators } from "@angular/forms";
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';


export interface ServiceType {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-NZ' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ServiceComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  serveiceTypes: ServiceType[] = [
    { value: 'Late Check In', viewValue: 'Late Check In' },
    { value: 'Late Check Out', viewValue: 'Late Check Out' },
    { value: 'Early Check In', viewValue: 'Early Check In' },
    { value: 'Early Check Out', viewValue: 'Early Check Out' },
    { value: 'Breakfast', viewValue: 'Breakfast' },
    { value: 'Transport', viewValue: 'Transport' },
    { value: 'Meal', viewValue: 'Meal' },
    { value: 'Tea or Coffee', viewValue: 'Tea or Coffee' },
    { value: 'Parking', viewValue: 'Parking' },
    { value: 'Towels', viewValue: 'Towels' },
    { value: 'Bed Sheets', viewValue: 'Bed Sheets' },
    { value: 'Toiletries', viewValue: 'Toiletries' },
    { value: 'Laundry', viewValue: 'Laundry' },
    { value: 'Kitchen', viewValue: 'Kitchen' },
    { value: 'Ironing', viewValue: 'Ironing' },
    { value: 'Mineral Water', viewValue: 'Mineral Water' },
    { value: 'Internet', viewValue: 'Internet' },
    { value: 'DTH', viewValue: 'DTH' },
    { value: 'Entertainment', viewValue: 'Entertainment' },
    { value: 'Miscellaneous', viewValue: 'Miscellaneous' }
  ];
  serviceType = new FormControl("", [Validators.required]);
  amount = new FormControl(1, [Validators.min(1)]);
  description = new FormControl();
  dateOfService: FormControl = new FormControl("", [Validators.required]);


  serviceForm: FormGroup = new FormGroup({
    serviceType: this.serviceType,
    amount: this.amount,
    description: this.description,
    dateOfService: this.dateOfService
  });



  displayWithControl: true;
  service: Service ;
  services: Service[] = [] ;
  noOfServices: number;
  dataSource;
  displayedColumns: string[] = ['serviceType', 'description', 'amount', 'action'];
  buttonLabel = 'add';
  loader = false;
  @Output() provideServicesEvent = new EventEmitter<Service[]>();
  @Output() addServicesEvent = new EventEmitter<Service>();
  @Input() booking: Booking ;
  constructor(private bookingService: BookingService, private snackBar: MatSnackBar,
    private httpStatus: HTTPStatus,
    ) {
    console.log(`Hi`);
    this.service = new Service();
    //this.services = new Array<Service>();
  }

  ngOnInit() {
    this.displayWithControl = true ;
    this.getAllServices();
   // this.dataSource = new MatTableDataSource(this.services);
  
  }
  addOrUpdate() {
    console.log(`this.service.position: ${this.service.position}`);
    if (this.service.position === undefined ) {
      console.log(`Inside IF `);
      console.log(this.services.length);
      const size = this.services.length;
      console.log(`Size ${size}`);
      this.service.position = size + 1 ;
      console.log(this.service.position);
      this.noOfServices = this.services.push(this.service);
    //  this.provideServicesEvent.emit(this.services);
    } else {
      console.log(`Inside ELSE `);
      console.log(this.service.position);
      const removed = this.services.splice(this.service.position - 1, 1 , this.service ) ;
      console.log(`Removed is : ${removed}`);
    }
    
  }
  /*delete(row) {
    const index: number = this.services.indexOf(row);
    if (index !== -1) {
      this.services.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.services);
      this.noOfServices = this.services.length;
      let services = new Array<Service> ();
      services = this.services ;
      //this.provideServicesEvent.emit(this.services);
    }
  }*/
  update(row) {
    this.service = row ;
    this.buttonLabel = 'save' ;
  }
  confirm() {
    let services = new Array<Service> ();
    services = this.services ;
    this.provideServicesEvent.emit(this.services);
  }
  reset() {
    this.service = new Service();
    this.buttonLabel = 'add' ;
  }
  save() {
    if (this.service.id === undefined || this.service.id === 0) {
    this.bookingService.addServiceTOBooking( this.booking.id , this.service ).subscribe(
      response => {
        if ( response.status === 200 ) {
          this.getAllServices() ;
        }
      },
      error => {
        if (error instanceof HttpErrorResponse ) {
            this.openErrorSnackBar(error.message);
          }
      }
    );
    } else {
      this.bookingService.updateService(   this.booking.id , this.service ).subscribe(
        response => {
          if ( response.status === 200 ) {
            this.getAllServices() ;
          }
        },
        error => {
          if (error instanceof HttpErrorResponse ) {
              this.openErrorSnackBar(error.message);
            }
        }
      );
      this.service = new Service();
      this.buttonLabel = 'add' ;

    }
  }
  delete(row) {
    this.bookingService.deleteService(  row.id ).subscribe(
      response => {
        if ( response.status === 200 ) {
          this.openSuccessSnackBar('Service Deleted Successfully.');
          this.getAllServices() ;
        }
      },
      error => {
        if (error instanceof HttpErrorResponse ) {
            this.openErrorSnackBar(error.message);
          }
      }
    );

  }

  getAllServices() {
    this.bookingService.getAllServicesByBooking(this.booking.id).subscribe(response1 => {
      if (response1.status === 200) {
        this.services = response1.body ;
        this.dataSource = new MatTableDataSource(this.services);
        this.noOfServices = this.serveiceTypes.length ;
      }
    },
    error => {
      if (error instanceof HttpErrorResponse ) {
          this.openErrorSnackBar(error.message);
        }
    }
    );
  }
  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Error!', {
      panelClass: ['mat--errors'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
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
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    //  console.log(status);
    });
  }
}
