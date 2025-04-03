import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkService } from './services/clerkService';
import { environment } from '../enviornment/environment';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  loaded: boolean = false;
  constructor(private clerk: ClerkService) {
    this.initializeClerk();
  }
  ngOnInit(): void {
  }

  initializeClerk() {
    try {
      this.clerk.__init({
        publishableKey: environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      });
      // this.loaded = true;
      
    } catch (error) {
      console.error('Error initializing Clerk:', error);
    }
  }
}

