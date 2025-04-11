export interface CheckoutSessionModel {
    priceId?: string;
    quantity?: number;
    mode?: string;
    stripeCustomerId?:string |null;
    organizationId?:string|null;
  }