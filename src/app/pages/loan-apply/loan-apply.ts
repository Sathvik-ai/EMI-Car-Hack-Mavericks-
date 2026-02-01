import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../core/services/loan';
import { AuthService } from '../../core/services/auth';
import { trigger, transition, style, animate } from '@angular/animations';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoanApplicationDto, EmiCalculationDto, EligibilityCheckDto } from '../../core/models/loan.model';

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
  isLoading = false;

  calculatedEMI: number = 0;
  currentInterestRate: number = 0;

  eligibilityResult: EligibilityCheckDto | null = null;
  approvalData: any = null;

  ruleMessage: string = '';
  ruleClass: string = '';

  // Dropdown Labels
  carTypes: string[] = [
    'Hatchback', 'Sedan', 'SUV',
    'Luxury', 'Electric', 'Commercial'
  ];

  // FIX: Mapping Strings to C# Enum Integers
  // (IMPORTANT: Ensure these numbers match your C# 'CarType' Enum file exactly!)
  carTypeMap: { [key: string]: number } = {
    'Hatchback': 0,
    'Sedan': 1,
    'SUV': 2,
    'Luxury': 3, // Assuming Luxury is 3. If "Sports" is 3, change this!
    'Electric': 4,
    'Commercial': 5
  };

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      carType: ['Hatchback', Validators.required],
      carPrice: [1000000, [Validators.required, Validators.min(100000), Validators.max(100000000)]],
      monthlyIncome: [50000, [Validators.required, Validators.min(10000), Validators.max(10000000)]],
      employmentType: ['Salaried', Validators.required],
      creditScore: [750, [Validators.required, Validators.min(300), Validators.max(900)]],
      downPaymentPercent: [20, [Validators.required, Validators.min(10), Validators.max(90)]],
      tenure: [5, [Validators.required, Validators.min(1), Validators.max(15)]],
      userAge: [30, [Validators.required, Validators.min(18), Validators.max(100)]]
    });

    // 1. Fetch Rules (String is usually fine for GET URLs)
    this.loanForm.get('carType')?.valueChanges.subscribe(type => {
      this.fetchLoanRules(type);
    });

    // 2. Live EMI
    this.loanForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.calculateLiveEMI();
    });

    this.fetchLoanRules('Hatchback');
  }

  get f() { return this.loanForm.controls; }

  // --- API 1: Get Rules ---
  fetchLoanRules(carType: string) {
    // We try sending the String name in the URL. 
    // If this fails with 400, change it to: this.carTypeMap[carType]
    this.loanService.getLoanRules(carType).subscribe({
      next: (rules) => {
        if (rules) {
          this.currentInterestRate = rules.baseRate;
          this.ruleMessage = `ℹ️ Base Rate: ${rules.baseRate}% | ${rules.riskFactor}`;
          this.ruleClass = 'text-info';
          this.calculateLiveEMI();
        }
      },
      error: (err) => console.error('Failed to fetch rules', err)
    });
  }

  // --- API 2: Calculate EMI ---
  calculateLiveEMI() {
    if (this.loanForm.invalid || this.currentInterestRate === 0) return;

    const val = this.loanForm.value;
    const principalAmount = val.carPrice * (1 - (val.downPaymentPercent / 100));

    const emiDto: EmiCalculationDto = {
      principal: principalAmount,
      rate: this.currentInterestRate,
      tenure: val.tenure
    };

    this.loanService.calculateEmi(emiDto).subscribe({
      next: (emi) => this.calculatedEMI = emi,
      error: () => this.calculatedEMI = 0
    });
  }

  // --- SUBMIT ---
  onSubmit() {
    this.submitted = true;
    if (this.loanForm.invalid) return;

    this.isLoading = true;
    const currentUser = this.auth.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      alert("Session invalid. Please login again.");
      this.isLoading = false;
      return;
    }

    // FIX: Convert the String "Hatchback" to Integer 0 using our Map
    const selectedTypeStr = this.loanForm.get('carType')?.value;
    const carTypeEnumInt = this.carTypeMap[selectedTypeStr];

    const appData: LoanApplicationDto = {
      userId: currentUser.id,
      // @ts-ignore - We are forcing it to be a number for the backend
      carType: carTypeEnumInt,
      carPrice: this.loanForm.get('carPrice')?.value,
      monthlyIncome: this.loanForm.get('monthlyIncome')?.value,
      employmentType: this.loanForm.get('employmentType')?.value,
      creditScore: this.loanForm.get('creditScore')?.value,
      downPaymentPercent: this.loanForm.get('downPaymentPercent')?.value,
      tenure: this.loanForm.get('tenure')?.value,
      userAge: this.loanForm.get('userAge')?.value
    };

    // --- API 3: Check Eligibility ---
    this.loanService.checkEligibility(appData).subscribe({
      next: (result) => {
        if (result.eligible) {
          this.eligibilityResult = result;
          this.finalApply(appData);
        } else {
          this.isLoading = false;
          this.eligibilityResult = result;
          this.approvalData = { status: 'Rejected', reason: result.reason };
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Eligibility Error:", err);
        // Show detailed error if available
        const msg = err.error?.errors?.['$.carType']
          ? "Invalid Car Type sent to server."
          : (err.error?.message || "Eligibility Check Failed");
        alert(msg);
      }
    });
  }

  // --- API 4: Final Apply ---
  finalApply(data: LoanApplicationDto) {
    this.loanService.applyForLoan(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.approvalData = {
            status: 'Approved',
            details: res.data
          };
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.approvalData = {
          status: 'Rejected',
          reason: err.error?.message || 'Application Failed'
        };
      }
    });
  }
}