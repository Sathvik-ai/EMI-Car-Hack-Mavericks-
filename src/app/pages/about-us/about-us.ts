import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styles: [`
    .about-hero {
      background: linear-gradient(135deg, #111 0%, #222 100%);
      padding: 100px 20px;
      text-align: center;
      color: white;
    }
    .value-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
      text-align: center;
      transition: transform 0.3s ease;
    }
    .value-card:hover {
      transform: translateY(-10px);
      border-color: var(--primary-gold);
    }
  `]
})
export class AboutUs {}
