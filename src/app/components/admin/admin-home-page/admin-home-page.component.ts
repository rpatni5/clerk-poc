import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClerkService } from '../../../services/clerkService';
import { take } from 'rxjs';
import { UserResource } from "@clerk/types";
import { StorageService } from '../../../services/storageService';
import { Tenant } from '../../../interface/tenantInterface';
import { User } from '../../../interface/userInterface';
 import { SubscriptionPlanService } from '../../../services/subscriptionPlanService';

@Component({
  selector: 'app-admin-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss'
})
export class AdminHomePageComponent {
  userImageUrl: string | null = null;
  usersData: User[] = [];
  organizationData: Tenant[] = [];
  isSystemAdministrator: boolean = false;
  isWorker: boolean = false;
  isSubscriptionValid: boolean = false;
  subscriptionMessage: string = '';
  
  constructor(private clerk: ClerkService, private router: Router,
    private storageService: StorageService,
    private cdRef: ChangeDetectorRef,
    private subscriptionService:SubscriptionPlanService
  ) { }

  ngOnInit() {
    const tenantId = localStorage.getItem('tenantId');
    
    if (tenantId) {
      this.subscriptionService.getSubscriptionStatus(tenantId).subscribe(status => {
        this.isSubscriptionValid = status.isActive;  
        this.subscriptionMessage = status.message;
      });
    }
    this.clerk.user$.subscribe((user: UserResource | null | undefined) => {
      if (user) {
        this.userImageUrl = user.imageUrl;
      }
    });
  }

  async logout() {
    try {
      this.clerk.clerk$.pipe(take(1)).subscribe(async (clerkInstance) => {
        if (clerkInstance) {
          await clerkInstance.signOut();
          localStorage.removeItem("userId");
          localStorage.removeItem("tenantId");
          localStorage.removeItem("organizationsData");
          localStorage.removeItem("customerId");
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('orgCreated_') || key.startsWith('customerCreated_')) {
              localStorage.removeItem(key);
            }
          });
          this.usersData = [];
          this.organizationData = [];

          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  ngAfterViewInit(): void {
    this.clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (!clerk) {
        console.error("Clerk is not initialized.");
        return;
      }
      const currentUser = clerk.user;
      if (!currentUser) {
        console.error("No user found.");
        return;
      }
      const accountAdminMembership = currentUser.organizationMemberships.find(membership =>
        membership.role === 'org:system_administrator'
      );
      const worker = currentUser.organizationMemberships.find(membership =>
        membership.role === 'org:worker'
      );
      if (accountAdminMembership?.role == 'org:system_administrator') {
        this.isSystemAdministrator = true;
      }
      if (accountAdminMembership?.role == 'org:worker') {
        this.isWorker = true;
      }
      this.cdRef.detectChanges();
    });
  }

  manageAccount() {
    this.clerk.openUserProfile();
  }
}
