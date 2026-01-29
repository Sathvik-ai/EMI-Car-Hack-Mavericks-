import { Component } from '@angular/core';
import { PaymentService } from '../../core/services/payment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emi-payment',
  standalone: false,
  templateUrl: './emi-payment.html',
  styleUrl: './emi-payment.css',
})
export class EmiPayment {
  amount: number = 85000;
  selectedMethod: string = 'UPI';
  processing = false;

  constructor(private paymentService: PaymentService, private router: Router) {}

  payNow() {
    this.processing = true;
    this.paymentService.processPayment(this.amount, this.selectedMethod).subscribe(res => {
      this.processing = false;
      if (res.success) {
        alert('Payment Successful! Transaction ID: ' + res.txnId);
        this.router.navigate(['/dashboard']);
      }
    });
  }
}

