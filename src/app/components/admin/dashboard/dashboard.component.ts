import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storageService';
import { User } from '../../../interface/userInterface';
import { Tenant } from '../../../interface/tenantInterface';
import { JsonReaderService } from '../../../services/jsonReaderService';
import { OrganizationListProps, OrganizationProfileProps, UserProfileProps } from '@clerk/clerk-js/dist/types/ui/types';
import { ClerkService } from '../../../services/clerkService';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  usersData: User[] = [];
  organizationData: Tenant[] = [];
  public userHasAccountAdminRole: boolean = false;
  @ViewChild("organizationProfile", { static: false }) organizationProfileRef!: ElementRef;
  @Input() props: UserProfileProps | undefined;
  @Input() orgProps: OrganizationProfileProps | undefined;

  constructor(
    private clerkService: ClerkService,
    private storageService: StorageService,
    private jsonReaderService: JsonReaderService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }


  ngAfterViewInit(): void {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
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
        membership.role === 'org:account_admin'
      );
      console.log("role", accountAdminMembership?.role)
      if(accountAdminMembership?.role == 'org:account_admin'){
       this.userHasAccountAdminRole = true;
      }
      this.cdRef.detectChanges();
      this.mountOrganizationProfile();
    });


   
  }

  mountOrganizationProfile() {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (!clerk) {
        console.error("Clerk is not initialized.");
        return;
      }

      if (this.organizationProfileRef) {
        clerk.mountOrganizationProfile(this.organizationProfileRef.nativeElement, {
          ...this.orgProps,
          appearance: {
            elements: {
              formButtonPrimary: {
                fontSize: 14,
                textTransform: 'none',
                backgroundColor: 'red',
                '&:hover, &:focus, &:active': {
                  backgroundColor: '#49247A',
                },
              },
            },
          },
        } as OrganizationProfileProps);
      }
    });
  }

  addMemberToOrganization(clerk: any) {
    if (!clerk.organization) {
      console.error("Clerk organization not found.");
      return;
    }
    const userId = "user_2vDDy9A0EwUajCVu2BmP2yGld1o";
    clerk.organization.addMember({ userId, role: 'org:worker' })
      .then(() => {
        console.log(`User ${userId} added successfully to the organization.`);
      })
      .catch((error: any) => {
        console.error("Error adding user:", error);
      });
  }

  loadUsers() {
    this.usersData = this.storageService.getUsers();
    console.log("Stored usersData:", this.usersData);

    this.organizationData = this.storageService.getOrganizations();
    console.log("Stored organizationData:", this.organizationData);
  }
}