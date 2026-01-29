import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-emi-calculator',
  standalone: false,
  templateUrl: './emi-calculator.html',
  styleUrl: './emi-calculator.css'
})
export class EmiCalculator implements OnInit {
  @Input() loanAmount: number = 1000000;
  @Input() interestRate: number = 9.5;
  @Input() tenure: number = 5;

  emi: number = 0;
  totalInterest: number = 0;
  totalPayment: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.calculate();
  }

  calculate() {
    const monthlyRate = this.interestRate / 12 / 100;
    const months = this.tenure * 12;

    if (monthlyRate === 0) {
      this.emi = this.loanAmount / months;
    } else {
      this.emi = (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    this.totalPayment = this.emi * months;
    this.totalInterest = this.totalPayment - this.loanAmount;
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }
}
