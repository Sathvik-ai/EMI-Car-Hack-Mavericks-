import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth'; // Import Auth

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
    private auth: Auth // Inject Auth
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
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

    // Save user details
    const userData = {
      name: this.f['fullName'].value,
      email: this.f['email'].value,
      mobile: this.f['mobile'].value
    };
    
    this.auth.register(userData);

    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/profile']); // Go to KYC after signup
    }, 1500);
  }
}
