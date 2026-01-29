import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  kycForm!: FormGroup;
  submitted = false;
  currentStep = 1; // 1: Personal, 2: Address, 3: Docs
  progress = 33;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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

  saveProfile() {
    this.submitted = true;
    if (this.kycForm.invalid) return;
    alert('KYC Documents Uploaded & Profile Updated!');
  }
}
