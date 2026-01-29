import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../core/services/loan';
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
  approvalData: any = null;
  
  // New props for rules
  activeRules: any = {};
  ruleMessage: string = '';
  ruleClass: string = '';

  carTypes: CarType[] = [
    'Hatchback', 'Sedan', 'Compact Sedan', 'Compact SUV', 
    'Mid-Size SUV', 'Full-Size SUV', 'MUV / MPV', 
    'Electric Vehicle', 'Hybrid', 'Luxury Sedan', 'Luxury SUV', 
    'Coupe', 'Convertible', 'Commercial', 'Used Car'
  ];

  constructor(private fb: FormBuilder, private loanService: LoanService) { }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      carType: ['Hatchback', Validators.required],
      carPrice: [1000000, [Validators.required, Validators.min(100000)]],
      monthlyIncome: [50000, [Validators.required, Validators.min(10000)]],
      employmentType: ['Salaried', Validators.required],
      creditScore: [750, [Validators.required, Validators.min(300), Validators.max(900)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(10), Validators.max(90)]],
      tenure: [5, [Validators.required, Validators.min(1), Validators.max(15)]]
    });

    this.loanForm.valueChanges.subscribe(() => {
      this.calculateValues();
    });
    
    this.calculateValues();
  }

  get f() { return this.loanForm.controls; }

  calculateValues() {
    if (this.loanForm.invalid) return;

    const val = this.loanForm.value;
    
    // Get Rules
    this.activeRules = this.loanService.getLoanRules(val.carType);
    this.updateRuleFeedback();

    // Check Down Payment Rule
    if (val.downPaymentPercent < this.activeRules.minDownPaymentPct) {
      this.eligibilityStatus = { eligible: false, reason: `${val.carType} requires minimum ${this.activeRules.minDownPaymentPct}% down payment.` };
      // Keep calculating EMI but show error
    }

    const loanAmount = val.carPrice - (val.carPrice * val.downPaymentPercent / 100);
    
    // Calculate Interest: Base Score Logic + Car Type Adjustment
    const scoreBaseRate = this.getInterestRate(val.creditScore);
    const finalRate = (scoreBaseRate - 9.5) + this.activeRules.baseRate; 
    // Logic: scoreBaseRate is the rate based on score (e.g. 9.5). 9.5 is standard ref. 
    // If score is high (8.5), delta is -1. 
    // Final = (-1) + TypeBase(9.0 for Hatch) = 8.0%.
    // Effectively we combine both factors.
    
    this.calculatedEMI = this.loanService.calculateEMI(loanAmount, finalRate, val.tenure);
    
    // Only update eligibility if not already failed by downpayment
    if (!this.eligibilityStatus || this.eligibilityStatus.eligible) {
      this.eligibilityStatus = this.loanService.checkEligibility(val.monthlyIncome, val.creditScore, this.calculatedEMI);
    }
  }

  updateRuleFeedback() {
    if (this.activeRules.discount) {
      this.ruleMessage = `💰 ${this.activeRules.discount}`;
      this.ruleClass = 'text-success';
    } else if (this.activeRules.riskFactor.includes('High')) {
      this.ruleMessage = `⚠️ ${this.activeRules.riskFactor}`;
      this.ruleClass = 'text-warning';
    } else if (this.activeRules.minDownPaymentPct > 10) {
      this.ruleMessage = `ℹ️ Min Down Payment: ${this.activeRules.minDownPaymentPct}%`;
      this.ruleClass = 'text-info';
    } else {
      this.ruleMessage = `✅ ${this.activeRules.riskFactor}`;
      this.ruleClass = 'text-muted';
    }
  }

  getInterestRate(score: number): number {
    if (score >= 800) return 8.5;
    if (score >= 750) return 9.5;
    if (score >= 650) return 11.5;
    return 15.0;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanForm.invalid) return;

    if (this.eligibilityStatus && !this.eligibilityStatus.eligible) {
      return;
    }

    const val = this.loanForm.value;
    const loanAmount = val.carPrice - (val.carPrice * val.downPaymentPercent / 100);
    const finalRate = (this.getInterestRate(val.creditScore) - 9.5) + this.activeRules.baseRate;

    const loanDetails = {
      carPrice: val.carPrice,
      loanAmount: loanAmount,
      interestRate: finalRate,
      tenure: val.tenure,
      carType: val.carType
    };

    // Simulate API call
    setTimeout(() => {
      this.loanService.applyForLoan(loanDetails).subscribe(res => {
        this.approvalData = res;
      });
    }, 1500);
  }
}

