import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionPlanService {
    private baseUrl = environment.API_URL;
    private controller = 'SubscriptionPlan'
    constructor(private http: HttpClient) { }

    getPlans(customerId: any) {
        return this.http.get<any>(`${this.baseUrl}${this.controller}/get?customerId=${customerId}`);
      }
}
