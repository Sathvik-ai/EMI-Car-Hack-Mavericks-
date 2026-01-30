import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmiService, EmiInput, EmiResult } from '../../core/services/emi';
import { trigger, transition, style, animate } from '@angular/animations';
import { CarType } from '../../core/models/loan.model';

@Component({
  selector: 'app-loan-apply',
  standalone: false,
  templateUrl: './loan-apply.html',
  styleUrl: './loan-apply.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoanApply implements OnInit {
  loanForm!: FormGroup;
  submitted = false;
  eligibilityStatus: { eligible: boolean; reason?: string } | null = null;
  calculatedEMI: number = 0;
  approvalData: EmiResult | null = null;
  
  // Rules Feedback
  ruleMessage: string = '';
  ruleClass: string = '';

  carTypes: string[] = [
    'Hatchback', 'Sedan', 'Compact SUV', 
    'Mid-Size SUV', 'Full-Size SUV', 
    'Electric Vehicle', 'Luxury Sedan', 'Luxury SUV', 
    'Coupe', 'Convertible', 'Used Car'
  ];

  constructor(private fb: FormBuilder, private emiService: EmiService) { }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      carType: ['Hatchback', Validators.required],
      carPrice: [1000000, [Validators.required, Validators.min(100000)]],
      monthlyIncome: [50000, [Validators.required, Validators.min(10000)]],
      employmentType: ['Salaried', Validators.required],
      creditScore: [750, [Validators.required, Validators.min(300), Validators.max(900)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(10), Validators.max(90)]],
      tenure: [5, [Validators.required, Validators.min(1), Validators.max(7)]],
      userAge: [30, [Validators.required, Validators.min(18)]] // Added Age
    });

    this.loanForm.valueChanges.subscribe(() => {
      this.calculateValues();
    });
    
    // Initial Calc
    setTimeout(() => this.calculateValues(), 100);
  }

  get f() { return this.loanForm.controls; }

  mapCarType(type: string): EmiInput['carType'] {
    if (type.includes('Hatchback')) return 'Hatchback';
    if (type.includes('Sedan') || type.includes('Compact SUV')) return 'Sedan';
    if (type.includes('SUV')) return 'SUV'; // Mid/Full
    if (type.includes('Electric')) return 'EV';
    if (type.includes('Luxury') || type.includes('Coupe') || type.includes('Convertible')) return 'Luxury';
    if (type.includes('Used')) return 'Used';
    return 'Hatchback'; // Default
  }

  // Helper to pick a valid rate for the simulation (Bank Logic)
  getStandardInterestRate(carType: string, score: number): number {
    let base = 10.0;
    // Credit Score Discount
    if (score >= 750) base -= 0.5;
    else if (score < 650) base += 2.0;

    // Car Type Adjustments (to stay within ranges defined in EmiService)
    const mappedType = this.mapCarType(carType);
    switch (mappedType) {
      case 'Hatchback': return Math.max(8.5, Math.min(10.5, base));
      case 'Sedan': return Math.max(9, Math.min(11.5, base + 0.5));
      case 'SUV': return Math.max(9.5, Math.min(12, base + 1.0));
      case 'Luxury': return Math.max(10.5, Math.min(13, base + 2.0));
      case 'EV': return 10.0; // Fixed base, service will discount it
      case 'Used': return Math.max(11, Math.min(14, base + 3.0));
      default: return 10.0;
    }
  }

  calculateValues() {
    if (this.loanForm.invalid) return;

    const val = this.loanForm.value;
    const downPaymentAmount = (val.carPrice * val.downPaymentPercent) / 100;
    
    const input: EmiInput = {
      carPrice: val.carPrice,
      downPayment: downPaymentAmount,
      monthlyIncome: val.monthlyIncome,
      employmentType: val.employmentType,
      creditScore: val.creditScore,
      carType: this.mapCarType(val.carType),
      interestRate: this.getStandardInterestRate(val.carType, val.creditScore),
      tenureYears: val.tenure,
      userAge: val.userAge,
      kycStatus: true // Assuming verified for now as form doesn't handle KYC upload
    };

    const result = this.emiService.calculateLoan(input);

    if (result.status === 'Approved' && result.details) {
      this.calculatedEMI = result.details.monthlyEMI;
      this.eligibilityStatus = { eligible: true };
      this.ruleMessage = `✅ Eligible! Est. Rate: ${result.details.interestRate}%`;
      this.ruleClass = 'text-success';
    } else {
      this.calculatedEMI = 0;
      this.eligibilityStatus = { eligible: false, reason: result.reason };
      this.ruleMessage = `❌ ${result.reason}`;
      this.ruleClass = 'text-danger';
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanForm.invalid) return;
    
    // Re-run strict calculation
    this.calculateValues();

    if (this.eligibilityStatus && !this.eligibilityStatus.eligible) {
      return; // Do not proceed if logic fails
    }

    // Prepare final object for logic processing
    const val = this.loanForm.value;
    const downPaymentAmount = (val.carPrice * val.downPaymentPercent) / 100;
     const input: EmiInput = {
      carPrice: val.carPrice,
      downPayment: downPaymentAmount,
      monthlyIncome: val.monthlyIncome,
      employmentType: val.employmentType,
      creditScore: val.creditScore,
      carType: this.mapCarType(val.carType),
      interestRate: this.getStandardInterestRate(val.carType, val.creditScore),
      tenureYears: val.tenure,
      userAge: val.userAge,
      kycStatus: true
    };

    // Simulate API delay
    setTimeout(() => {
       const finalResult = this.emiService.calculateLoan(input);
       this.approvalData = finalResult;
    }, 1500);
  }
}


