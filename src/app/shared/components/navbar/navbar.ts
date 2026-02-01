import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  userName: string = 'Profile';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn$;

    // Subscribe to changes or just check periodically/single time
    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        const user = this.auth.getCurrentUser();
        this.userName = user && user.name ? user.name.split(' ')[0] : 'Profile';
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
