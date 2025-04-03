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
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { ClerkService } from '../../../services/clerkService';
import { CreateOrganizationProps, SignUpProps } from '@clerk/clerk-js/dist/types/ui/types';
import { StorageService } from '../../../services/storageService';
import { User } from '../../../interface/userInterface';
import { Tenant } from '../../../interface/tenantInterface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild("clerkSignUp") clerkSignUpRef!: ElementRef;
  @ViewChild("clerkOrgCreate") clerkOrgCreateRef!: ElementRef;
  // @ViewChild('clerkOrgCreate', { static: false }) clerkOrgCreateRef!: ElementRef;
  @Input() props: SignUpProps | undefined;
  @Input() orgProps: CreateOrganizationProps | undefined;

  userId: string | null = null;
  organizationId: string | null = null;
  organizationName: string = '';

  constructor(private clerkService: ClerkService, private router: Router,private storageService :StorageService,
    private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.mountSignUp();

  }

  mountSignUp() {
    if (this.clerkSignUpRef?.nativeElement) {
      this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
        clerk.mountSignUp(this.clerkSignUpRef.nativeElement, {
          ...this.props,
          signInUrl: '/login',
          afterSignUpUrl: 'http://localhost:4200/register#/verify-email-address'
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
      afterCreateOrganizationUrl: '/admin/dashboard'
    };
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountCreateOrganization(this.clerkOrgCreateRef.nativeElement, updatedOrgProps);
    });
    
    this.clerkService.organization$.pipe(take(1)).subscribe((org) => {
      if (org) {
        this.organizationId = org.id;
        // const newOrg: Tenant = {
        //   id: org.id,
        //   organizationName: org.name,
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        //   isActive: true,
        // };
        // this.storageService.saveOrganization(newOrg);
        // const users = this.storageService.getUsers();
        // const updatedUsers = users.map(user =>
        //   user.id === this.userId ? { ...user, tenantId: this.organizationId } : user
        // );
        // localStorage.setItem("tenantId", JSON.stringify(this.organizationId));

        // localStorage.setItem("usersData", JSON.stringify(updatedUsers));

        this.router.navigate(['/admin/dashboard']);
      }
    });

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
