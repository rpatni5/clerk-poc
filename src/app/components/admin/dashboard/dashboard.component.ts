import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storageService';
import { User } from '../../../interface/userInterface';
import { Tenant } from '../../../interface/tenantInterface';
import { JsonReaderService } from '../../../services/jsonReaderService';
import { UserProfileProps } from '@clerk/clerk-js/dist/types/ui/types';
import { ClerkService } from '../../../services/clerkService';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  usersData: User[] = [];
  organizationData: Tenant[] = [];

  @ViewChild("organizationProfile", { static: false }) organizationProfileRef!: ElementRef;
  @Input() props: UserProfileProps | undefined;

  constructor(
    private clerkService: ClerkService,
    private storageService: StorageService,
    private jsonReaderService: JsonReaderService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.mountOrganizationProfile();
  }

  mountOrganizationProfile() {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (!clerk) {
        console.error("Clerk is not initialized.");
        return;
      }

      if (this.organizationProfileRef) {
        clerk.mountOrganizationProfile(this.organizationProfileRef.nativeElement);
      }

      // this.addMemberToOrganization(clerk);
    });
  }

  // addMemberToOrganization(clerk: any) {
  //   if (!clerk.organization) {
  //     console.error("Clerk organization not found.");
  //     return;
  //   }

  //   const userId = "user_2vDDy9A0EwUajCVu2BmP2yGld1o"; // Replace with dynamic userId

  //   clerk.organization.addMember({ userId, role: 'org:admin' })
  //     .then(() => {
  //       console.log(`User ${userId} added successfully to the organization.`);
  //     })
  //     .catch((error: any) => {
  //       console.error("Error adding user:", error);
  //     });
  // }

  loadUsers() {
    this.usersData = this.storageService.getUsers();
    console.log("Stored usersData:", this.usersData);

    this.organizationData = this.storageService.getOrganizations();
    console.log("Stored organizationData:", this.organizationData);
  }
}