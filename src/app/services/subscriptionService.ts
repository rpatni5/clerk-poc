import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private baseUrl = environment.API_URL;
    private controller = 'Subscription'
    constructor(private http: HttpClient) { }

    getPlans(tenantId: any) {
        return this.http.get<any>(`${this.baseUrl}${this.controller}/get?tenantId=${tenantId}`);
      }
}
