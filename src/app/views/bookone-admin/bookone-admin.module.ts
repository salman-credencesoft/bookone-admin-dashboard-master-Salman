import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { 
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSlideToggleModule
 } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { BookOneAdminRoutes } from './bookone-admin.routing';
import { ManagePaymentGatewayComponent } from './payment-gateway/manage-payment-gateway/manage-payment-gateway.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway/payment-gateway.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [ManagePaymentGatewayComponent, PaymentGatewayComponent, DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(BookOneAdminRoutes)
  ],
  providers: [],
  entryComponents: []
  
})
export class BookoneAdminModule { }

  

