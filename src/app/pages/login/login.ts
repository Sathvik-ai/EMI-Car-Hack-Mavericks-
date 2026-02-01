import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// FIX 1: Import 'AuthService' instead of 'Auth'
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // FIX 2: Inject 'AuthService'
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    // Create the login payload (matching your C# DTO)
    const loginData = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    // FIX 3: Real API Call with Subscribe
    this.auth.login(loginData).subscribe({
      next: (response) => {
        // Success!
        this.isLoading = false;
        // Navigation is handled inside the AuthService, so we just stop the spinner
        console.log('Login successful');
      },
      error: (error) => {
        // Error!
        this.isLoading = false;
        console.error('Login error:', error);
        alert('Login failed! Please check your email and password.');
      }
    });
  }
}