import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Loan, CarType } from '../models/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  constructor() { }

  getLoanRules(carType: CarType): { baseRate: number; minDownPaymentPct: number; riskFactor: string; discount?: string } {
    let rules = {
      baseRate: 9.5, // Standard base rate
      minDownPaymentPct: 10,
      riskFactor: 'Low',
      discount: ''
    };

    switch (carType) {
      case 'Hatchback':
        rules.baseRate = 9.0; // Lower rate
        rules.riskFactor = 'Low - Best for First Time Buyers';
        break;
      
      case 'Electric Vehicle':
      case 'Hybrid':
        rules.baseRate = 8.5; // Green Discount
        rules.discount = 'Green Loan (1% Off applied)';
        break;

      case 'Mid-Size SUV':
      case 'Full-Size SUV':
      case 'Luxury Sedan':
      case 'Luxury SUV':
      case 'Convertible':
        rules.minDownPaymentPct = 20; // Higher down payment
        rules.riskFactor = 'Moderate - Higher Down Payment Required';
        break;

      case 'Used Car':
        rules.baseRate = 11.5; // Higher risk
        rules.riskFactor = 'High - Short Tenure Recommended';
        break;

      case 'Commercial':
        rules.baseRate = 12.0;
        rules.minDownPaymentPct = 25;
        break;
    }

    return rules;
  }

  calculateEMI(principal: number, rate: number, tenureYears: number): number {
    const monthlyRate = rate / 12 / 100;
    const months = tenureYears * 12;
    if (monthlyRate === 0) return principal / months;
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  }

  checkEligibility(income: number, creditScore: number, paramEMI: number): { eligible: boolean; reason?: string } {
    if (creditScore < 650) {
      return { eligible: false, reason: 'Credit Score too low. Minimum 650 required.' };
    }
    
    // Max EMI should not exceed 40% of income
    const maxEMI = income * 0.40;
    if (paramEMI > maxEMI) {
      return { eligible: false, reason: `EMI (₹${paramEMI}) exceeds 40% of monthly income.` };
    }

    return { eligible: true };
  }

  applyForLoan(loanDetails: any): Observable<Loan> {
    // Mock API response
    const emi = this.calculateEMI(loanDetails.loanAmount, loanDetails.interestRate, loanDetails.tenure);
    const loan: Loan = {
      loanId: Math.floor(Math.random() * 10000),
      carPrice: loanDetails.carPrice,
      loanAmount: loanDetails.loanAmount,
      interestRate: loanDetails.interestRate,
      tenure: loanDetails.tenure,
      emiAmount: emi,
      status: 'Approved',
      remainingEmis: loanDetails.tenure * 12,
      nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    };
    return of(loan); // Simulate async
  }
}
