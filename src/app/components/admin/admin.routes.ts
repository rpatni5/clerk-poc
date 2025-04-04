import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/add-users/add-users.component').then(
        (c) => c.AddUsersComponent
      ),
  },
  {
    path: 'organization',
    loadComponent: () =>
      import('./organization/organization.component').then(
        (c) => c.OrganizationComponent
      ),
  },


] as Route[];
