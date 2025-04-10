import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SubscriptionPlanService } from '../../../services/subscriptionPlanService';
import { OrganizationService } from '../../../services/organizationService';
import { StorageService } from '../../../services/storageService';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../../services/subscription.service';
import { CheckoutSessionModel } from '../../../model/checkoutSessionModel';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  plans: any[] = [];
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly organizationService: OrganizationService,
    private router: Router,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit() {
    console.log(localStorage)
    const customerId = localStorage.getItem('customerId');
    this.subscriptionPlanService.getPlans(customerId).subscribe((data: any[]) => {
      const locale: string = 'en-US';

      this.plans = data.map((plan: any) => {
        const createdAt = new Date(plan.createdAt);
        const expiryDate = new Date(createdAt);
        expiryDate.setDate(createdAt.getDate() + 14);

        const isExpired = expiryDate < new Date();

        return {
          ...plan,
          features: typeof plan.features === 'string' ? plan.features.split(',') : plan.features,
          createdAtFormatted: createdAt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
          expiryDateFormatted: expiryDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
          isExpired
        };
      });
    })
  }

  async updatePlan(priceId: string) {
    let customerId= localStorage.getItem("customerId")
    var resp : CheckoutSessionModel={
      priceId : priceId,
      quantity:1,
      mode:"subscription",
      stripeCustomerId: customerId,
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
}