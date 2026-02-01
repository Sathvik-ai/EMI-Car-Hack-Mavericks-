import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpHeaders
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoanApplicationDto,
  EmiCalculationDto,
  LoanRuleDto,
  EligibilityCheckDto,
  ApiResponseDto
} from '../models/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  // Ensure this matches your running Swagger port
  private apiUrl = 'https://localhost:7041/api/Loan';

  constructor(private http: HttpClient) { }

  // --- HELPER: Create Headers with Token ---
  private getHeaders(): HttpHeaders {
    // Get the token directly from storage
    const token = localStorage.getItem('token');

    // Create headers with the Authorization Bearer token
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // 1. GET Rules
  getLoanRules(carType: string): Observable<LoanRuleDto> {
    // Pass { headers: this.getHeaders() }
    return this.http.get<ApiResponseDto<LoanRuleDto>>(`${this.apiUrl}/rules/${carType}`, { headers: this.getHeaders() }).pipe(
      map(res => res.data)
    );
  }

  // 2. POST Calculate EMI
  calculateEmi(data: EmiCalculationDto): Observable<number> {
    return this.http.post<ApiResponseDto<number>>(`${this.apiUrl}/calculate-emi`, data, { headers: this.getHeaders() }).pipe(
      map(res => res.data)
    );
  }

  // 3. POST Check Eligibility
  // 3. POST Check Eligibility (Updated to handle different response formats)
  checkEligibility(data: LoanApplicationDto): Observable<EligibilityCheckDto> {
    return this.http.post<any>(`${this.apiUrl}/check-eligibility`, data, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log("Raw Eligibility Response:", response); // Debug log

        // Case 1: The backend wrapped it in 'data' (ApiResponseDto)
        if (response && response.data) {
          return response.data;
        }

        // Case 2: The backend sent the object directly
        return response;
      })
    );
  }

  // 4. POST Apply
  applyForLoan(data: LoanApplicationDto): Observable<ApiResponseDto<any>> {
    return this.http.post<ApiResponseDto<any>>(`${this.apiUrl}/apply`, data, { headers: this.getHeaders() });
  }
}