import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";
import { Observable } from "rxjs";

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

    getSubscriptionStatus(organizationId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}SubscriptionPlan/check-status?organizationId=${organizationId}`);
    }

}
