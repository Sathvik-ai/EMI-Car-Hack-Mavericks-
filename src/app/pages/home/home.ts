import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isLoggedIn$: Observable<boolean>;
  reviews = [
    {
      name: 'Rajesh Kumar',
      role: 'Business Owner',
      text: 'The loan approval was instant! I got my Tata Nexon financed within 24 hours. The dashboard is amazing.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=11'
    },
    {
      name: 'Priya Sharma',
      role: 'IT Professional',
      text: 'Best interest rates in the market. The EMI calculator helped me plan my finances for my new Swift.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: 'Amit Verma',
      role: 'Architect',
      text: 'Completely paperless process for my Hyundai Creta loan. transparency and no hidden charges.',
      rating: 4,
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  cars = [
    { model: 'Tata Nexon', price: '₹ 8.15 Lakhs', image: 'https://media.zigcdn.com/media/model/2025/Mar/bumper-1763966057_600x400.jpg' }, 
    { model: 'Hyundai Creta', price: '₹ 10.99 Lakhs', image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Hyundai/Creta/7695/1651645683867/front-left-side-47.jpg?imwidth=420&impolicy=resize' },
    { model: 'Maruti Grand Vitara', price: '₹ 10.80 Lakhs', image: 'https://images.timesdrive.in/photo/msid-152865255,thumbsize-447459/152865255.jpg' }
  ];

  constructor(private auth: Auth, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  handleAction(route: string) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }
}
