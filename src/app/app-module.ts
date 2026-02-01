import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { EmiCalculator } from './shared/components/emi-calculator/emi-calculator';
import { LoanHealthScore } from './shared/components/loan-health-score/loan-health-score';
import { PaymentCalendar } from './shared/components/payment-calendar/payment-calendar';
import { SmartAssistant } from './shared/components/smart-assistant/smart-assistant';
import { Loader } from './shared/components/loader/loader';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Profile } from './pages/profile/profile';
import { LoanApply } from './pages/loan-apply/loan-apply';
import { EmiDashboard } from './pages/emi-dashboard/emi-dashboard';
import { EmiPayment } from './pages/emi-payment/emi-payment';
import { LoanHistory } from './pages/loan-history/loan-history';
import { IndianCurrency } from './shared/directives/indian-currency';
import { AboutUs } from './pages/about-us/about-us';
import { ContactUs } from './pages/contact-us/contact-us';
// Note: UserDashboard & AdminDashboard are standalone and not imported here in declarations
import { EmiCalculatorPage } from './pages/emi-calculator-page/emi-calculator-page';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    EmiCalculator,
    LoanHealthScore,
    PaymentCalendar,
    SmartAssistant,
    Loader,
    Home,
    Login,
    Signup,
    Profile,
    LoanApply,
    EmiDashboard,
    EmiPayment,
    LoanHistory,
    IndianCurrency,
    AboutUs,
    ContactUs,
    EmiCalculatorPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App]
})
export class AppModule { }

