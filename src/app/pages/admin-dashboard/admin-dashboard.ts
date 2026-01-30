import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface AdminLoan {
  id: number;
  applicantName: string;
  email: string;
  carType: string;
  amount: number;
  date: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Active';
  creditScore: number;
  risk: 'Low' | 'Medium' | 'High';
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  kycStatus: 'Pending' | 'Verified';
  joinedDate: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboard implements OnInit {
  activeTab: string = 'dashboard';
  
  // Mock Data
  recentLoans: AdminLoan[] = [];
  allLoans: AdminLoan[] = [];
  users: AdminUser[] = [];

  // Analytics Data
  analyticsData = {
    monthlyRevenue: [
      { month: 'Jan', value: 45, height: '45%', breakdown: [ { type: 'suv', height: '40%' }, { type: 'sedan', height: '30%' }, { type: 'hatchback', height: '20%' }, { type: 'ev', height: '10%' } ] },
      { month: 'Feb', value: 52, height: '52%', breakdown: [ { type: 'suv', height: '35%' }, { type: 'sedan', height: '35%' }, { type: 'hatchback', height: '15%' }, { type: 'ev', height: '15%' } ] },
      { month: 'Mar', value: 48, height: '48%', breakdown: [ { type: 'suv', height: '45%' }, { type: 'sedan', height: '25%' }, { type: 'hatchback', height: '20%' }, { type: 'ev', height: '10%' } ] },
      { month: 'Apr', value: 70, height: '70%', breakdown: [ { type: 'suv', height: '30%' }, { type: 'sedan', height: '40%' }, { type: 'hatchback', height: '10%' }, { type: 'ev', height: '20%' } ] },
      { month: 'May', value: 65, height: '65%', breakdown: [ { type: 'suv', height: '25%' }, { type: 'sedan', height: '35%' }, { type: 'hatchback', height: '25%' }, { type: 'ev', height: '15%' } ] },
      { month: 'Jun', value: 85, height: '85%', breakdown: [ { type: 'suv', height: '50%' }, { type: 'sedan', height: '30%' }, { type: 'hatchback', height: '10%' }, { type: 'ev', height: '10%' } ] },
      { month: 'Jul', value: 92, height: '92%', breakdown: [ { type: 'suv', height: '40%' }, { type: 'sedan', height: '25%' }, { type: 'hatchback', height: '15%' }, { type: 'ev', height: '20%' } ] }
    ],
    carTypeDistribution: [
      { type: 'SUV', count: 450, width: '90%', color: '#ff4081' },       // Pink
      { type: 'Sedan', count: 320, width: '64%', color: '#7c4dff' },     // Purple
      { type: 'Hatchback', count: 210, width: '42%', color: '#ffd740' }, // Amber
      { type: 'EV', count: 180, width: '36%', color: '#00e676' }        // Green
    ]
  };
    
  getSegmentColor(type: string): string {
    switch(type) {
      case 'suv': return '#ff4081'; // Pink
      case 'sedan': return '#7c4dff'; // Purple
      case 'hatchback': return '#ffd740'; // Amber
      case 'ev': return '#00e676'; // Green
      default: return '#cccccc';
    }
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMockData();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    // Implement logout logic here
    this.router.navigate(['/login']);
  }

  get pendingLoansCount(): number {
    return this.allLoans.filter(l => l.status === 'Pending').length;
  }

  getRiskColor(risk: string): string {
    switch(risk) {
      case 'Low': return '#81c995'; // Pastel green
      case 'Medium': return '#fdd663'; // Pastel orange/yellow
      case 'High': return '#f28b82'; // Pastel red
      default: return '#e8eaed'; // Light grey
    }
  }

  approveLoan(id: number) {
    const loan = this.allLoans.find(l => l.id === id);
    if (loan) {
      loan.status = 'Approved';
      // Trigger animation or notification
      alert(`Loan #${id} has been approved.`);
    }
  }

  rejectLoan(id: number) {
    const loan = this.allLoans.find(l => l.id === id);
    if (loan) {
      loan.status = 'Rejected';
       alert(`Loan #${id} has been rejected.`);
    }
  }

  private loadMockData() {
    this.allLoans = [
      { id: 101, applicantName: 'Rahul Kumar', email: 'rahul@example.com', carType: 'Sedan', amount: 850000, date: new Date('2025-10-15'), status: 'Pending', creditScore: 750, risk: 'Low' },
      { id: 102, applicantName: 'Priya Singh', email: 'priya@example.com', carType: 'SUV', amount: 1500000, date: new Date('2025-10-14'), status: 'Approved', creditScore: 820, risk: 'Low' },
      { id: 103, applicantName: 'Amit Shah', email: 'amit@example.com', carType: 'Hatchback', amount: 500000, date: new Date('2025-10-12'), status: 'Rejected', creditScore: 600, risk: 'High' },
      { id: 104, applicantName: 'Sneha Gupta', email: 'sneha@example.com', carType: 'EV', amount: 1200000, date: new Date('2025-10-16'), status: 'Pending', creditScore: 680, risk: 'Medium' },
      { id: 105, applicantName: 'Vikram Malhotra', email: 'vikram@example.com', carType: 'Luxury Sedan', amount: 4500000, date: new Date('2025-10-10'), status: 'Active', creditScore: 790, risk: 'Low' },
    ];

    this.recentLoans = this.allLoans.slice(0, 3);

    this.users = [
      { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '9876543210', kycStatus: 'Verified', joinedDate: new Date('2025-01-10') },
      { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '8765432109', kycStatus: 'Verified', joinedDate: new Date('2025-02-15') },
      { id: 3, name: 'Amit Shah', email: 'amit@example.com', phone: '7654321098', kycStatus: 'Pending', joinedDate: new Date('2025-03-20') },
       { id: 4, name: 'Sneha Gupta', email: 'sneha@example.com', phone: '6543210987', kycStatus: 'Pending', joinedDate: new Date('2025-04-05') },
    ];
  }
}
