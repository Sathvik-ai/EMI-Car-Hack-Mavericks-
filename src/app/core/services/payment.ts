import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor() { }

  processPayment(amount: number, method: string): Observable<{ success: boolean; txnId?: string }> {
    // Simulate API delay
    return of({
      success: true,
      txnId: 'TXN' + Math.floor(Math.random() * 1000000)
    }).pipe(delay(2000));
  }
}

