export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: string[];
}

export interface AdminLoanDto {
    loanId: number;
    userId: number;
    applicantName: string;
    email: string;
    carType: string;
    loanAmount: number;
    applicationDate: string; // ISO String
    status: string; // Pending, Approved, Rejected
    creditScore: number;
    riskCategory: string; // Low, Medium, High
}

export interface AdminUserDto {
    userId: number;
    fullName: string;
    email: string;
    mobile: string;
    kycStatus: string; // Pending, Verified, Rejected
    registrationDate: string;
}

export interface DashboardStatsDto {
    totalLoansDisbursed: number;
    totalActiveUsers: number;
    pendingApprovals: number;
    npaPercentage: number;
}

export interface MonthlyRevenueDto {
    month: string;
    revenue: number;
}

export interface KycDocumentDto {
    documentId: number;
    documentType: string;
    documentNumber: string;
    filePath: string;
    isVerified: boolean;
}

export interface RejectionReasonDto {
    reason: string;
}