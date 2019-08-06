import { Component, OnInit, Input, Inject } from '@angular/core';
import { RoomDetails } from './../../availability/availability.component';
import { RoomDetailsOption } from './../../availability/availability.component';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPStatus } from './../../../../app.interceptor';
import { AvailabilityService } from './../../services/availability.service';
import { TokenStorage } from './../../../../token.storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-roomview',
  templateUrl: './roomview.component.html',
  styleUrls: ['./roomview.component.scss']
})

export class RoomViewComponent implements OnInit {
  roomDetail: RoomDetails = {
    roomId: 0,
    roomNumber: '',
    available: false,
    bookingId: 0,
    guestName: ''
  };

  pageTitle: string;
  loader = false;
  rooms: RoomDetails[];
  ngOnInit() {
    this.getAllRoomsForTodayByPropertyId();
  }
  constructor(private availabilityService: AvailabilityService,
    private snackBar: MatSnackBar,
    private httpStatus: HTTPStatus,
    private token: TokenStorage
  ) {
    this.rooms = [];
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
  getAllRoomsForTodayByPropertyId() {
    this.availabilityService.getAllRoomStatusForToday(+this.token.getPropertyId()).subscribe(
      resp1 => {
        console.log(resp1);
        if (resp1.body.length === 0) {
          this.openErrorSnackBar(`No rooms found for the property,please setup rooms.`);
        } else {
          for (let num = 0; num < resp1.body.length; num++) {
            const roomDetail: RoomDetails = {
              roomNumber: resp1.body[num].roomNumber,
              available: resp1.body[num].available,
              roomId: resp1.body[num].roomId,
              bookingId: resp1.body[num].bookingId,
              guestName: resp1.body[num].guestName
            };
            this.rooms.push(roomDetail);
          }
        }
      }
    );
  }
}
