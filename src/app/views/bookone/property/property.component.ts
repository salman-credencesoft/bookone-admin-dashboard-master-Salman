import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/components/common/api';
import { Property } from './property';
import { PropertyService } from './../services/property.service';
import { TokenStorage } from './../../../token.storage';
import { AuthService } from './../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTPStatus } from './../../../app.interceptor';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from '@angular/material';

import { Token } from '@angular/compiler';
import { ApplicationUser } from './../../sessions/signup/user';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  name: FormControl = new FormControl();
  email: FormControl = new FormControl();
  slogan: FormControl = new FormControl();
  landphone: FormControl = new FormControl();
  mobile: FormControl = new FormControl();
  streetNumber: FormControl = new FormControl();
  streetName: FormControl = new FormControl();
  suburb: FormControl = new FormControl();
  city: FormControl = new FormControl();
  country: FormControl = new FormControl();
  postcode: FormControl = new FormControl();
  managerFirstName: FormControl = new FormControl();
  managerLastName: FormControl = new FormControl();
  managerContactNo: FormControl = new FormControl();
  managerEmailAddress: FormControl = new FormControl();
  property: Property;
  userId: string;
  form: NgForm;
  user: ApplicationUser;
  msgs: Message[] = [];
  //Spinner Properties
  spinner: Boolean = false;
  submitDisabled: Boolean = false;
  step = 0;
  loader = false;
  constructor(private http: HttpClient,
    private propertyService: PropertyService,
    private tokenStorage: TokenStorage,
    private authService: AuthService,
    public dialogRef: MatDialogRef<PropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Property,
    private route: ActivatedRoute,
    private token: TokenStorage,
    private router: Router,
    private httpStatus: HTTPStatus,
    private snackBar: MatSnackBar
  ) {
    this.property = new Property();
    this.showLoader();
  }

  ngOnInit() {
    this.userId = this.tokenStorage.getUserId();
    if (this.userId === null || this.userId === undefined) {
      this.router.navigate(['layout']);
    }
  }
  onSubmit() {
    console.log(this.data);
    this.data.userId = this.userId;
    this.spinner = !this.spinner;
    this.submitDisabled = !this.submitDisabled;
    this.msgs = [];
    console.log(this.data);
    this.propertyService.createProperty(this.data)
      .subscribe(data => {
        console.log(data);
        this.data = data;
        this.spinner = !this.spinner;
        this.submitDisabled = !this.submitDisabled;
        if (this.data.id != null) {
          this.openSuccessSnackBar(`Hotel Created Successfully # ${this.data.id}`);
          this.tokenStorage.savePropertyId(this.data.id);
        } else {
          this.msgs.push({
            severity: 'error',
            summary: 'There was an issue with saving the details of the property!'
          });
        }
        // console.log(response.status);
      });
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
      //  console.log(status);
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
