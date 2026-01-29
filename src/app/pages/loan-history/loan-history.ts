import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loan-history',
  standalone: false,
  templateUrl: './loan-history.html',
  styleUrl: './loan-history.css'
})
export class LoanHistory implements OnInit {
  transactions: any[] = [];
  filterYear = '2026';

  constructor() { }

  ngOnInit(): void {
    // Mock Data
    this.transactions = [
      { id: 'TXN1001', date: '2026-01-05', amount: 85000, type: 'EMI Payment', status: 'Completed', method: 'Auto-Debit' },
      { id: 'TXN0988', date: '2025-12-05', amount: 85000, type: 'EMI Payment', status: 'Completed', method: 'UPI' },
      { id: 'TXN0950', date: '2025-11-05', amount: 85000, type: 'EMI Payment', status: 'Completed', method: 'Net Banking' },
      { id: 'TXN0920', date: '2025-10-05', amount: 85000, type: 'EMI Payment', status: 'Completed', method: 'Auto-Debit' },
      { id: 'LOAN_DISB', date: '2025-09-20', amount: 4500000, type: 'Loan Disbursement', status: 'Credited', method: 'Bank Transfer' },
    ];
  }

  downloadStatement() {
    alert('Downloading Statement PDF...');
  }
}
