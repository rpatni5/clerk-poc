import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../enviornment/environment";
import { OrganizationModel } from "../model/organizationModel";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private baseUrl = environment.API_URL;
    private controller = 'Organization'
    constructor(private http: HttpClient) { }

    getOrganizations() {
        return this.http.get<any>(`${this.baseUrl}${this.controller}/get`)
    }

    getById(id: any) {
        return this.http.get<any>(`${this.baseUrl}${this.controller}/${id}`);
    }
    save(organization: OrganizationModel) {
        return this.http.post<any>(`${this.baseUrl}${this.controller}/save`, organization);
    }

    markExpire(organizationId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}${this.controller}/mark-expire?organizationId=${organizationId}`, {});
      }
      
}
