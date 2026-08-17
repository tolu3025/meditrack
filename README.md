# MediTrack — Hospital Management System (HMS)

MediTrack is a production-ready, three-tier Hospital Management System (HMS) designed to streamline clinical workflows, patient portals, and inventory routing. It unifies Electronic Health Records (EHR), automated appointment scheduling with transactional conflict detection, real-time prescription-to-pharmacy routing, automated billing accumulation, and executive analytics across web portals and a native mobile client.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Flutter Patient Mobile App] -->|HTTPS REST| B(Node.js / Express.js Backend API)
    C[React.js Web Portals] -->|HTTPS REST| B
    B -->|Sequelize ORM| D[(Supabase / PostgreSQL Database)]
```

### 1. Presentation Layer (Client Interfaces)
* **HMS Web Portal**: A React.js + Vite administration console built with TailwindCSS, Recharts, and Context API. It supports four role-specific interfaces:
  * **Admin Console**: Executive revenue charts, user management, and department tracking.
  * **Doctor Desk**: Appointment consultation queues, clinical diagnoses logs, and prescription creation.
  * **Pharmacy Center**: Prescription dispensing queue and real-time drug stock controller.
  * **Patient Portal**: Profile ledger, billing history, and record access.
* **Patient Mobile App**: A native Flutter client implementing Behance Soft-UI aesthetics, featuring custom brand elements, a dark blue color palette (`#1D4ED8`), and instant offline-fallback mock purchases.

### 2. Application Layer (REST API Server)
* **Core Engine**: A Node.js and Express.js RESTful API handling:
  * **Authentication**: Secure JWT access token delivery and refresh token rotation with Bcrypt password hashing.
  * **Transactional Booking Lock**: Concurrency-safe appointment bookings using atomic PostgreSQL transactions to prevent double-booking.
  * **EHR Timeline Assembler**: Compiles doctor clinical entries, active prescriptions, and invoice status into unified patient records.
  * **Medication Inventory Routing**: Tracks stock quantities, flags reorder alerts, and processes dispenser logs.

### 3. Data Layer (Relational Storage)
* **Database**: Supported by PostgreSQL/Supabase and SQLite (for development). Managed via Sequelize ORM with cascading foreign key constraints and model-level validations.

---

## 🔑 Test User Credentials

Default password for all pre-seeded accounts is **`Password123!`**.

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Admin** | `toluwanimioyetade@gmail.com` <br> `admin@meditrack.ng` | `Password123!` | User Account Creator, Analytics, Department Config, Revenue |
| **Doctor** | `williamsbenjaminacc@gmail.com` <br> `dr.emeka@meditrack.ng` | `Password123!` | Consultation Queue, Clinical EHR Record Creator, Prescriptions |
| **Pharmacist** | `pharm.chioma@meditrack.ng` | `Password123!` | Prescription Dispenser Queue, Inventory Management |
| **Patient** | `patient1@gmail.com` | `Password123!` | Appointment Scheduling, EHR History, Bill Ledger, Drug Purchases |

---

## 📱 Subsystems Deep-Dive

### 1. Flutter Patient Mobile Application (`/patient_mobile`)
* **Branded Interface**: Standardized to Primary Royal Blue (`#1D4ED8`), Secondary Accent Yellow (`#FBBF24`), and Light Canvas Background (`#F7F8FA`). Uses the official `client/assets/icon.png` asset for all launcher icons.
* **Available Doctors Directory**:
  * Lists all registered doctors, specialties, and consultation fees.
  * Real-time search filters by name or department.
  * Inline quick-action shortcut to book an appointment with the selected doctor.
* **Available Pharmacy & Drug Purchases**:
  * Fetches drug listings via `/api/medications`. Displays category, generic name, unit price, and color-coded stock alerts (Green for in stock, Orange for low stock).
  * **Instant Purchase Flow**: Tapping a drug displays a dialog to select quantity, calculates total cost in real-time, displays a simulated "Dispensing medication..." loading overlay, deducts quantities from the inventory list, and issues a success receipt alert.
  * Displays current Pharmacist on duty details (**Pharm. Chioma Umeh, License: PCN-2021-9871**).
* **Appointments Planner**: Shows scheduled and historic appointments, featuring a dynamic booking bottom sheet with time-slot selections and reason logs.
* **Medical History Timeline**: Lists patient diagnoses, clinical notes, and prescription logs in a chronological timeline.
* **Billing Ledger**: Displays outstanding invoices and lets patients simulate instant card payments.

### 2. HMS Web Application (`/client`)
* **Admin Dashboard**: Renders interactive monthly revenue bar charts and department performance metrics using Recharts. Handles user onboarding (Doctors, Pharmacists, Admins) and active clinic department configurations.
* **Doctor Desk**: Allows clinical managers to view their schedule, diagnose patients, enter vitals, and append prescription medications from the hospital stock.
* **Pharmacy Desk**: Lists pending prescription orders waiting to be filled. Tapping "Dispense" automatically decrements stock levels, updates inventory lists, and marks prescription items as dispensed.

### 3. REST API Server (`/server`)
* **Atomic Bookings**: Prevents double-booking slots (e.g. same doctor, date, and time). Uses database-level locks (`Sequelize.transaction`) to reject concurrent collisions with `HTTP 409 Conflict`.
* **Token Rotation**: Uses HTTP-only cookies for refresh tokens and JWT payloads for request verification, keeping patient data secure.

---

## ⚡ Quick Start Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* [Flutter SDK](https://docs.flutter.dev/get-started/install) (v3.19+)
* Git

### 1. Backend Server Setup
Create a `server/.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=supersecretjwtkey987654321
JWT_REFRESH_SECRET=supersecretrefreshjwtkey123456789
DATABASE_URL=postgres://user:pass@localhost:5432/meditrack # Or your Supabase connection string
```

Install dependencies and run the seed script:
```bash
cd server
npm install
npm run seed     # Synchronizes schema and populates all test users/data
npm start        # Starts the API server on http://localhost:5000
```

### 2. HMS Web Portal Setup
```bash
cd client
npm install
npm run dev      # Starts the Vite web application on http://localhost:5173
```

### 3. Patient Mobile App compilation
Configure the mobile application's base server URL in `patient_mobile/lib/api/api_service.dart`:
```dart
final String baseUrl = 'https://meditrack-i1p8.onrender.com/api'; // Or your local API server URL
```

Compile and build the debug Android package:
```bash
cd patient_mobile
flutter pub get
flutter build apk --debug
```
The installable APK will be generated at `build/app/outputs/flutter-apk/app-debug.apk`.

---

## 🧪 Testing

### Running API Integration Tests
Automated tests verify endpoints, role-based authorization, JWT security, and appointment conflict resolution:
```bash
cd server
npm test
```
