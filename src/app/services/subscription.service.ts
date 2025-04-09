import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private baseUrl = environment.API_URL;
  private controller = 'Subscription'
  constructor(private http: HttpClient) { }

  subscribe(data: any) {
    return this.http.post('/api/subscription/create', data);
  }

  upgrade(data: any) {
    return this.http.post('/api/subscription/upgrade', data);
  }
  createCustomer(customerData: any) {
    return this.http.post(`${this.baseUrl}Stripe/create-customer`, customerData);
  }
}
