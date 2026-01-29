import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  
  // Store current user type
  private currentUserType = 'suv'; // default

  constructor(private router: Router) {}

  login(email: string) {
    // Determine car type based on email for mock purposes
    if (email.includes('sedan')) {
      this.currentUserType = 'sedan';
    } else if (email.includes('hatch')) {
      this.currentUserType = 'hatchback';
    } else if (email.includes('ev')) {
      this.currentUserType = 'ev';
    } else if (email.includes('luxury')) {
      this.currentUserType = 'luxury';
    } else if (email.includes('used')) {
      this.currentUserType = 'used';
    } else {
      this.currentUserType = 'suv';
    }

    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  getUserType() {
    return this.currentUserType;
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }
}
