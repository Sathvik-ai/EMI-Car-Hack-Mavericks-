import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KycService {
  // Ensure port matches your running backend (e.g., 7041)
  private apiUrl = 'https://localhost:7041/api/Kyc';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // 1. Upload Single Document (Matches [HttpPost("upload")])
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: this.getHeaders() });
  }

  // 2. Get KYC Status (Matches [HttpGet("status/{userId}")])
  getKycStatus(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status/${userId}`, { headers: this.getHeaders() });
  }

  // 3. Get All Documents (Matches [HttpGet("user/{userId}")])
  getUserDocuments(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }
}