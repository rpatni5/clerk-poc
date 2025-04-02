// import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { ClerkService, CreateOrganizationProps, SignUpProps } from 'ngx-clerk';
// import { take } from 'rxjs/operators';
// import { environment } from '../../../../enviornment/local.enviornment';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.scss',
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class RegisterComponent {
//   constructor(private clerk: ClerkService, private router: Router) { }

//   signUpOptions = {
//     additionalFields: [
//       { label: "Organization Name", key: "organization_name", type: "text" }
//     ]
//   };

//   async register() {
//     try {
//       this.clerk.openSignUp();
//       this.router.navigate(['/admin/dashboard']);
//     } catch (error) {
//       console.error('Registration error:', error);
//     }
//   }
//   // async register() {
//   //   try {
//   //     this.clerk.openSignUp();

//   //     setTimeout(async () => {
//   //       const user = await this.getUserData();
//   //       if (user) {
//   //         const tenantId = await this.createOrganizationForUser(user.id, user.publicMetadata?.organization_name);
//   //         console.log("✅ Tenant ID (Organization ID):", tenantId);

//   //         this.router.navigate(['/admin/dashboard'], { queryParams: { tenantId } });
//   //       }
//   //     }, 3000);
//   //   } catch (error) {
//   //     console.error('Registration error:', error);
//   //   }
//   // }

//   async getUserData() {
//     return new Promise<any>((resolve, reject) => {
//       this.clerk.user$.pipe(take(1)).subscribe(user => {
//         if (user) resolve(user);
//         else reject("No user found");
//       });
//     });
//   }

//   async createOrganizationForUser(userId: string, orgName: string = "Default Organization") {
//     try {
//       // Create Organization via Clerk API
//       const response = await fetch('https://api.clerk.dev/v1/organizations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer sk_test_y6WoAJUwfZPgSpiwI54yKn82l1GrzLz9Lk6ad5LKay`, 
//         },
//         body: JSON.stringify({ name: orgName })
//       });

//       const organization = await response.json();
//       console.log("✅ Organization Created:", organization);


//       const tenantId = organization.id;

//       // Associate user with the organization
//       await fetch(`https://api.clerk.dev/v1/organizations/${tenantId}/memberships`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer sk_test_y6WoAJUwfZPgSpiwI54yKn82l1GrzLz9Lk6ad5LKay`,
//         },
//         body: JSON.stringify({ user_id: userId, role: "admin" })
//       });

//       return tenantId;  

//     } catch (error) {
//       console.error("❌ Error creating organization:", error);
//       return null;
//     }
//   }
// }

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { Router } from '@angular/router';
import { ClerkService, SignUpProps } from 'ngx-clerk';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  constructor(private clerkService: ClerkService, private router: Router) { }

  // ngAfterViewInit() {
  //   this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
  //     if (this.ref?.nativeElement) {
  //       clerk.mountSignUp(this.ref.nativeElement, {
  //         ...this.props,  // ✅ Spread existing props
  //         unsafeMetadata: {
  //           organization_name: "" // ✅ Add custom field
  //         }
  //       });
  //     }
  //   });
  // }
  

  @ViewChild("clerkSignUp") clerkSignUpRef!: ElementRef;
  
  @Input() signUpProps: SignUpProps = {
    appearance: {
      variables: {
        colorPrimary: "#4A90E2"
      }
    },
    unsafeMetadata: {
      organization_name: "" 
    }
  };
  signUpOptions = {
    additionalFields: [
      {
        label: "Organization Name",
        key: "organization_name",
        type: "text"
      }
    ]
  };
  

 
  ngAfterViewInit(): void {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (this.clerkSignUpRef?.nativeElement) {
        clerk.mountSignUp(this.clerkSignUpRef.nativeElement, this.signUpProps);
      }
    });
  }
  async register() {
    try {
      this.clerkService.openSignUp();
      this.router.navigate(["/admin/dashboard"]); // ✅ Redirect to dashboard
    } catch (error) {
      console.error("Registration error:", error);
    }
  }
  ngOnDestroy(): void {
    this.clerkService.clerk$.pipe(take(1)).subscribe((clerk) => {
      if (this.clerkSignUpRef?.nativeElement) {
        clerk.unmountSignUp(this.clerkSignUpRef.nativeElement);
      }
    });
  }
}
