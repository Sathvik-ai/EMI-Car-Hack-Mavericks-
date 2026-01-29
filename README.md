# Luxe Wheels Financial 🚗💸

A next-generation car loan platform built with **Angular**, featuring a dynamic business rule engine, glassmorphism UI, and personalized dashboards for different customer profiles.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Key Features

### 1. 🧠 Intelligent Loan Engine
The application adapts credit rules based on the selected car category:
- **Hatchback**: Standard base rate (**8.5%**).
- **Sedan**: Optimized for middle-class tenure.
- **SUV**: Balanced implementation.
- **EV (Electric Vehicle)**: **Green Loan Discount** (-1% Interest Rate).
- **Luxury**: Requires higher down payment (**25%**) due to high asset value.
- **Used Car**: Assessed as **High Risk** (+5.5% Interest Rate).

### 2. 📊 Dynamic Dashboards
The **EMI Dashboard** adapts not just data, but context for the logged-in user:
- **EV Dashboard**: Highlights "Green Loan" status and savings.
- **Luxury Dashboard**: Tracks large-volume computations and high EMI values.
- **Used Car Dashboard**: Monitors high-interest payments and risk warnings.

### 3. 🎨 Modern UI/UX
- **Glassmorphism Design**: Frosted glass effects, gradients, and floating cards.
- **Animations**: Smooth `fadeInUp` transitions and route animations.
- **Interactive Forms**: Real-time validation and numeric formatting (Indian Currency Directives).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Application
```bash
ng serve
```
Navigate to `http://localhost:4200/`.

---

## 🔐 Support & Demo Credentials

The authentication system is simulated to allow testing of various customer personas. Use the following credentials (password is `admin` for all):

| User Persona | Email | Description |
| :--- | :--- | :--- |
| **Electric User** | `ev@luxe.com` | Sees **Tata Nexon EV** & Green Loan Discount |
| **Luxury User** | `luxury@luxe.com` | Sees **Mercedes C-Class** & High Value Loans |
| **Used Car User** | `used@luxe.com` | Sees **Honda Civic (2019)** & Risk Warnings |
| **Standard User** | `user@luxe.com` | Standard SUV profile (Hyundai Creta) |
| **Admin** | `admin@luxe.com` | General Access |

---

## 🛠️ Tech Stack using
- **Framework**: Angular 19+
- **Styling**: Pure CSS (Variables, Flexbox, Grid)
- **Forms**: Reactive Forms
- **Routing**: Angular Router
- **Animation**: Angular Animations (`@angular/animations`)

---

Generated with ❤️ by Luxe Wheels Dev Team.
