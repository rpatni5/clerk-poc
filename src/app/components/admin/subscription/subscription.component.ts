import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  // subscription.component.ts
  plans = [
    {
      name: 'Free Plan',
      subtitle: '14-day trial for up to 2 users',
      features: [
        'Trial access to all features',
        'Limited to 2 users',
        'Basic support'
      ],
      price: 'Free',
      buttonText: 'Start Free Trial',
      buttonColor: 'primary',
      cssClass: 'free',
    },
    {
      name: 'Pro Plan',
      subtitle: '$15/month for 5–25 users',
      features: [
        'All Free plan features',
        'Up to 5 users included',
        'Scalable up to 25 users (add via settings)',
        'Email & chat support'
      ],
      price: '$15 / month',
      buttonText: 'Upgrade to Pro',
      buttonColor: 'accent',
      cssClass: 'pro',
    },
    {
      name: 'Enterprise Plan',
      subtitle: '$25/month for 25+ users',
      features: [
        'All Pro plan features',
        'Includes 25 users',
        'Unlimited users with scalable pricing',
        'Dedicated account manager'
      ],
      price: '$25 / month',
      buttonText: 'Upgrade to Enterprise',
      buttonColor: 'warn',
      cssClass: 'enterprise',
      
    }
  ];
}

