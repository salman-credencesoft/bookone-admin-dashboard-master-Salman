import { Routes } from '@angular/router';
import { ManagePaymentComponent } from './payment/manage-payment/manage-payment.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { ManageBookingComponent } from './booking/manage/manage-booking.component';
import { ManageRatesAndAvailabilityComponent } from './rates-availability/manage/manage-rates-availability.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePropertyComponent } from './property/manage-property/manage-property.component';
import { BookingCalenderComponent } from './booking-calender/booking-calender.component';
export const BookOneRoutes: Routes = [
  {
    path: '',
    component: BookingCalenderComponent,
    data: { title: 'Booking Calender', breadcrumb: 'Booking Calender' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
  },
  {
    path: 'manage-booking',
    component: ManageBookingComponent,
    data: { title: 'Manage Bookings', breadcrumb: 'Manage Bookings' }
  },
  { 
    path: 'manage-payment',
    component: ManagePaymentComponent ,
    data: { title: 'Manage Payments', breadcrumb: 'Manage Payments' }
    },
  { 
    path: 'manage-expense', 
    component: ManageExpenseComponent ,
    data: { title: 'Manage Expenses', breadcrumb: 'Manage Expenses' }
  },
  { 
    path: 'manage-rates-availability', 
    component: ManageRatesAndAvailabilityComponent,
    data: { title: 'Manage Rates & Availabilities', breadcrumb: 'Manage Rates & Availabilities' }
  },
  { 
    path: 'manage-property', 
    component: ManagePropertyComponent ,
    data: { title: 'Manage Property & Rooms', breadcrumb: 'Manage Property & Rooms' }

  },
  { 
    path: 'booking-calender', 
    component: BookingCalenderComponent ,
    data: { title: 'Booking Calender', breadcrumb: 'Booking Calender' }

  },
];
