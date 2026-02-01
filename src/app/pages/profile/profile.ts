import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { KycService } from '../../core/services/kyc';
import { forkJoin } from 'rxjs';

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
  currentStep = 1;
  progress = 33;

  userProfile: any = { id: 0, name: '', email: '', mobile: '' };

  // Status State
  isKycVerified = false;
  kycStatusLabel = 'Pending';

  // FIX 1: Defined 'kycDetails' so HTML doesn't crash
  kycDetails: any = null;

  // Files
  aadharFile: File | null = null;
  licenseFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private kycService: KycService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.userProfile = {
        id: user.id || Number(user.userId),
        name: user.fullName || user.name,
        email: user.email,
        mobile: user.mobile
      };

      this.loadKycData();
    }

    this.kycForm = this.fb.group({
      dob: ['', Validators.required],
      pan: ['', [Validators.required]],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      licenseNumber: ['', Validators.required]
    });
  }

  loadKycData() {
    if (!this.userProfile.id) return;

    // Load Local Text Details
    const savedDetails = localStorage.getItem(`kyc_details_${this.userProfile.id}`);
    if (savedDetails) {
      this.kycDetails = JSON.parse(savedDetails);
    }

    // Check Backend Status
    this.kycService.getKycStatus(this.userProfile.id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('KYC Status Response:', res.data); // Debug Log

          // FIX 2: Handle Enum Numbers from C# (0=Pending, 1=Submitted, 2=Verified/Approved)
          const status = res.data?.status;

          if (status === 'Approved' || status === 'Verified' || status === 2) {
            this.kycStatusLabel = 'Verified';
            this.isKycVerified = true;
          }
          else if (status === 'Submitted' || status === 1) {
            this.kycStatusLabel = 'Submitted';
            this.isKycVerified = true; // Show read-only view if submitted
          }
          else {
            this.kycStatusLabel = 'Pending';
            this.isKycVerified = false;
          }
        }
      },
      error: () => console.log("KYC Check failed")
    });
  }

  // --- Navigation & Upload Logic (Same as before) ---
  nextStep() {
    if (this.currentStep === 1 && (this.kycForm.get('dob')?.invalid || this.kycForm.get('pan')?.invalid)) {
      alert("Please enter valid Personal Details"); return;
    }
    if (this.currentStep === 2 && this.kycForm.get('addressLine1')?.invalid) {
      alert("Please enter valid Address"); return;
    }
    this.currentStep++;
    this.updateProgress();
  }

  prevStep() { this.currentStep--; this.updateProgress(); }
  updateProgress() { this.progress = (this.currentStep / 3) * 100; }

  onFileSelected(event: any, type: string) {
    const file = event.target.files[0];
    if (file) type === 'aadhar' ? this.aadharFile = file : this.licenseFile = file;
  }

  saveProfile() {
    this.submitted = true;

    if (this.currentStep === 3 && (!this.aadharFile || !this.licenseFile)) {
      alert("Please upload both documents.");
      return;
    }

    this.isLoading = true;

    const aadharData = new FormData();
    aadharData.append('UserId', this.userProfile.id.toString());
    aadharData.append('DocumentType', 'Aadhar');
    aadharData.append('DocumentNumber', this.kycForm.get('pan')?.value);
    aadharData.append('File', this.aadharFile!);

    const licenseData = new FormData();
    licenseData.append('UserId', this.userProfile.id.toString());
    licenseData.append('DocumentType', 'DrivingLicense');
    licenseData.append('DocumentNumber', this.kycForm.get('licenseNumber')?.value);
    licenseData.append('File', this.licenseFile!);

    forkJoin([
      this.kycService.uploadDocument(aadharData),
      this.kycService.uploadDocument(licenseData)
    ]).subscribe({
      next: (results) => {
        this.isLoading = false;

        this.kycDetails = this.kycForm.value;
        localStorage.setItem(`kyc_details_${this.userProfile.id}`, JSON.stringify(this.kycDetails));

        this.isKycVerified = true;
        this.kycStatusLabel = 'Submitted';

        alert('KYC Submitted Successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Upload Failed. Please try again.');
      }
    });
  }
}