import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private clerk: ClerkService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.clerk.user$.pipe(
      map((user) => {
        if (user) {
          return true; 
        } else {
          this.router.navigate(['/login']); 
          return false;
        }
      })
    );
  }

}
