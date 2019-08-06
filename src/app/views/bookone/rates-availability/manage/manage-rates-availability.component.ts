import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { HTTPStatus } from './../../../../app.interceptor';
import { TokenStorage } from './../../../../token.storage';
import { PropertyService } from '../../services/property.service';
import { AvailabilityService } from '../../services/availability.service';
import { RoomDetailsOption } from '../../availability/availability.component';
import { RoomDetails } from '../../availability/availability.component';
import { Room } from './../../room/room';
import { Property } from './../../property/property' ;
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateUtilService } from './../../services/date.utility.service';


export interface RatesAndAvailability {
  id: number;
  date: string;
  noOfAvailable: number;
  noOfBooked: number;
  noOfOnHold: number;
  price: number;
  propertyId: number;
  propertyName: string;
  roomId: number;
  roomName: string;
  totalNoRooms: number;
  fromDate?: string ;
  toDate?: string ;
}

@Component({
  selector: 'app-manage-rates-availability',
  templateUrl: './manage-rates-availability.component.html',
  styleUrls: ['./manage-rates-availability.component.scss']
})

export class ManageRatesAndAvailabilityComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  roomOptions: RoomDetailsOption[];
  roomNumbers: string[];
  roomDetail: RoomDetails = {
    roomId: 0,
    roomNumber: '',
    available: false,
    bookingId: 0,
    guestName: ''
  };
  available: FormControl = new FormControl();
  selectedRooms: RoomDetails[];
  isError: boolean;
  loader = false;
  propertyId: number;
  pageTitle: string;
  displayedColumns = ['date', 'price', 'total' , 'noOfBooked', 'noOfOnHold', 'noOfAvailable', 'action'];
  dataSource = new MatTableDataSource();
  ratesAndAvailabilities: RatesAndAvailability[];
  rooms: Room[] = [];
  roomsWithData:  Room[] = [];
  property: Property ;
  editMode: Boolean = false ;
  label = 'edit' ;
  icon = 'edit' ;
  selectedRow: number ;
  todayDate = new Date();
  fromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  toDateMinMilliSeconds: number;
  toDateMaxMilliSeconds: number;
  ratesAndAvailability: RatesAndAvailability = {
    id: 0,
    date: '',
    noOfAvailable: 0,
    noOfBooked: 0,
    noOfOnHold: 0,
    price: 0,
    propertyId: this.propertyId,
    propertyName: '',
    roomId: 0,
    roomName: '' ,
    totalNoRooms: 0

  };
  rateAndAvailFromDate: FormControl = new FormControl();
  rateAndAvailToDate: FormControl = new FormControl();

  ngOnInit() {
    this.findPropertyDetailsById(this.propertyId) ;
    this.getRatesAndAvailability();
  }
  constructor(
    private snackBar: MatSnackBar,
    private httpStatus: HTTPStatus,
    private token: TokenStorage,
    private propertyService: PropertyService,
    private availabilityService: AvailabilityService,
    private dateUtilService: DateUtilService

  ) {
    this.ratesAndAvailabilities = [];
    this.propertyId = +this.token.getPropertyId();
    this.property = this.token.getProperty();
    this.pageTitle = `Manage Rates for property ${this.property.name}`;
    this.rooms = this.token.getRoomTypes();
    this.showLoader();
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
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
    });
  }
  /* This is the default rates and availability while the page loads.As the property id is there ,an API call
  can be made with the help of propertyId to retrieve rates and availability for the property and all the rooms*/
  getRatesForPropertyNextSevenDays() {
    this.ratesAndAvailabilities = [] ;
    this.availabilityService.getAvailabilityForPropertyAllNext7Days(this.propertyId).subscribe(resp => {
      if (resp.body.length === 0) {
        this.openErrorSnackBar(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        for (let num = 0; num < resp.body.length; num++) {
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: resp.body[num].date,
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);
        }
        this.dataSource = new MatTableDataSource(this.ratesAndAvailabilities);
        console.log(this.ratesAndAvailabilities);
      }
    });
  }
  getRatesForPropertyByDate(rateAndAvailability: RatesAndAvailability) {
    this.ratesAndAvailabilities = [] ;
    this.availabilityService.getAvailabilityForPropertyByDate(rateAndAvailability).subscribe(resp => {
      if (resp.body.length === 0) {
        this.openErrorSnackBar(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        for (let num = 0; num < resp.body.length; num++) {
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: resp.body[num].date,
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);
        }
        this.dataSource = new MatTableDataSource(this.ratesAndAvailabilities);
        console.log(this.ratesAndAvailabilities);
      }
    });
  }
  getRatesForRoomNextSevenDays(room: Room) {
    this.availabilityService.getAvailabilityForRoomAllNext7Days(this.propertyId, room.id).subscribe(resp => {
      if (resp.body.length === 0) {
        this.openErrorSnackBar(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        this.ratesAndAvailabilities = [] ;
        for (let num = 0; num < resp.body.length; num++) {
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: resp.body[num].date,
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);
        }
        room.dataSource = new MatTableDataSource(this.ratesAndAvailabilities);
        this.roomsWithData.push(room);
        console.log( this.roomsWithData);
      }
    });
  }
  getRatesForRoomByDate(room: Room, rateAndAvailability: RatesAndAvailability) {
    this.availabilityService.getAvailabilityForRoomByDate(rateAndAvailability).subscribe(resp => {
      if (resp.body.length === 0) {
        this.openErrorSnackBar(`Rates And Availability not setup for the dates,please load the rates.`);
      } else {
        this.ratesAndAvailabilities = [] ;
        for (let num = 0; num < resp.body.length; num++) {
          const ratesAndAvailability: RatesAndAvailability = {
            id: resp.body[num].id,
            date: resp.body[num].date,
            noOfAvailable: resp.body[num].noOfAvailable,
            noOfBooked: resp.body[num].noOfBooked,
            noOfOnHold: resp.body[num].noOfOnHold,
            price: resp.body[num].price,
            propertyId: resp.body[num].propertyId,
            propertyName: resp.body[num].propertyName,
            roomId: resp.body[num].roomId,
            roomName: resp.body[num].roomName,
            totalNoRooms: resp.body[num].totalNoRooms
          };
          this.ratesAndAvailabilities.push(ratesAndAvailability);
        }
        room.dataSource = new MatTableDataSource(this.ratesAndAvailabilities);
        this.roomsWithData.push(room);
        console.log( this.roomsWithData);
      }
    });
  }
  getRatesAndAvailabilityForAllRoomsForNextSevenDays() {
      for (let num = 0; num < this.rooms.length; num++) {
        const room = this.rooms[num] ;
        this.getRatesForRoomNextSevenDays(room);
      }
  }
 /* getRatesAndAvailabilityForAllRoomsForNextSevenDays(propertyId: number) {
    this.roomsWithData = [];
    if (propertyId !== null && propertyId !== undefined) {
      this.propertyService.findAllRoomsForProperty(propertyId).subscribe(data => {
        this.rooms = data;
        if ( this.rooms.length > 0 ) {
          for (let num = 0; num < this.rooms.length; num++) {
            const room = this.rooms[num] ;
            this.getRatesForRoomNextSevenDays(room);
          }
        }
      });
    }

  }*/
  /*findRatesAndAvailabilityForAllRoomsByDate(ratesAndAvailability: RatesAndAvailability) {
    this.roomsWithData = [];
      this.propertyService.findAllRoomsForProperty(ratesAndAvailability.propertyId).subscribe(data => {
        this.rooms = data;
        if ( this.rooms.length > 0 ) {
          for (let num = 0; num < this.rooms.length; num++) {
            const room = this.rooms[num] ;
            ratesAndAvailability.roomId = room.id ;
            this.getRatesForRoomByDate(room, ratesAndAvailability);
          }
        }
      });
  }*/
  findRatesAndAvailabilityForAllRoomsByDate(ratesAndAvailability: RatesAndAvailability) {
    this.roomsWithData = [];
        if ( this.rooms.length > 0 ) {
          for (let num = 0; num < this.rooms.length; num++) {
            const room = this.rooms[num] ;
            ratesAndAvailability.roomId = room.id ;
            this.getRatesForRoomByDate(room, ratesAndAvailability);
          }
        }
  }
  findPropertyDetailsById(propertyId: number) {
    if (propertyId !== null && propertyId !== undefined) {
      this.propertyService.getPropertyDetailsByPropertyId(propertyId).subscribe(data => {
        this.property = data ;
      });
    }
  }
  generateTableDataForRooms() {
    console.log(this.rooms);
    if ( this.rooms.length > 0 ) {
      for (let num = 0; num < this.rooms.length; num++) {
        const room = this.rooms[num] ;
        this.getRatesForRoomNextSevenDays(room);
      }
    }
  }
  edit(row) {
    this.editMode = true ;
    this.selectedRow = row.id ;
    this.ratesAndAvailability.id = row.id ;
    this.ratesAndAvailability.date = row.date ;
    this.ratesAndAvailability.totalNoRooms = row.totalNoRooms ;
    this.ratesAndAvailability.noOfBooked = row.noOfBooked ;
    this.ratesAndAvailability.noOfOnHold = row.noOfOnHold ;
    this.ratesAndAvailability.noOfAvailable = row.noOfAvailable ;
    this.ratesAndAvailability.price = row.price ;
    this.ratesAndAvailability.propertyId = row.propertyId ;
  }
  cancel() {
    this.editMode = false ;
    this.label = 'edit' ;
    this.icon = 'edit';

  }
  save(ratesAndAvailability: RatesAndAvailability, row ) {
    console.log(row);
    this.availabilityService.updateRatesAvailability(ratesAndAvailability).subscribe(response => {
      row = response.body ;
      row.noOfAvailable = response.body.noOfAvailable ;
      row. price = response.body.price ;
      this.openSuccessSnackBar(`Rates & Availabilities Updated`);
      this.editMode = false ;
    });
  }
  isOverBooked() {
    return this.ratesAndAvailability.totalNoRooms < (this.ratesAndAvailability.noOfBooked + this.ratesAndAvailability.noOfOnHold +
      this.ratesAndAvailability.noOfAvailable) ;
  }
  setToDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const fromDateMilliSeconds = event.value.getTime();
    this.toDateMinMilliSeconds = fromDateMilliSeconds + 86400000;
    this.toDateMaxMilliSeconds = fromDateMilliSeconds + (86400000 * 15);
    this.minToDate = new Date(this.toDateMinMilliSeconds);
    this.maxToDate = new Date(this.toDateMaxMilliSeconds);
  }
  setToDateOnReset(date: Date) {
    const fromDateMilliSeconds = date.getTime();
    this.toDateMinMilliSeconds = fromDateMilliSeconds + 86400000;
    this.toDateMaxMilliSeconds = fromDateMilliSeconds + (86400000 * 15);
    this.minToDate = new Date(this.toDateMinMilliSeconds);
    this.maxToDate = new Date(this.toDateMaxMilliSeconds);

  }
  getRatesAndAvailability() {
    if (this.rateAndAvailFromDate.value === null || this.rateAndAvailToDate.value === null) {
    this.getRatesForPropertyNextSevenDays();
    //this.getRatesAndAvailabilityForAllRoomsForNextSevenDays(this.propertyId);
    this.getRatesAndAvailabilityForAllRoomsForNextSevenDays();
    } else {
      console.log( this.dateUtilService.convertCalenderDateToJavaSQLDate(this.rateAndAvailFromDate.value)  +
      this.dateUtilService.convertCalenderDateToJavaSQLDate(this.rateAndAvailToDate.value));
    this.ratesAndAvailability.fromDate = this.dateUtilService.convertCalenderDateToJavaSQLDate(this.rateAndAvailFromDate.value);
    this.ratesAndAvailability.toDate = this.dateUtilService.convertCalenderDateToJavaSQLDate(this.rateAndAvailToDate.value);
    this.ratesAndAvailability.propertyId = this.propertyId ;
    this.getRatesForPropertyByDate(this.ratesAndAvailability);
    this.findRatesAndAvailabilityForAllRoomsByDate(this.ratesAndAvailability);
    }
  }
}
