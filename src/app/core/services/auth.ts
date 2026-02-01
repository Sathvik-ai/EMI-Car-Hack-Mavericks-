import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';

// Define the shape of the API response (Adjust based on your actual DTO)
export interface ApiResponse {
  success: boolean;
  message: string;
  data: any; // Contains token and user info
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // POINT THIS TO YOUR ACTUAL BACKEND PORT (e.g., https://localhost:7001/api/auth)
  private apiUrl = 'https://localhost:7041/api/Auth';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private currentUserType = 'suv'; // default fallback

  // Store full user object
  currentUser: any = null;

  constructor(private router: Router, private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        this.currentUser = JSON.parse(storedUser);
        this.loggedIn.next(true);
        this.updateUserType(this.currentUser.email); // Restore user type on reload
      }
    }
  }

  // --- REGISTER ---
  register(userData: any): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success) {
          // If your register API automatically logs them in, store data here.
          // Otherwise, usually, we just return success and ask them to login.
          console.log('Registration successful:', response.message);
        }
      })
    );
  }

  // --- LOGIN ---
  login(credentials: any): Observable<any> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          // 1. Store Data
          this.currentUser = response.data.user || credentials; // Fallback if backend doesn't send user obj
          const token = response.data.token; // Assuming backend sends 'token'

          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('token', token);
          }

          // 2. Determine User Type & Role
          this.updateUserType(this.currentUser.email);

          // 3. Update State
          this.loggedIn.next(true);

          // 4. Navigate based on Role
          if (this.currentUserType === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }

          return response;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      })
    );
  }

  // Helper to determine role/type (Kept your logic, updated Admin email)
  private updateUserType(email: string) {
    if (!email) return;

    // specific admin check
    if (email.toLowerCase() === 'admin@carloan.com') {
      this.currentUserType = 'admin';
      return;
    }

    // Keep your existing "Car Type" logic for normal users
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
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserType() {
    return this.currentUserType;
  }

  // --- LOGOUT ---
  logout() {
    // Optional: Call backend logout (good practice even if stateless)
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();

    // Clear Client Side Data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser = null;
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }

  // Helper to get the token for Interceptors
  getToken() {
    return localStorage.getItem('token');
  }
}