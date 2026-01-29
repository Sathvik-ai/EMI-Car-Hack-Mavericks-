export type CarType =
  | 'Hatchback'
  | 'Sedan'
  | 'Compact Sedan'
  | 'Compact SUV'
  | 'Mid-Size SUV'
  | 'Full-Size SUV'
  | 'MUV / MPV'
  | 'Electric Vehicle'
  | 'Hybrid'
  | 'Luxury Sedan'
  | 'Luxury SUV'
  | 'Coupe'
  | 'Convertible'
  | 'Commercial'
  | 'Used Car';

export interface Loan {
  loanId: number;
  carPrice: number; // ₹
  loanAmount: number; // ₹
  carType?: CarType; 
  interestRate: number;
  tenure: number;
  emiAmount: number; // ₹
  status: 'Approved' | 'Rejected' | 'Active' | 'Closed';
  remainingEmis?: number;
  nextDueDate?: Date;
  paidAmount?: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  kycStatus: 'Pending' | 'Verified';
  creditScore?: number;
  profileImage?: string;
}

export interface EmiPayment {
  paymentId: number;
  loanId: number;
  amount: number;
  date: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
  method?: 'UPI' | 'Debit Card' | 'Net Banking';
}
