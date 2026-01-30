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
  
  // Store full user object
  currentUser: any = {
    name: 'Guest User',
    email: '',
    mobile: ''
  };

  constructor(private router: Router) {
    if (typeof localStorage !== 'undefined') {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.loggedIn.next(true);
        }
    }
  }

  register(userData: any) {
    this.currentUser = userData;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    this.loggedIn.next(true);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  login(email: string) {
    // Determine car type based on email for mock purposes
    if (email === 'admin@luxe.com') {
      this.currentUserType = 'admin';
      this.loggedIn.next(true);
      this.router.navigate(['/admin']);
      return;
    }

    // Try to load user from local storage if email matches, else mock
    if (this.currentUser.email !== email) {
         this.currentUser = {
             name: 'Registered User', 
             email: email, 
             mobile: '+91 9876543210'
         };
    }

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
