import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ClerkService } from '../services/clerkService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private clerk: ClerkService, private router: Router,

  ) { }

  canActivate(): Observable<boolean> {
    return this.clerk.user$.pipe(
      map((user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }
        const usersData = JSON.parse(localStorage.getItem("usersData") || "[]");
        const currentUser = usersData.find((u: any) => u.id === user.id);
        // const isSystemAdmin = user.organizationMemberships?.some(
        //   (membership: any) =>
        //     membership.role_name === 'System Administrator' ||
        //     membership.role === 'org:system_administrator'
        // );

        // if (isSystemAdmin) {
        //   this.router.navigate(['/admin/organization']);
        //   return true;
        // }
        if (currentUser && currentUser.tenantId) {
          return true;
        } else {
          this.router.navigate(['/register']);
          return false;
        }
      })
    );
  }
}

