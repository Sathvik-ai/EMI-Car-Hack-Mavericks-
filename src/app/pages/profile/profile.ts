import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  kycForm!: FormGroup;
  submitted = false;
  isLoading = false;
  currentStep = 1; // 1: Personal, 2: Address, 3: Docs
  progress = 33;
  
  userProfile: any = {
    name: 'Guest',
    email: '',
    mobile: ''
  };

  isKycVerified = false;
  kycDetails: any = null;

  aadharFile: File | null = null;
  licenseFile: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
        this.userProfile = user;
        // Check for KYC persistence
        const kycData = localStorage.getItem('kyc_' + user.email);
        if (kycData) {
            this.isKycVerified = true;
            this.kycDetails = JSON.parse(kycData);
        }
    }

    this.kycForm = this.fb.group({
      dob: ['', Validators.required],
      pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      licenseNumber: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.kycForm.get('dob')?.invalid || this.kycForm.get('pan')?.invalid) {
        alert("Please enter valid Date of Birth and PAN (Format: ABCDE1234F)");
        return;
      }
    }
    
    if (this.currentStep === 2) {
      if (this.kycForm.get('addressLine1')?.invalid || this.kycForm.get('city')?.invalid || 
          this.kycForm.get('state')?.invalid || this.kycForm.get('zip')?.invalid) {
        alert("Please enter all Address details and valid 6-digit Pincode.");
        return;
      }
    }

    this.currentStep++;
    this.updateProgress();
  }

  prevStep() {
    this.currentStep--;
    this.updateProgress();
  }

  updateProgress() {
    this.progress = (this.currentStep / 3) * 100;
  }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      if (type === 'aadhar') {
        this.aadharFile = file;
      } else if (type === 'license') {
        this.licenseFile = file;
      }
    }
  }

  saveProfile() {
    this.submitted = true;
    
    if (this.currentStep === 3 && (!this.aadharFile || !this.licenseFile)) {
      alert("Please upload both Aadhar and Driving License documents.");
      return;
    }

    if (this.kycForm.invalid) {
      alert("Please fill all details correctly.");
      return;
    }

    this.isLoading = true;
    
    // Simulate API save
    setTimeout(() => {
        this.isLoading = false;
        // Save KYC Data to LocalStorage
        const kycData = {
           ...this.kycForm.value,
           aadhar: this.aadharFile ? this.aadharFile.name : 'aadhar.pdf',
           license: this.licenseFile ? this.licenseFile.name : 'license.pdf'
        };
        localStorage.setItem('kyc_' + this.userProfile.email, JSON.stringify(kycData));
        
        alert('KYC Verified Successfully!');
        this.router.navigate(['/user-dashboard']);
    }, 1500);
  }
}
