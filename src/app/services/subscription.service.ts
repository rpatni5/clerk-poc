import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  subscribe(data: any) {
    return this.http.post('/api/subscription/create', data);
  }

  upgrade(data: any) {
    return this.http.post('/api/subscription/upgrade', data);
  }
}
