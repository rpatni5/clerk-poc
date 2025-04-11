import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";
import { Observable } from "rxjs";
import { SubscriptionStatusResult } from "../model/subscriptionStatusModel";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionPlanService {
    private baseUrl = environment.API_URL;
    private controller = 'SubscriptionPlan'
    constructor(private http: HttpClient) { }

    getPlans(organizaitonId: any) {
        return this.http.get<any>(`${this.baseUrl}${this.controller}/get?organizationId=${organizaitonId}`);
    }

    getSubscriptionStatus(organizationId: string): Observable<SubscriptionStatusResult> {
        return this.http.get<SubscriptionStatusResult>(
            `${this.baseUrl}SubscriptionPlan/check-status?organizationId=${organizationId}`
        );
    }
}
