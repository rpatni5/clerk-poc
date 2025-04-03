import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './enviornment/environment';


import { Clerk } from '@clerk/clerk-js';

if (!environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const clerk = new Clerk(environment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
clerk.load()
  .then(() => {
    console.log("Clerk initialized successfully");
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error("Clerk failed to load", err);
  });
