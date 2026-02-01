import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      // Matches the new HTML controls
      monthlyIncome: ['', [Validators.required, Validators.min(10000)]],
      employmentType: ['Salaried', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) return;

    this.isLoading = true;

    // 1. Simulate Credit Score (Random 650 - 900)
    // In a real app, this comes from a backend background check, not the frontend!
    const simulatedCreditScore = Math.floor(Math.random() * (900 - 650 + 1)) + 650;

    // 2. Prepare Data with PascalCase keys (CRITICAL for C# Backend)
    const registerData = {
      FullName: this.f['fullName'].value,
      Email: this.f['email'].value,
      Mobile: this.f['mobile'].value,
      Password: this.f['password'].value,
      MonthlyIncome: this.f['monthlyIncome'].value,
      EmploymentType: this.f['employmentType'].value,
      CreditScore: simulatedCreditScore
    };

    // 3. Send to API
    this.auth.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(`Registration Successful! (Your Credit Score is: ${simulatedCreditScore})`);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        // Display the exact error from the server (e.g., "Email already exists")
        const serverMessage = error.error?.message || error.error?.title || 'Registration failed';
        alert('Error: ' + serverMessage);
      }
    });
  }
}