import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClerkService } from '../../../services/clerkService';
import { filter, take } from 'rxjs';
import { StorageService } from '../../../services/storageService';
import { SignInProps } from '@clerk/clerk-js/dist/types/ui/types';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @ViewChild("clerkSignIn") clerkSignInRef!: ElementRef;
  @Input() props: SignInProps | undefined;

  constructor(
    private storageService: StorageService,
    private clerkService: ClerkService,
    private router: Router,
  ) { }

  ngAfterViewInit() {
    this.mountSignIn();
  }

  mountSignIn() {
    if (this.clerkSignInRef?.nativeElement) {
      this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
        clerk.mountSignIn(this.clerkSignInRef.nativeElement, {
          ...this.props,
          // signUpUrl: '/register' 
        });
      });
  
      this.clerkService.user$.pipe(
        filter(user => !!user),
        take(1)
      ).subscribe((user) => {
        if (user) {
          const usersData = this.storageService.getUsers();
          const currentUser = usersData.find(u => u.id === user.id);
      
          if (currentUser?.tenantId) {
            this.router.navigate(['/admin/dashboard']).then(() => {
              window.location.reload();
            });
          } else {
            console.error("Tenant ID missing! Redirecting to register.");
            // this.router.navigate(['/register']);
          }
        }
      });
      // this.clerkService.user$.pipe(
      //   filter(user => !!user),
      //   take(1)
      // ).subscribe(() => {
      //   this.router.navigate(['/admin/dashboard']).then(() => {
      //     window.location.reload();
      //   });
      //   // this.router.navigate(['/admin/dashboard']);
      // });
    }
  }

}
