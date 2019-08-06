
import { Component, AfterViewChecked, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  HttpModule
} from '@angular/http';
import { MatProgressSpinnerModule } from '@angular/material';

import { MatDialog, MatSnackBar } from '@angular/material';
import { PropertyComponent } from './../property.component';
import { Address } from './../../address-checker/Address';
import { TokenStorage } from './../../../../token.storage';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from './../../services/property.service';
import { Property } from './../property';
import { RoomComponent } from './../../room/room.component';
import { ManageRoomComponent } from './../../room/manage-room/manage-room.component';
import { Room } from './../../room/room';
import { BookingComponent } from './../../booking/booking.component';
import { HTTPStatus } from './../../../../app.interceptor';
@Component({
  selector: 'app-manage-property',
  templateUrl: './manage-property.component.html',
  styleUrls: ['./manage-property.component.scss']
})

export class ManagePropertyComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  property: Property ;

  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private token: TokenStorage,
    private router: Router,
    private propertyService: PropertyService,
    private httpStatus: HTTPStatus,
    private snackBar: MatSnackBar
  ) {
  }
  properties: Property[] = [];
  rooms: Room[] = [];
  public myAngularxQrCode: string = null;
  url= 'http://www.samsfamilyhome.co.nz' ;
  step = 0;
  loader = false ;
  ngOnInit() {
    const userId = this.token.getUserId();
    this.property = new Property();
    if (userId === null || userId === undefined) {
      this.router.navigate(['layout']);
    }

      if ( this.token.getProperty()  === undefined || this.token.getProperty() === null ) {
        this.createPropertyDialog();
      } else {
        this.property = this.token.getProperty() ;
        console.log(this.property);
    //  this.findAllRoomsForProperty(+this.token.getPropertyId() );
        this.rooms = this.token.getRoomTypes();
     // this.refresh();
    }
  }
  createPropertyDialog() {
    console.log('hi');
    const dialogRef = this.dialog.open(PropertyComponent, {
      height: '1200px',
      data: {
        name: '',
        email: '',
        slogan: '',
        landphone: '',
        mobile: '',
        address: new Address()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  createRoomDialog(propertyId: number) {
    console.log('Property ID' + propertyId);
    const dialogRef = this.dialog.open(ManageRoomComponent, {
      width: '1200px',
      data: {
        propertyId: propertyId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
  updateRoomDialog(room: Room) {
    const dialogRef = this.dialog.open(ManageRoomComponent, {
      width: '1200px',
      data: {
        minimumOccupancy: room.minimumOccupancy,
        maximumOccupancy: room.minimumOccupancy,
        extraChargePerPerson: room.extraChargePerPerson,
        name: room.name,
        roomOnlyPrice: room.roomOnlyPrice,
        noOfRooms: room.noOfRooms
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });

  }
  book(room: Room) {
    const dialogRef = this.dialog.open(BookingComponent, {
     // height: '600px',
      width: '800px',
      data: {
        fromDate: '',
        toDate: '',
        roomId: room.id,
        propertyId: room.propertyId,
        roomName: room.name,
        businessEmail: this.properties[0].email,
        businessName: this.properties[0].name,
        mobile: this.properties[0].managerContactNo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }
  bookProperty(property: Property) {
    const dialogRef = this.dialog.open(BookingComponent, {
      width: '800px',
      data: {
        fromDate: '',
        toDate: '',
        propertyId: property.id,
        businessEmail: property.email,
        businessName: property.name,
        roomName: property.name,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  createYearlyRatesForProperty() {
    this.openSuccessSnackBar(`Creating Yearly Rates for the Hotel ...... `+ this.property);
          this.propertyService.addYearlyRatesForProperty(this.property).subscribe(response => {
            if (response.status === 200) {
              this.openSuccessSnackBar('Yearly rates for the Hotel created successfully');
            } else {
              this.openErrorSnackBar('Property SetUp Error, Contact support !');
            }
          });
  }
  refresh() {
    const userId = this.token.getUserId();
    if (userId !== null && userId !== undefined) {
      this.propertyService.getPropertiesDetailsByUserId(userId).subscribe(data => {
        this.properties = data;
        this.myAngularxQrCode = 'samsfamilyhome' ;
        console.log(this.properties);
      });
    }
  }
  findAllRoomsForProperty(propertyId: number) {
    if (propertyId !== null && propertyId !== undefined) {
      this.propertyService.findAllRoomsForProperty(propertyId).subscribe(data => {
        this.rooms = data;
        this.token.saveRoomTypes( this.rooms);
      });
    }

  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
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
  openSuccessSnackBar(message: string) {
    this.snackBar.open(message, 'Success!', {
      panelClass: ['mat--success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: 4000
    });
  }
}
