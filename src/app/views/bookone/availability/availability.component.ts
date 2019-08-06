import { Component, OnInit, Input, Inject } from '@angular/core';
import { AvailabilityService } from './../services/availability.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, NgForm, FormGroupDirective } from '@angular/forms';
import { Booking } from '../booking/booking';
import { BookingService } from '../services/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPStatus } from './../../../app.interceptor';
import { Room } from './../room/room';
import { TokenStorage } from './../../../token.storage';
import { Bed } from '../bed/bed';
export interface RoomDetails {
  roomNumber: string;
  roomId: number;
  available: boolean;
  bookingId: number;
  guestName: string;
}
export interface BedDetails {
  roomNumber: string;
  roomId: number;
  available: boolean;
  bookingId: number;
  guestName: string;
  bedNumber: string ;
}
export interface RoomDetailsOption {
  value: string;
  viewValue: string;
}
export interface BedDetailOption {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})

export class AvailabilityComponent implements OnInit {
  roomOptions: RoomDetailsOption[];
  bedOptions: BedDetailOption[];
  bookingId: number;
  roomNumbers: string[];
  bedNumbers: string[];
  roomDetail: RoomDetails = {
    roomId: 0,
    roomNumber: '',
    available: false,
    bookingId: 0,
    guestName: ''
  };
  availableRooms: FormControl = new FormControl();
  availableBeds: FormControl = new FormControl();
  selectedRooms: RoomDetails[];
  selectedBeds: BedDetails[];
  booking: Booking;
  isError: boolean;
  pageTitle: string;
  room: Room;
  rooms: Room[];
  loader = false;
  roomNumber: number;
  ngOnInit() {
  }
  constructor(private availabilityService: AvailabilityService,
    private bookingService: BookingService,
    public dialogRef: MatDialogRef<AvailabilityComponent>,
    @Inject(MAT_DIALOG_DATA) public bookingRef: Booking,
    private snackBar: MatSnackBar,
    private httpStatus: HTTPStatus,
    private token: TokenStorage
  ) {
    this.roomOptions = [];
    this.bedOptions = [];
    this.booking = bookingRef;
    if (this.booking !== undefined) {
      this.pageTitle = 'Room Options';
    }
    this.rooms = this.token.getRoomTypes();
    console.log('Rooms:' + this.rooms);
    this.room = this.rooms.find(room =>
      room.id === bookingRef.roomId
    );
    if (this.room.shared === false) {
      console.log('Rooms:' + this.room.shared );
      this.getAllAvailableRoomsForBooking(bookingRef.id);
    } else {
      this.getAllAvailableBedsForBooking(bookingRef.id);
    }
  }
  getAllAvailableRoomsForBooking(bookingId: number) {
    this.availabilityService.getAvailableRooms(bookingId).subscribe(
      resp1 => {
        console.log(resp1);
        if (resp1.body.length === 0) {
          this.openErrorSnackBar(`No rooms found for checkin,Check other roomtype.`);
        } else {
          for (let num = 0; num < resp1.body.length; num++) {
            const roomOption: RoomDetailsOption = { value: resp1.body[num].roomNumber, viewValue: resp1.body[num].roomNumber };
            this.roomOptions.push(roomOption);
          }
        }
      }
    );
  }
  getAllAvailableBedsForBooking(bookingId: number) {
    this.availabilityService.getAvailableBeds(bookingId).subscribe(
      resp1 => {
        if (resp1.body.length === 0) {
          this.openErrorSnackBar(`No Bed found for checkin.`);
        } else {
          for (let num = 0; num < resp1.body.length; num++) {
            this.roomNumber = resp1.body[num].roomNumber ;
            console.log(resp1.body[num].bedNumber);
            // Room No: ${resp1.body[num].roomNumber}-${
            const bedOption: BedDetailOption = {
              value: resp1.body[num].bedNumber,
              viewValue: 'Room No: - ' + resp1.body[num].roomNumber.toString() + ' Bed No: - ' + resp1.body[num].bedNumber
            };
            this.bedOptions.push(bedOption);
          }
        }
      }
    );
  }
  checkinRoom() {
    this.selectedRooms = [];
    console.log(this.bedNumbers);
    console.log(this.booking.noOfRooms);
   if (this.roomNumbers.length !== this.booking.noOfRooms) {
      this.isError = true;
      this.openErrorSnackBar(`Invalid room selection,Rooms Booked:${this.booking.noOfRooms} but selected:${this.roomNumbers.length}`);
    } else {
      for (let num = 0; num < this.roomNumbers.length; num++) {
        const availableRoom: RoomDetails = {
          roomNumber: this.roomNumbers[num],
          roomId: this.booking.roomId,
          guestName: this.booking.firstName,
          bookingId: this.booking.id,
          available: false
        };
        this.selectedRooms.push(availableRoom);
        console.log(this.selectedRooms);
      }
      this.booking.roomDetails = this.selectedRooms;
      this.booking.checkinTime = new Date();
      this.bookingService.checkin(this.booking).subscribe(response => {
        if (response.status === 200) {
          this.openSuccessSnackBar('Guest Check-In Completed.');
          this.dialogRef.close();
        }
      },
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 417) {
              this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
              this.dialogRef.close();
            }
          }
        }
      );
    }

  }
  checkinBed() {
    this.selectedBeds = [];
    console.log(this.booking.noOfRooms);
     if (this.bedNumbers.length !== this.booking.noOfRooms) {
      this.isError = true;
      this.openErrorSnackBar(`Invalid room selection,Beds booked:${this.booking.noOfRooms} but selected:${this.bedNumbers.length}`);
    } else {
      for (let num = 0; num < this.bedNumbers.length; num++) {
        const bedDetails: BedDetails = {
          bedNumber: this.bedNumbers[num],
          roomId: this.booking.roomId,
          guestName: this.booking.firstName,
          bookingId: this.booking.id,
          roomNumber: this.roomNumber.toString() ,
          available: false
        };
        this.selectedBeds.push(bedDetails);
        console.log(this.selectedBeds);
      }
      this.booking.bedDetails = this.selectedBeds;
      this.booking.checkinTime = new Date();
      this.bookingService.checkin(this.booking).subscribe(response => {
        if (response.status === 200) {
          this.openSuccessSnackBar('Guest Check-In Completed.');
        }
      },
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 417) {
              this.openErrorSnackBar('Please proceed with offline room allocation and update the booking.');
            }
          }
        }
      );
    }

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
  checkin() {
    if (this.roomNumbers !== undefined) {
      this.checkinRoom();
    } else if (this.bedNumbers !== undefined) {
      this.checkinBed();
    } else {
      this.isError = true;
      this.openErrorSnackBar(`Please select an option.`);
    }

  }

}
