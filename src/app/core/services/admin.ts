import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ApiResponse,
    AdminLoanDto,
    AdminUserDto,
    DashboardStatsDto,
    RejectionReasonDto,
    KycDocumentDto
} from '../models/admin.model';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'https://localhost:7041/api';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    // --- DASHBOARD & ANALYTICS ---
    getDashboardStats(): Observable<DashboardStatsDto> {
        return this.http.get<ApiResponse<DashboardStatsDto>>(`${this.baseUrl}/Admin/analytics/dashboard-stats`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    getMonthlyRevenue(): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/analytics/monthly-revenue`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    getCarTypeDistribution(): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/Admin/analytics/car-type-distribution`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    // --- LOAN MANAGEMENT ---
    getAllLoans(): Observable<AdminLoanDto[]> {
        return this.http.get<ApiResponse<AdminLoanDto[]>>(`${this.baseUrl}/Admin/loans`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    getPendingLoans(): Observable<AdminLoanDto[]> {
        return this.http.get<ApiResponse<AdminLoanDto[]>>(`${this.baseUrl}/Admin/loans/pending`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    approveLoan(loanId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/Admin/loans/${loanId}/approve`, {}, { headers: this.getHeaders() });
    }

    rejectLoan(loanId: number, reason: string): Observable<any> {
        const payload: RejectionReasonDto = { reason };
        return this.http.put(`${this.baseUrl}/Admin/loans/${loanId}/reject`, payload, { headers: this.getHeaders() });
    }

    // --- USER MANAGEMENT ---
    getAllUsers(): Observable<AdminUserDto[]> {
        return this.http.get<ApiResponse<AdminUserDto[]>>(`${this.baseUrl}/Admin/users`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    // --- KYC VERIFICATION (From KycController) ---
    getUserDocuments(userId: number): Observable<KycDocumentDto[]> {
        return this.http.get<ApiResponse<KycDocumentDto[]>>(`${this.baseUrl}/Kyc/user/${userId}`, { headers: this.getHeaders() })
            .pipe(map(res => res.data));
    }

    verifyDocument(documentId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/Kyc/${documentId}/verify`, {}, { headers: this.getHeaders() });
    }
}