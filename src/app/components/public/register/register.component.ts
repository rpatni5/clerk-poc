import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  Input,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { ClerkService } from '../../../services/clerkService';
import { CreateOrganizationProps, SignUpProps } from '@clerk/clerk-js/dist/types/ui/types';
import { StorageService } from '../../../services/storageService';
import { User } from '../../../interface/userInterface';
import { Tenant } from '../../../interface/tenantInterface';
import { OrganizationService } from '../../../services/organizationService';
import { OrganizationModel } from '../../../model/organizationModel';
import { SubscriptionService } from '../../../services/subscription.service';
import { stripeCustomerModel } from '../../../model/stripeCustomerModel';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild("clerkSignUp") clerkSignUpRef!: ElementRef;
  @ViewChild("clerkOrgCreate") clerkOrgCreateRef!: ElementRef;
  @Input() props: SignUpProps | undefined;
  @Input() orgProps: CreateOrganizationProps | undefined;

  userId: string | null = null;
  organizationId: string | null = null;
  organizationName: string = '';
  isOrgSaved: boolean = false;
  isCustomerCreated: boolean = false;
  constructor(private clerkService: ClerkService, private ngZone: NgZone, private router: Router, private storageService: StorageService,
    private cdRef: ChangeDetectorRef,
    private organizationService: OrganizationService,
    private subscriptionService: SubscriptionService) { }

  ngAfterViewInit() {
    localStorage.removeItem("userId");
    localStorage.removeItem("tenantId");

    this.mountSignUp();

  }

  mountSignUp() {
    if (this.clerkSignUpRef?.nativeElement) {
      this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
        clerk.mountSignUp(this.clerkSignUpRef.nativeElement, {
          ...this.props,
        });
      });

      this.clerkService.user$.pipe(
        filter(user => !!user),
        take(1)
      ).subscribe((user) => {
        if (user) {
          this.userId = user.id;

          const newUser: User = {
            id: user.id,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            tenantId: "",
            username: user.username ?? '',
            role: '',
            createdAt: user.createdAt ?? new Date(),
            email: user.primaryEmailAddress?.emailAddress
          };
          console.log("user", user);
          this.storageService.saveUser(newUser);
          const usersData = this.storageService.getUsers();
          console.log("Stored Users in Local Storage:", usersData);
          this.openCreateOrganization();

        }
      });
    }
  }

  openCreateOrganization() {
    this.cdRef.detectChanges();
    if (!this.clerkOrgCreateRef || !this.clerkOrgCreateRef.nativeElement) {
      this.router.navigate(['/register']);
      console.error(" clerkOrgCreateRef is still not available!");
      return;
    }
    const updatedOrgProps: CreateOrganizationProps = {
      ...this.orgProps,
      skipInvitationScreen: true,
    };
    this.clerkService.clerk$.subscribe((clerk) => {
      clerk.mountCreateOrganization(this.clerkOrgCreateRef.nativeElement, updatedOrgProps);

      this.clerkService.organization$.pipe(take(1)).subscribe((org) => {
        if (org) {
          console.log("Organization", org)
          this.organizationId = org.id;
          const newOrg: Tenant = {
            id: org.id,
            organizationName: org.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
          };
          this.storageService.saveOrganization(newOrg);
          const isOrgCreated = localStorage.getItem("orgCreated_" + org.id);
          const isCustomerCreated = localStorage.getItem("customerCreated_" + org.id);
          if (isOrgCreated == null) {
            this.saveOrg(newOrg);
          }
          const users = this.storageService.getUsers();
          const updatedUsers = users.map(user =>
            user.id === this.userId ? { ...user, tenantId: this.organizationId } : user
          );
          localStorage.setItem("tenantId", JSON.stringify(this.organizationId));
          localStorage.setItem("usersData", JSON.stringify(updatedUsers));
          const currentUser = users.find(user => user.id === this.userId);
          if (isCustomerCreated == null) {
            this.createCustomer(org, currentUser)
          }
          this.ngZone.run(() => {
            console.log("Navigating to /admin/dashboard...");
            this.router.navigate(['/admin/dashboard']).then(() => {
            });
          });
        }
      });
    });
  }
  async saveOrg(organizationModel: any): Promise<boolean> {
    try {
      await this.organizationService.save(organizationModel);
      localStorage.setItem("orgCreated_" + organizationModel.id, "true");
      return true;
    } catch (err) {
      console.error('Save organization failed:', err);
      return false;
    }
  }

  async createCustomer(org: any, currentUser: any): Promise<boolean> {
    const customer: stripeCustomerModel = {
      organizationName: org.name,
      organizationId: org.id,
      createdAt: new Date().toISOString(),
      userName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      email: currentUser?.email,
      userId: currentUser?.id
    };
    try {
      await this.subscriptionService.createCustomer(customer);
      localStorage.setItem("customerCreated_" + org.id, "true");
      return true;
    } catch (err) {
      console.error("Customer creation failed", err);
      return false;
    }
  }

  ngOnDestroy(): void {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountSignUp(this.clerkSignUpRef?.nativeElement);
    });
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountCreateOrganization(this.clerkOrgCreateRef?.nativeElement);
    });

  }
}
