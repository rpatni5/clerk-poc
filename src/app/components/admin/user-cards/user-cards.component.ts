import { Component } from '@angular/core';
import { environment } from '../../../../enviornment/environment';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardElement,
} from '@stripe/stripe-js';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-user-cards',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './user-cards.component.html',
  styleUrl: './user-cards.component.scss'
})
export class UserCardsComponent {
  dialogInstance: any;
  elements!: StripeElements;
  stripe!: Stripe |null;
  cardElement!: StripeCardElement;
  cardError: string | null = null;

  async addCard() {
    await this.initStripe();
    this.dialogInstance.show();
  }
  async initStripe() {
    this.stripe = await loadStripe(environment.STRIPE_PUBLISHABLE_KEY);
    if (!this.stripe) {
      console.error("Stripe failed to initialize.");
      return;
    }
    this.elements = this.stripe.elements();

    // Create card element
    this.cardElement = this.elements.create('card');
    this.cardElement.mount('#card-element');

    // Handle real-time validation errors
    this.cardElement.on('change', (event) => {
      this.cardError = event.error ? event.error.message : null;
    });
  }
}
