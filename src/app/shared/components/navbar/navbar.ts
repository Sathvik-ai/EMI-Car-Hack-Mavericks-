import { Component, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  logout() {
    this.auth.logout();
  }
}
