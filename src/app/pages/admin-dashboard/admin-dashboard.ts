import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin';
import { AdminLoanDto, AdminUserDto, KycDocumentDto } from '../../core/models/admin.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboard implements OnInit {
  activeTab: string = 'dashboard';
  isLoading = false;

  // Data Containers
  stats: any = { totalLoansDisbursed: 0, totalActiveUsers: 0, pendingApprovals: 0, npaPercentage: 0 };
  recentLoans: AdminLoanDto[] = [];
  allLoans: AdminLoanDto[] = [];
  users: AdminUserDto[] = [];

  // KYC Modal Data
  selectedUserDocs: KycDocumentDto[] = [];
  selectedUserName: string = '';
  showKycModal = false;

  // Analytics Data (Mapped from Backend)
  analyticsData: any = { monthlyRevenue: [], carTypeDistribution: [] };

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Reload specific data when tab changes to ensure freshness
    if (tab === 'loans') this.loadAllLoans();
    if (tab === 'users') this.loadAllUsers();
  }

  // --- DATA LOADING ---
  loadDashboardData() {
    this.isLoading = true;

    forkJoin({
      stats: this.adminService.getDashboardStats(),
      pending: this.adminService.getPendingLoans(),
      revenue: this.adminService.getMonthlyRevenue(),
      distribution: this.adminService.getCarTypeDistribution()
    }).subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.recentLoans = res.pending.slice(0, 5); // Show top 5 pending
        this.mapAnalytics(res.revenue, res.distribution);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard Load Failed', err);
        this.isLoading = false;
      }
    });
  }

  loadAllLoans() {
    this.adminService.getAllLoans().subscribe(data => this.allLoans = data);
  }

  loadAllUsers() {
    this.adminService.getAllUsers().subscribe(data => this.users = data);
  }

  // --- LOAN ACTIONS ---
  approveLoan(id: number) {
    if (!confirm('Are you sure you want to approve this loan?')) return;

    this.adminService.approveLoan(id).subscribe({
      next: () => {
        alert('Loan Approved Successfully');
        this.loadDashboardData(); // Refresh
        this.loadAllLoans();
      },
      error: (err) => alert('Approval Failed: ' + err.error?.message)
    });
  }

  rejectLoan(id: number) {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    this.adminService.rejectLoan(id, reason).subscribe({
      next: () => {
        alert('Loan Rejected');
        this.loadDashboardData();
        this.loadAllLoans();
      },
      error: (err) => alert('Rejection Failed: ' + err.error?.message)
    });
  }

  // --- KYC VERIFICATION ACTIONS ---
  viewUserDocuments(user: AdminUserDto) {
    this.isLoading = true;
    this.selectedUserName = user.fullName;

    this.adminService.getUserDocuments(user.userId).subscribe({
      next: (docs) => {
        this.selectedUserDocs = docs;
        this.showKycModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        alert('Could not fetch documents.');
      }
    });
  }

  verifyDocument(docId: number) {
    this.adminService.verifyDocument(docId).subscribe({
      next: () => {
        // Update the local list to show Verified status immediately
        const doc = this.selectedUserDocs.find(d => d.documentId === docId);
        if (doc) doc.isVerified = true;
        alert('Document Verified Successfully');
      },
      error: (err) => alert('Verification failed: ' + err.error?.message)
    });
  }

  closeModal() {
    this.showKycModal = false;
    this.selectedUserDocs = [];
    this.loadAllUsers(); // Refresh user list to see updated KYC status
  }

  // --- HELPERS ---
  getRiskColor(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'low': return '#81c995';
      case 'medium': return '#fdd663';
      case 'high': return '#f28b82';
      default: return '#e8eaed';
    }
  }

  mapAnalytics(revenue: any[], distribution: any[]) {
    // Transform Backend Revenue Data to UI format
    // Assuming backend returns { month: 'Jan', revenue: 5000000 }
    this.analyticsData.monthlyRevenue = revenue.map(r => ({
      month: r.month,
      value: (r.revenue / 10000000).toFixed(2), // Convert to Crores
      height: Math.min((r.revenue / 10000000) * 10, 100) + '%', // Simple scaling logic
      breakdown: [] // Backend doesn't provide breakdown yet, keep empty
    }));

    // Transform Distribution Data
    const colors = ['#ff4081', '#7c4dff', '#ffd740', '#00e676', '#536dfe'];
    let total = distribution.reduce((sum, item) => sum + item.count, 0);

    this.analyticsData.carTypeDistribution = distribution.map((item, index) => ({
      type: item.carType,
      count: item.count,
      width: ((item.count / total) * 100) + '%',
      color: colors[index % colors.length]
    }));
  }

  getSegmentColor(type: string) { return '#ccc'; } // Fallback for breakdown

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}