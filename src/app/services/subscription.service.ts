import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";
import { StripeCustomerResponseModel } from "../model/stripeCustomerResponseModel";
import { Observable } from "rxjs";
import { CheckoutSessionModel } from "../model/checkoutSessionModel";

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private baseUrl = environment.API_URL;
  private controller = 'Stripe'
  constructor(private http: HttpClient) { }

  subscribe(data: any) {
    return this.http.post('/api/subscription/create', data);
  }

  upgrade(data: any) {
    return this.http.post('/api/subscription/upgrade', data);
  }
  createCustomer(customerData: any): Observable<StripeCustomerResponseModel> {
    return this.http.post<StripeCustomerResponseModel>(`${this.baseUrl}Stripe/create-customer`, customerData);
  }

  createCheckoutSession(resp: CheckoutSessionModel) {
    return this.http.post<{ sessionId: string, url: string }>(
      `${this.baseUrl}Stripe/create-checkout-session`, resp
    );
  }
}
