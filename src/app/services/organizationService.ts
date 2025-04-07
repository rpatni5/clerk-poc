import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviornment/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private baseUrl = environment.API_URL;
    constructor(private http: HttpClient) { }

    getOrganizations() {
        return this.http.get<any>(`${this.baseUrl}Organization/get`)
    }
}

