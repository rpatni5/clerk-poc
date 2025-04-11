import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClerkService } from '../../../services/clerkService';
import { filter, take } from 'rxjs';
import { StorageService } from '../../../services/storageService';
import { SignInProps } from '@clerk/clerk-js/dist/types/ui/types';
import { SubscriptionPlanService } from '../../../services/subscriptionPlanService';


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
  isSubscriptionValid: boolean = false;
  subscriptionMessage: string = '';
  constructor(
    private storageService: StorageService,
    private clerkService: ClerkService,
    private router: Router, private subscriptionService: SubscriptionPlanService
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
          console.log("clerk", user)
          const systemAdminMembership = user.organizationMemberships.find(membership =>
            membership.role === 'org:system_administrator'
          );
          
          const tenantId = user.organizationMemberships?.[0]?.organization?.id;

          if (tenantId) {

            localStorage.setItem("tenantId", (tenantId));
            if (systemAdminMembership) {
              // this.router.navigate(['/admin/organization']); 
              window.location.href = '/admin/organization';
            } else {
              this.subscriptionService.getSubscriptionStatus(tenantId).subscribe(status => {
                this.isSubscriptionValid = status.isActive;
                this.subscriptionMessage = status.message;

                if (this.isSubscriptionValid) {
                  // this.router.navigate(['/admin/dashboard']);
                  window.location.href ='/admin/dashboard'
                } else {
                  // this.router.navigate(['/admin/subscription']);
                  window.location.href = '/admin/subscription'
                }
              });
            }
          } else {
            console.error("Tenant ID missing! Redirecting to register.");
          }
        }
      });

    }
  }

}
