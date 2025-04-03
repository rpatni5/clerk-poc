import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClerkService } from '../../../services/clerkService';
import { take } from 'rxjs';
import { UserResource } from "@clerk/types";

@Component({
  selector: 'app-admin-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.scss'
})
export class AdminHomePageComponent {
  userImageUrl: string | null = null;

  constructor(private clerk: ClerkService, private router: Router) { }

  ngOnInit() {
    this.clerk.user$.subscribe((user: UserResource | null | undefined) => {
      if (user) {
        this.userImageUrl = user.imageUrl; 
      }
    });
  }
  
  async logout() {
    try {
      this.clerk.clerk$.pipe(take(1)).subscribe(async (clerkInstance) => {
        if (clerkInstance) {
          await clerkInstance.signOut();
 
          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  

  manageAccount() {
    this.clerk.openUserProfile(); 
  }
}
