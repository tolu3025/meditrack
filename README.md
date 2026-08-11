# MediTrack — Hospital Management System (HMS)

MediTrack is a production-ready Hospital Management System designed for Nigerian hospitals. It unifies Electronic Health Records (EHR), automated appointment scheduling with transactional conflict detection, real-time prescription-to-pharmacy routing, automated billing accumulation, and executive analytics across web portals and mobile clients.

---

## 🏗️ System Architecture (Three-Tier)

1. **Presentation Layer**:
   - **React.js Web App**: 4 portals (Patient, Doctor, Pharmacist, Admin) built with Vite, Recharts, Lucide Icons, and Context API.
   - **React Native Mobile App**: Android & iOS app sharing backend REST API endpoints.
2. **Application Layer**:
   - **Node.js + Express.js API**: Auth Module (JWT + Bcrypt), Patient CRUD, Appointment Conflict Detector (`Sequelize.transaction`), EHR Module, Prescription Auto-Router, Inventory Stock Auto-Deductor, Billing Accumulator, and Admin Analytics.
3. **Data Layer**:
   - **MySQL / SQLite Database**: 11 Relational Tables with foreign key integrity and Sequelize ORM model validations.

---

## ⚡ Quick Start Instructions

### 1. Backend Server Setup & Database Seeding

```bash
cd server
npm install
npm run seed     # Initializes DB tables & seeds sample Nigerian hospital data
npm start        # Launches Express API on http://localhost:5000
```

### 2. React Web Portals Setup

```bash
cd client
npm install
npm run dev      # Launches Vite Web App on http://localhost:5173
```

### 3. React Native Mobile App Setup

```bash
cd mobile
npm install
npm start        # Launches Expo / React Native bundler
```

---

## 🔑 Test User Credentials

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@meditrack.ng` | `Password123!` | Executive Analytics, User Account Management, Revenue Charts |
| **Doctor** | `dr.emeka@meditrack.ng` | `Password123!` | Consultation Queue, Clinical EHR Record Creator, Issue Prescriptions |
| **Pharmacist** | `pharm.chioma@meditrack.ng` | `Password123!` | Real-time Pending Prescription Queue, Dispense & Auto-Stock Deduct |
| **Patient** | `patient1@gmail.com` | `Password123!` | Book Appointment (Slot Lock), EHR History Timeline, Pay Hospital Bills |

---

## 🧪 Running Automated Integration Tests

```bash
cd server
npm test
```

Tests performed automatically:
- `GET /health` endpoint check (returns status 200 OK)
- JWT Authentication & Refresh Token rotation
- Role-Based Access Control (100% rejection of unauthorized role attempts with HTTP 403)
- **Transactional Appointment Conflict Detection**: Verifies under concurrent load that exactly 1 booking succeeds (201 Created) and concurrent collisions receive HTTP 409 Conflict with `"Time slot unavailable. Doctor already has an appointment at this time."`
