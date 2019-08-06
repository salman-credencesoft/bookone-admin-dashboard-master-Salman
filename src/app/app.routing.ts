import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './services/auth-guard.service';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'sessions/signin',
    pathMatch: 'full'
  },
  // {
  //   path: 'home',
  //   loadChildren: './views/home/home.module#HomeModule',
  //   data: { title: 'Choose A Demo' }
  // },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './views/sessions/sessions.module#SessionsModule',
        data: { title: 'Session' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
     /* {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' }
      },*/
      {
        path: 'bookone',
        loadChildren: './views/bookone/bookone.module#BookOneModule',
        data: { title: 'BookOne', breadcrumb: 'BOOKONE' }
      },
      {
        path: 'bookone-admin',
        loadChildren: './views/bookone-admin/bookone-admin.module#BookoneAdminModule',
        data: { title: 'BookOne Admin', breadcrumb: 'Admin' }
      },

      {
        path: 'profile',
        loadChildren: './views/profile/profile.module#ProfileModule',
        data: { title: 'Profile', breadcrumb: 'PROFILE' }
      },
      {
        path: 'page-layouts',
        loadChildren:
          './views/page-layouts/page-layouts.module#PageLayoutsModule'
      },
      {
        path: 'utilities',
        loadChildren: './views/utilities/utilities.module#UtilitiesModule'
      }
    ]
  },
  // {
  //   path: '**',
  //   redirectTo: 'sessions/404'
  // }
];
