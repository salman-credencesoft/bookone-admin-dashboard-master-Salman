
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/components/common/api';
import { Property } from './../property/property';
import { PropertyService } from './../services/property.service';
import { Room } from './room';
import { Observable } from 'rxjs';
import { HTTPStatus } from './../../../app.interceptor';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  name: FormControl = new FormControl();
  description: FormControl = new FormControl();
  maximumOccupancy: FormControl = new FormControl();
  minimumOccupancy: FormControl = new FormControl();
  isShared: FormControl = new FormControl();
  mobile: FormControl = new FormControl();
  extraChargePerPerson: FormControl = new FormControl();
  roomOnlyPrice: FormControl = new FormControl();
  noOfRooms: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  myControl: FormControl = new FormControl();
  @Output() saveRoomDetailsEvent = new EventEmitter<Room>();
  @Input() room: Room;
  loader = false;
  data: Room ;
  constructor(private http: HttpClient, private propertyService: PropertyService, 
    private httpStatus: HTTPStatus
  ) {
    this.showLoader();
  }

  ngOnInit() {
    this.data = this.room ;
  }
  saveRoomDetails() {
    console.log(this.room);
    this.saveRoomDetailsEvent.emit(this.data);
  }
  reset() {
    this.data = new Room();
  }
  showLoader(): void {
    this.httpStatus.getHttpStatus().subscribe((status: boolean) => {
      this.loader = status;
      //  console.log(status);
    });
  }
}
