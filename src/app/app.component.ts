import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
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
  
    // setTimeout(() => {
    //   console.log("Executed after 3 seconds");
    //   this.loaded = true;
    // }, 3000);
    
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

