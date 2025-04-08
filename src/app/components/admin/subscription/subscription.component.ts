import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SubscriptionService } from '../../../services/subscriptionService';
import { OrganizationService } from '../../../services/organizationService';
import { StorageService } from '../../../services/storageService';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  plans: any[] = [];
  constructor(private readonly subscriptionService: SubscriptionService,
    private readonly organizationService: OrganizationService,
  ) {
  }

  ngOnInit() {
    const orgId = localStorage.getItem('tenantId');
    const tenantId = orgId ? orgId.replace(/^"|"$/g, '') : null;
    this.subscriptionService.getPlans(tenantId).subscribe((data: any[]) => {
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
}