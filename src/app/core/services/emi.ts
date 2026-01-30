import { Injectable } from '@angular/core';

export interface EmiInput {
  carPrice: number;
  downPayment: number; // in Rupees
  monthlyIncome: number;
  employmentType: 'Salaried' | 'Self-Employed';
  creditScore: number;
  carType: 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'EV' | 'Used';
  interestRate: number; // Annual %
  tenureYears: number;
  userAge: number;
  kycStatus: boolean;
}

export interface EmiResult {
  status: 'Approved' | 'Rejected';
  reason?: string;
  details?: {
    loanAmount: number;
    interestRate: number;
    tenureMonths: number;
    monthlyEMI: number;
    totalInterest: number;
    totalPayable: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EmiService {

  calculateLoan(input: EmiInput): EmiResult {
    // 1. Hard Block Conditions
    if (!input.kycStatus) return this.reject('KYC not verified.');
    if (input.userAge < 18) return this.reject('User must be at least 18 years old.');
    if (input.creditScore < 650) return this.reject('Credit score below 650 is not eligible.');
    if (input.monthlyIncome <= 0) return this.reject('Invalid monthly income.');

    // Loan Amount Calculation
    const loanAmount = input.carPrice - input.downPayment;
    if (loanAmount <= 0) return this.reject('Loan amount must be greater than zero.');

    // Down Payment Check (Min 10%)
    const minDownPayment = input.carPrice * 0.10;
    if (input.downPayment < minDownPayment) {
      return this.reject(`Down payment must be at least 10% of car price (₹${minDownPayment.toLocaleString('en-IN')}).`);
    }

    if (input.tenureYears < 1 || input.tenureYears > 7) return this.reject('Tenure must be between 1 and 7 years.');

    // 2. Employment Based Rules
    if (input.employmentType === 'Salaried' && input.monthlyIncome < 25000) {
      return this.reject('Minimum monthly income for Salaried employees is ₹25,000.');
    }
    if (input.employmentType === 'Self-Employed' && input.monthlyIncome < 40000) {
      return this.reject('Minimum monthly income for Self-Employed individuals is ₹40,000.');
    }

    // Adjust Interest for Self-Employed
    let finalInterestRate = input.interestRate;
    if (input.employmentType === 'Self-Employed') {
      finalInterestRate += 0.5;
    }

    // 3. Car Type Based Rules
    const loanToValueRatio = (loanAmount / input.carPrice) * 100;

    switch (input.carType) {
      case 'Hatchback':
        if (loanToValueRatio > 90) return this.reject('Max loan for Hatchback is 90% of car price.');
        if (finalInterestRate < 8.5 || finalInterestRate > 10.5) return this.reject('Hatchback interest rate must be between 8.5% and 10.5%.');
        break;

      case 'Sedan': // Covers Compact SUV logic
        if (loanToValueRatio > 85) return this.reject('Max loan for Sedan/Compact SUV is 85% of car price.');
        if (finalInterestRate < 9 || finalInterestRate > 11.5) return this.reject('Sedan interest rate must be between 9% and 11.5%.');
        break;

      case 'SUV': // Mid / Full SUV
        if (loanToValueRatio > 80) return this.reject('Max loan for SUV is 80% of car price.');
        if (finalInterestRate < 9.5 || finalInterestRate > 12) return this.reject('SUV interest rate must be between 9.5% and 12%.');
        break;

      case 'Luxury':
        if (loanToValueRatio > 70) return this.reject('Max loan for Luxury cars is 70% of car price.');
        // Explicit Down Payment check for Luxury (30%)
        if (input.downPayment < (input.carPrice * 0.30)) return this.reject('Luxury cars require minimum 30% down payment.');
        if (finalInterestRate < 10.5 || finalInterestRate > 13) return this.reject('Luxury car interest rate must be between 10.5% and 13%.');
        break;

      case 'EV':
        if (loanToValueRatio > 90) return this.reject('Max loan for EV is 90% of car price.');
        finalInterestRate -= 0.5; // Discount
        break;

      case 'Used':
        if (loanToValueRatio > 70) return this.reject('Max loan for Used cars is 70% of car price.');
        if (input.tenureYears > 5) return this.reject('Max tenure for Used cars is 5 years.');
        if (finalInterestRate < 11 || finalInterestRate > 14) return this.reject('Used car interest rate must be between 11% and 14%.');
        break;
    }

    // 4. EMI Calculation
    // Formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    const P = loanAmount;
    const annualRate = finalInterestRate;
    const R = annualRate / (12 * 100);
    const N = input.tenureYears * 12;

    let emi = 0;
    if (annualRate === 0) {
        emi = P / N; // Edge case
    } else {
        emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    }

    emi = Math.round(emi);

    // 5. Affordability Rule (EMI <= 40% of Income)
    const maxAllowedEMI = input.monthlyIncome * 0.40;
    if (emi > maxAllowedEMI) {
        return this.reject(`EMI (₹${emi.toLocaleString('en-IN')}) exceeds 40% of monthly income limit (₹${maxAllowedEMI.toLocaleString('en-IN')}).`);
    }

    // 6. Final Data
    const totalPayable = emi * N;
    const totalInterest = totalPayable - P;

    return {
      status: 'Approved',
      details: {
        loanAmount: P,
        interestRate: finalInterestRate,
        tenureMonths: N,
        monthlyEMI: emi,
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable)
      }
    };
  }

  private reject(reason: string): EmiResult {
    return { status: 'Rejected', reason };
  }
}
