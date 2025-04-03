import { Injectable } from '@angular/core';
import { Tenant } from '../interface/tenantInterface';
import { User } from '../interface/userInterface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private usersKey = 'usersData';
  private organizationsKey = 'organizationsData';

  constructor() {}

  saveUser(user: User): void {
    const users: User[] = this.getUsers();
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  saveOrganization(org: Tenant): void {
    const organizations: Tenant[] = this.getOrganizations();
    organizations.push(org);
    localStorage.setItem(this.organizationsKey, JSON.stringify(organizations));
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  getOrganizations(): Tenant[] {
    const organizations = localStorage.getItem(this.organizationsKey);
    return organizations ? JSON.parse(organizations) : [];
  }

  clearStorage(): void {
    localStorage.removeItem(this.usersKey);
    localStorage.removeItem(this.organizationsKey);
    localStorage.removeItem('tenantId');
    console.log("Storage cleared.");
  }
}
