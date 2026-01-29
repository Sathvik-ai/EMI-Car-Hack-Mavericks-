# Premium Car Loan Application

A luxury, frontend-only Angular application for Car Loan & EMI Management.

## key Features
- **Loan Application**: Real-time eligibility check and EMI calculation.
- **Dashboard**: Track active loans, health score, and history.
- **Premium UI**: Glassmorphism, Gold/Platinum accents, smooth animations.

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Application**:
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`.

## Architecture
- **Core**: Services and singleton models (`src/app/core`).
- **Shared**: Reusable components like Navbar, Cards (`src/app/shared`).
- **Pages**: Feature pages (`src/app/pages`).
- **Styles**: Global luxury theme variables in `src/styles.css`.

## Mock Data
The application uses `LoanService` to simulate backend API responses with RxJS Observables.
