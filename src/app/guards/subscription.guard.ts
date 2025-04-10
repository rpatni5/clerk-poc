import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SubscriptionPlanService } from '../services/subscriptionPlanService';
import { ClerkService } from '../services/clerkService';

@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {

  constructor(
    private subscriptionService: SubscriptionPlanService,
    private clerk: ClerkService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.clerk.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(this.router.createUrlTree(['/login']));
        }

        const usersData = JSON.parse(localStorage.getItem("usersData") || "[]");
        const currentUser = usersData.find((u: any) => u.id === user.id);

        const tenantId = currentUser?.tenantId;
        localStorage.setItem("tenantId", (tenantId));

        if (!tenantId) {
          return of(this.router.createUrlTree(['/admin/subscription']));
        }

        return this.subscriptionService.getSubscriptionStatus(tenantId).pipe(
          map(isActive => {
            return isActive ? true : this.router.createUrlTree(['/admin/subscription']);
          })
        ); 
      })
    );
  }
}
