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
export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// Matches C# LoanApplicationDto
export interface LoanApplicationDto {
  userId: number;
  carType: string; // Backend Enum (sent as string)
  carPrice: number;
  monthlyIncome: number;
  employmentType: string;
  creditScore: number;
  downPaymentPercent: number;
  tenure: number;
  userAge: number;
}

// Matches C# EmiCalculationDto
export interface EmiCalculationDto {
  principal: number; // Note: This is NOT CarPrice. It is CarPrice - DownPayment
  rate: number;
  tenure: number;
}

// Matches C# LoanRuleDto
export interface LoanRuleDto {
  baseRate: number;
  minDownPaymentPct: number;
  riskFactor: string;
  discount: string;
}

// Matches C# EligibilityCheckDto
export interface EligibilityCheckDto {
  eligible: boolean;
  reason: string;
  estimatedEmi: number;
  interestRate: number;
}