import { Component, OnInit , Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {PropertyService} from './../../services/property.service';
import { Room } from './../room';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-manage-room',
  templateUrl: './manage-room.component.html',
  styleUrls: ['./manage-room.component.scss']
})
export class ManageRoomComponent implements OnInit {
  tabs = ['Room Details'];
  selected = new FormControl(0);
  step = 0;
  propertyId: number;
  room: Room ;


  constructor(private propertyService: PropertyService,
    @Inject(MAT_DIALOG_DATA) public data: Room,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    console.log(this.data.propertyId);
    this.propertyId = this.data.propertyId ;
    this.room = this.data ;
  }

  addRoom(selectAfterAdding: boolean) {
    this.tabs.push('New Room');

    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeRoom(index: number) {
    this.tabs.splice(index, 1);
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

  addRoomToProperty(room: Room) {
    this.propertyService.addRoomToProperty(this.data.propertyId, room).subscribe(data => {
      if ( data.id !== undefined || data.id !== null ) {
            console.log('Room Created Successfully');
            const snackBarRef = this.snackBar.open('Room created  successfully.' , 'close');
            snackBarRef._dismissAfter(5000);
            console.log('Creating Yearly Rates ....');
            data.propertyId = this.propertyId ;
            this.propertyService.addYearlyRatesForRoom(data).subscribe(resp => {
              console.log(resp);
            });
          } else {
           this.snackBar.open('Error in creating room', '' , {
              duration: 5000,
            });
          }
        }
        );
  }
}
