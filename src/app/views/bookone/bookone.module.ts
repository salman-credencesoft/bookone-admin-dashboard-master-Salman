//import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ThemeService } from './../../shared/services/theme.service';
import { SharedModule } from './../../shared/shared.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { fakeBackendProvider } from './helpers/fake-backend';
import { AuthHttp, AuthConfig } from 'angular2-jwt/angular2-jwt';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { MessagesComponent } from './messages/messages.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './../../app.interceptor';
import { TokenStorage } from './../../token.storage';
import { PaymentService } from './services/payment.service';
import {
  MatDialogModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule
} from '@angular/material';

import { BookingService } from './services/booking.service';
import { ManageBookingComponent } from './booking/manage/manage-booking.component';
import { BookingComponent } from './booking/booking.component';
import { PropertyComponent } from './property/property.component';
import { RoomComponent } from './room/room.component';
import { RoomServiceComponent } from './room-service/room-service.component';
import { ManagePropertyComponent } from './property/manage-property/manage-property.component';
import { PropertyService } from './services/property.service';
import { AddressService } from './services/address.service';
import { AvailabilityService } from './services/availability.service';
import { AmenityComponent } from './amenity/amenity.component';
import { ServiceComponent } from './service/service.component';
import { BedComponent } from './bed/bed.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { ManageRoomComponent } from './room/manage-room/manage-room.component';
import { ManagePaymentComponent } from './payment/manage-payment/manage-payment.component';
import { PaymentComponent } from './payment/payment.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { ExpenseComponent } from './manage-expense/expense/expense.component';
import { ExpenseService } from './services/expense.service';
import { FileService } from './services/file.service';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';
import { LoaderDialogComponent } from './dialog/loader-dialog/loader-dialog.component';
import { HTTPStatus } from './../../app.interceptor';
import { NotificationService } from './services/notification.service';
import { AvailabilityComponent } from './availability/availability.component';
import { RoomViewComponent } from './dashboard/rooms-view/roomview.component';
import { ExpenseSummaryComponent } from './manage-expense/expense-summary/expense-summary.component';
import { PaymentSummaryComponent } from './payment/payment-summary/payment-summary.component';
import { ManageRatesAndAvailabilityComponent } from './rates-availability/manage/manage-rates-availability.component';
import { RatesAndAvailabilityComponent } from './rates-availability/rates-availability.component';
import { DateUtilService } from './services/date.utility.service';
import { AlertService } from './services/alert.service';
import { QuillModule } from 'ngx-quill';
import { LayoutModule } from '@angular/cdk/layout';
import { ErrorHandler } from '@angular/core';
import { ErrorsService } from './services/errors.service';
import {CdkTableModule} from '@angular/cdk/table';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ColorPickerModule } from 'ngx-color-picker';
import { BookingCalenderComponent } from './booking-calender/booking-calender.component';

import { BookingCalendarService } from './services/booking-calendar.service';
import { BookOneRoutes } from './bookone.routing';

export function getAuthHttp(http) {
  return new AuthHttp(
    new AuthConfig({
      tokenName: 'token'
    }),
    http
  );
}

@NgModule({
  imports: [
    //BrowserModule,
    HttpClientModule,
   // BrowserAnimationsModule,
    HttpModule,
    CommonModule,
    SharedModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatInputModule,
    FlexLayoutModule,
    ColorPickerModule,
    SharedMaterialModule,
    SharedModule,
    MessagesModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild(BookOneRoutes)
  ],
  declarations: [
    MessagesComponent,
    BookingComponent,
    ManageBookingComponent,
    PropertyComponent,
    RoomComponent,
    RoomServiceComponent,
    ManagePropertyComponent,
    AmenityComponent,
    ServiceComponent,
    BedComponent,
    DashboardComponent,
    StripePaymentComponent,
    ManageRoomComponent,
    ManagePaymentComponent,
    PaymentComponent,
    ManageExpenseComponent,
    ExpenseComponent,
    ConfirmDialogComponent,
    LoaderDialogComponent,
    AvailabilityComponent,
    RoomViewComponent,
    ExpenseSummaryComponent,
    PaymentSummaryComponent,
    ManageRatesAndAvailabilityComponent,
    RatesAndAvailabilityComponent,
    BookingCalenderComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthHttp,
    BookingService,
    ThemeService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },

    // For creating a mock back-end. You don't need these in a real app.
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions,
    MessageService,
    PaymentService,
    PropertyService,
    AddressService,
    ExpenseService,
    FileService,
    TokenStorage,
    PaymentService,
    NotificationService,
    AvailabilityService,
    DateUtilService,
    AlertService,
    HTTPStatus,
    ErrorsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    BookingCalendarService
  ],
  bootstrap: [],
  entryComponents: [
    BookingComponent,
    PropertyComponent,
    RoomComponent,
    ManageRoomComponent,
    ManagePaymentComponent,
    LoaderDialogComponent,
    PaymentComponent,
    ExpenseComponent,
    AvailabilityComponent,
    RatesAndAvailabilityComponent
  ],
  exports: [
    CdkTableModule
  ]
})
export class BookOneModule {}
