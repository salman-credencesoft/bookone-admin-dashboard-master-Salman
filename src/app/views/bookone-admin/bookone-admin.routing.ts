import { Routes } from '@angular/router';
import { ManagePaymentGatewayComponent } from './payment-gateway/manage-payment-gateway/manage-payment-gateway.component';
import { DashboardComponent } from './dashboard/dashboard.component';
export const BookOneAdminRoutes: Routes = [
{
    path: '',
    component: DashboardComponent,
    data: { title: 'Admin Dashboard', breadcrumb: 'BookOne Admin Dashboard' }

},
{
    path: 'manage-payment-gateway',
    component: ManagePaymentGatewayComponent,
    data: { title: 'Manage Payment Gateway', breadcrumb: 'Manage Payment Gateway' }

}

];