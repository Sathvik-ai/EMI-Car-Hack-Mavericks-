import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-emi-dashboard',
  standalone: false,
  templateUrl: './emi-dashboard.html',
  styleUrl: './emi-dashboard.css'
})
export class EmiDashboard implements OnInit {
  activeLoan: any;
  transactions: any[] = [];
  loanHealth: number = 85; 
  
  offers: any[] = [];

  // Data mapping for different car types
  private dashboardData: any = {
    suv: {
      activeLoan: {
        loanId: 10234,
        carModel: 'Hyundai Creta SX',
        loanAmount: 1200000,
        paidAmount: 350000,
        emiAmount: 18500,
        nextDueDate: new Date('2026-02-05'),
        remainingTenure: 38,
        progress: 35
      },
      offers: [
        {
          title: 'Upgrade to Alcazar',
          description: 'Exchange your Creta and drive home a new Alcazar at just 9.5% interest.',
          image: 'https://img.etimg.com/thumb/width-640,height-480,imgsize-109870,resizemode-75,msid-112709470/industry/auto/auto-news/hyundai-opens-booking-for-new-suv-alcazar-at-token-of-rs-25000-here-are-key-features-and-other-details/the-bold-new-hyundai-alcazar-booking-now-open-2.jpg'
        },
        {
          title: 'Zero Dep Insurance',
          description: 'Get 50% off on your next year comprehensive insurance renewal.',
          image: 'https://www.policybachat.com/ArticlesImages/1484.png'
        },
        {
          title: 'Off-Road Kit', // SUV specific
          description: 'Get 20% off on adventure accessories for your Creta.',
          image: 'https://i.ytimg.com/vi/LGlAzMU3CDs/maxresdefault.jpg'
        }
      ]
    },
    sedan: {
      activeLoan: {
        loanId: 20567,
        carModel: 'Honda City ZX',
        loanAmount: 1400000,
        paidAmount: 200000,
        emiAmount: 22000,
        nextDueDate: new Date('2026-02-10'),
        remainingTenure: 48,
        progress: 15
      },
      offers: [
        {
          title: 'Luxury Interior Pack',
          description: 'Upgrade to premium leather seat covers at 30% discount.',
          image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400'
        },
        {
          title: 'Zero Dep Insurance',
          description: 'Protect your sedan with our comprehensive plan.',
          image: 'https://www.policybachat.com/ArticlesImages/1484.png'
        },
        {
          title: 'City Upgrade',
          description: 'Exchange your City for the new Hybrid model.',
          image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400'
        }
      ]
    },
    hatchback: {
      activeLoan: {
        loanId: 30982,
        carModel: 'Maruti Swagger Swift',
        loanAmount: 750000,
        paidAmount: 500000,
        emiAmount: 12500,
        nextDueDate: new Date('2026-02-01'),
        remainingTenure: 24,
        progress: 65
      },
      offers: [
        {
          title: 'Sporty Body Kit',
          description: 'Add a spoiler and skirts to your Swift for just ₹15,000.',
          image: 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=400'
        },
        {
          title: 'Fuel Card',
          description: 'Save ₹2 on every litre with our partner fuel card.',
          image: 'https://images.unsplash.com/photo-1626125081273-5a04dd683e3c?auto=format&fit=crop&q=80&w=400'
        },
        {
          title: 'Upgrade to Baleno',
          description: 'Loyalty bonus of ₹20,000 on upgrading.',
          image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Baleno/10634/1709545455919/front-left-side-47.jpg'
        }
      ]
    },
    ev: {
      activeLoan: {
        loanId: 44001,
        carModel: 'Tata Nexon EV',
        loanAmount: 1600000,
        paidAmount: 400000,
        emiAmount: 24500,
        nextDueDate: new Date('2026-02-12'),
        remainingTenure: 54,
        progress: 25,
        tag: 'Green Loan Active 🌿'
      },
      offers: [
        {
          title: 'Home Charger Install',
          description: 'Free installation of fast charger at your home location.',
          image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400'
        },
        {
          title: 'Battery Warranty+',
          description: 'Extend your battery warranty for another 2 years.',
          image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=400'
        }
      ]
    },
    luxury: {
      activeLoan: {
        loanId: 99001,
        carModel: 'Mercedes-Benz C-Class',
        loanAmount: 6500000,
        paidAmount: 1500000,
        emiAmount: 110000,
        nextDueDate: new Date('2026-02-01'),
        remainingTenure: 48,
        progress: 23,
        tag: 'Premium Banking 💎'
      },
      offers: [
        {
          title: 'Chauffeur Service',
          description: 'Complimentary chauffeur for 3 days on your anniversary.',
          image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400'
        },
        {
          title: 'Club Membership',
          description: 'Exclusive access to our partner golf clubs.',
          image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=400'
        }
      ]
    },
    used: {
      activeLoan: {
        loanId: 11002,
        carModel: 'Honda Civic (2019)',
        loanAmount: 800000,
        paidAmount: 200000,
        emiAmount: 28000, 
        nextDueDate: new Date('2026-02-15'),
        remainingTenure: 24,
        progress: 25,
        tag: 'High Risk Profile ⚠️'
      },
      offers: [
        {
          title: 'Mechanical Warranty',
          description: 'Protect against unexpected engine repairs.',
          image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=400'
        }
      ]
    }
  };

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    const userType = this.auth.getUserType(); // 'suv', 'sedan', or 'hatchback'
    const data = this.dashboardData[userType] || this.dashboardData['suv']; // Fallback to SUV

    this.activeLoan = data.activeLoan;
    this.offers = data.offers;

    this.transactions = [
      { id: 1, date: '2026-01-05', amount: this.activeLoan.emiAmount, status: 'Paid', method: 'Auto-Debit' },
      { id: 2, date: '2025-12-05', amount: this.activeLoan.emiAmount, status: 'Paid', method: 'Auto-Debit' },
      { id: 3, date: '2025-11-05', amount: this.activeLoan.emiAmount, status: 'Paid', method: 'UPI' },
    ];
  }
}
