import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { filter, take } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private clerk: ClerkService, private router: Router) {}

  async login() {
    try {
      const clerkInstance = await this.clerk.clerk$.pipe(take(1)).toPromise();
      
      if (clerkInstance) {
         clerkInstance.openSignIn();
        this.clerk.user$.pipe(
          filter(user => !!user), 
          take(1) 
        ).subscribe(() => {
          this.router.navigate(['/admin/dashboard']).then(() => {
            window.location.reload();
          });
        });
  
      } else {
        console.error('Clerk instance is not available');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  
}
