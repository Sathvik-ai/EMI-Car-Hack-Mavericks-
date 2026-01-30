import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Profile } from './pages/profile/profile';
import { LoanApply } from './pages/loan-apply/loan-apply';
import { EmiDashboard } from './pages/emi-dashboard/emi-dashboard';
import { EmiPayment } from './pages/emi-payment/emi-payment';
import { LoanHistory } from './pages/loan-history/loan-history';
import { AboutUs } from './pages/about-us/about-us';
import { ContactUs } from './pages/contact-us/contact-us';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';
import { EmiCalculatorPage } from './pages/emi-calculator-page/emi-calculator-page';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'admin', component: AdminDashboard },
  { path: 'user-dashboard', component: UserDashboard },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'about', component: AboutUs },
  { path: 'contact', component: ContactUs },
  { path: 'profile', component: Profile },
  { path: 'apply-loan', component: LoanApply },
  { path: 'dashboard', component: EmiDashboard },
  { path: 'calculator', component: EmiCalculatorPage },
  { path: 'payment', component: EmiPayment },
  { path: 'history', component: LoanHistory },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
