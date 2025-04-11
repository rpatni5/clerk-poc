import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/public/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/public/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard,SubscriptionGuard],
    loadChildren: () => import('./components/admin/admin.routes'),
    loadComponent: () =>
      import('./components/admin/admin-home-page/admin-home-page.component').then(
        (c) => c.AdminHomePageComponent
      ),
  },
  { path: '**', redirectTo: 'login' }, 
];
