import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SubscriptionPlanService } from '../../../services/subscriptionPlanService';
import { OrganizationService } from '../../../services/organizationService';
import { StorageService } from '../../../services/storageService';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../services/subscription.service';
import { CheckoutSessionModel } from '../../../model/checkoutSessionModel';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  plans: any[] = [];
  organizaitonId: any;
  isSubscriptionValid: boolean = true;
  subscriptionMessage!: string;
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly organizationService: OrganizationService,
    private router: Router,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit() {
    console.log(localStorage)
    this.organizaitonId = localStorage.getItem('tenantId');
    // if (organizationsDataString) {
    //   const organizations = JSON.parse(organizationsDataString);
    //   const activeOrg = organizations.find((org: any) => org.isActive);
    //  this.organizaitonId= activeOrg?.id;
    // }
    this.subscriptionPlanService.getPlans(this.organizaitonId).subscribe((data: any[]) => {
      const locale: string = 'en-US';
      this.plans = data.map((plan: any) => {
        const createdAt = new Date(plan.createdAt);
        const expiryDate = new Date(plan.expiryDate);
        const isExpired = expiryDate < new Date();
        return {
          ...plan,
          features: typeof plan.features === 'string' ? plan.features.split(',') : plan.features,
          createdAtFormatted: createdAt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
          expiryDateFormatted: expiryDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
          isExpired,
        };
      });
    })
    this.subscriptionPlanService.getSubscriptionStatus( this.organizaitonId).subscribe(status => {
      this.isSubscriptionValid = status.isActive;
      this.subscriptionMessage = status.message;
    });
  }

  async updatePlan(priceId: string,customerId:string) {
    // let customerId = localStorage.getItem("customerId")
    var resp: CheckoutSessionModel = {
      priceId: priceId,
      quantity: 1,
      mode: "subscription",
      stripeCustomerId: customerId,
      organizationId: this.organizaitonId,
    }
    this.subscriptionService.createCheckoutSession(resp).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp?.url) {
          window.location.href = resp.url;
        }
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
      }
    });
  }
  get isEnterprisePlanActive(): boolean {
    return this.plans?.some(
      plan =>
        plan.name?.toLowerCase().includes('enterprise') &&
        plan.productId === plan.activePlanId &&
        plan.isActivated &&
        this.isSubscriptionValid
    );
  }
  
}