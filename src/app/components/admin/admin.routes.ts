import { Route } from '@angular/router';
import { SubscriptionGuard } from '../../guards/subscription.guard';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
      canActivate: [SubscriptionGuard]
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./users/add-users/add-users.component').then(
        (c) => c.AddUsersComponent
      ),
      canActivate: [SubscriptionGuard]
  },
  {
    path: 'organization',
    loadComponent: () =>
      import('./organization/organization.component').then(
        (c) => c.OrganizationComponent
      ),
  },
  {
    path: 'subscription',
    loadComponent: () =>
      import('./subscription/subscription.component').then(
        (c) => c.SubscriptionComponent
      ),
  },
  // {
  //   path: 'cards',
  //   loadComponent: () =>
  //     import('./user-cards/user-cards.component').then(
  //       (c) => c.UserCardsComponent
  //     ),
  // },
  {
    path: 'success',
    loadComponent: () =>
      import('./success-transaction/success-transaction.component').then(
        (c) => c.SuccessTransactionComponent
      ),
  },
  {
    path: 'failure',
    loadComponent: () =>
      import('./failure-transaction/failure-transaction.component').then(
        (c) => c.FailureTransactionComponent
      ),
  },


] as Route[];
