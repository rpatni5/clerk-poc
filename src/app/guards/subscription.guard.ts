
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionPlanService } from '../services/subscriptionPlanService';

@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {

  constructor(private subscriptionService: SubscriptionPlanService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    const organizationsDataString = localStorage.getItem('organizationsData');
    let organizationId: string | null = null;

    if (organizationsDataString) {
      try {
        const organizations = JSON.parse(organizationsDataString);
        const activeOrg = organizations.find((org: any) => org.isActive);
        organizationId = activeOrg?.id;
      } catch (e) {
        console.error('Error parsing organizationsData from localStorage', e);
      }
    }

    if (!organizationId) {
      return of(this.router.createUrlTree(['/admin/subscription']));
    }

    return this.subscriptionService.getSubscriptionStatus(organizationId).pipe(
      map(isActive => {
        return isActive ? true : false;
      })
    );
  }
}
