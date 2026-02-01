import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {
  userName: string = 'User';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    if (user && user.name) {
      this.userName = user.name;
    }
  }
}
