# TEENSPEND — Teenager Expense Tracker & Smart Money Management Dashboard

> **TRACK → UNDERSTAND → ANALYZE → IMPROVE → SAVE**  
> A production-grade, full-stack financial management web application specifically architected for teenagers to master their pocket money, track expenses, visualize spending patterns, set category budgets, and build lifelong saving habits.

[![Live Backend](https://img.shields.io/badge/Render-Backend%20Live-brightgreen?logo=render)](https://teentracker-backend-qi30.onrender.com/api/health)
[![API Base](https://img.shields.io/badge/API-teentracker--backend--qi30.onrender.com-blue)](https://teentracker-backend-qi30.onrender.com/api)

- 🌐 **Live Deployed Backend API:** `https://teentracker-backend-qi30.onrender.com/api`
- 🩺 **Health Check Endpoint:** `https://teentracker-backend-qi30.onrender.com/api/health`

---

## 🌟 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & System Design](#-architecture--system-design)
5. [Directory Structure](#-directory-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [Database Schema & Supabase Setup](#-database-schema--supabase-setup)
9. [Running the Application](#-running-the-application)
10. [REST API Documentation](#-rest-api-documentation)
11. [Testing & Quality Assurance](#-testing--quality-assurance)
12. [Security Best Practices](#-security-best-practices)
13. [Deployment Instructions](#-deployment-instructions)

---

## 🚀 Project Overview

**TEENSPEND** solves the fundamental questions teenagers face every week:
- *"Where did my pocket money go?"*
- *"How much allowance and earnings do I have left?"*
- *"Am I staying within my planned food and gaming budget?"*
- *"How close am I to affording those new headphones?"*

Built with a modern **MVC architecture** on Node.js/Express, a reactive **TypeScript + React + Vite + Tailwind CSS** frontend, and **Supabase PostgreSQL** with Row Level Security, TEENSPEND combines financial management with an encouraging, teen-friendly UI.

---

## ✨ Key Features

### 1. 🔐 Secure Authentication & User Isolation
- Password hashing with **bcryptjs** (10 salt rounds)
- Stateless authentication using **JWT (JSON Web Tokens)** via `Authorization: Bearer <token>`
- Strict data isolation enforcing `WHERE user_id = req.user.id` on every query
- 1-click **Quick Demo Login** for effortless testing as *Alex Rivera (16)*

### 2. 🧾 Complete Expense Tracking
- Track: Amount, Category, Description, Date, Payment Method (UPI, Cash, Debit Card, Credit Card, Bank Transfer, Other), Merchant, and Notes
- Real-time search across descriptions and merchants
- Multi-dimensional filters (Category, Payment method, Date range, Min/Max amount)
- Sort by newest, oldest, highest amount, lowest amount
- Pagination support for fast performance
- **RFC 4180 compliant CSV Export** for offline spreadsheets

### 3. 🎯 Category Budgets with Visual Alerts
- Set monthly, weekly, or yearly budgets per category
- Color-coded progress bars:
  - 🟢 **0–60%**: On Track (Emerald)
  - 🟡 **60–80%**: Caution (Amber)
  - 🟠 **80–100%**: Warning / Near Limit (Orange)
  - 🔴 **>100%**: Over Budget (Rose)
- Explicit text percentages for accessible contrast

### 4. 💰 Savings Goals & Celebrations
- Create wishlist goals (e.g. *Wireless Headphones*, *Gaming Console*, *College Fund*)
- Progress bars and remaining balance calculations
- Interactive **"Deposit Money"** modal with quick amounts (`+₹100`, `+₹250`, `+₹500`, `+₹1000`)
- **Confetti burst animations** when a savings goal is achieved!

### 5. 💵 Income & Allowance Tracking
- Track monthly allowance, part-time jobs, gifts, tutoring, and freelance earnings
- Automated calculation: `Remaining Balance = Total Income - Total Expenses`
- Savings discipline rate calculation

### 6. 📊 6 Interactive Recharts Visualizations
- **Chart 1:** Monthly Spending Trend (Line Chart over 6 months)
- **Chart 2:** Category Spending Distribution (Donut Chart with custom tooltips and legend)
- **Chart 3:** Weekday Spending Breakdown (Bar Chart from Monday to Sunday)
- **Chart 4:** Budget vs Actual Spending (Comparison Bar Chart)
- **Chart 5:** Income vs Expenses (Inflows vs Outflows comparison)
- **Chart 6:** Month-over-Month Comparison Report (Difference and % change indicator)

### 7. 💡 Smart Teen Recommendation Engine & Health Score
- Analyzes actual spending data without judgment
- Suggests actionable habit adjustments (e.g. tracking small snack purchases, pacing category limits)
- Financial Health status badge (*"Great savings progress"*, *"You're on track"*, *"Watch your spending"*, *"Budget nearly reached"*)

### 8. 🌓 Dark / Light Mode
- Persistent theme toggle using Tailwind CSS `dark` class and `localStorage`
- High-contrast, sleek glassmorphism and modern Outfit typography

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, React Router 7, Axios, Recharts, Tailwind CSS, Lucide React, Canvas-Confetti |
| **Backend** | Node.js, Express.js (MVC Architecture), bcryptjs, JSON Web Tokens (jsonwebtoken), Helmet, CORS, Express-Rate-Limit, Express-Validator, Morgan |
| **Database** | Supabase PostgreSQL (with SQL migrations, RLS policies, indexes, and resilient local fallback store) |
| **Testing** | Jest, Supertest |

---

## 🏛 Architecture & System Design

```
                     ┌───────────────────────────────────┐
                     │          React + Vite             │
                     │       Frontend Application        │
                     │      (http://localhost:5173)      │
                     └─────────────────┬─────────────────┘
                                       │
                         REST API via Axios Interceptors
                         (Authorization: Bearer <token>)
                                       │
                                       ▼
                     ┌───────────────────────────────────┐
                     │         Node.js / Express         │
                     │          MVC REST Backend         │
                     │      (http://localhost:5000)      │
                     └─────────────────┬─────────────────┘
                                       │
                  ┌────────────────────┼───────────────────┐
                  ▼                    ▼                   ▼
           [Controllers]         [Middleware]        [Services]
        - AuthController       - Auth (JWT)        - Analytics
        - ExpenseController    - Rate Limiter      - Recommendation
        - BudgetController     - Validator         - FinancialCalc
        - SavingsController    - ErrorHandler
        - IncomeController
                  │
                  ▼
              [Models]
        (Strict WHERE user_id = req.user.id)
                  │
                  ▼
       ┌──────────────────────┐
       │ Supabase PostgreSQL  │
       │ (or Dev Local Store) │
       └──────────────────────┘
```

---

## 📁 Directory Structure

```
teen-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                # Environment config manager
│   │   │   └── supabase.js           # Supabase client initializer
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, logout, me, profile
│   │   │   ├── expenseController.js  # Expense CRUD & CSV export
│   │   │   ├── categoryController.js # Custom & default categories
│   │   │   ├── budgetController.js   # Category budget limits
│   │   │   ├── savingsController.js  # Savings goals & deposits
│   │   │   ├── incomeController.js   # Income CRUD & CSV export
│   │   │   ├── analyticsController.js# Graphical analytics endpoints
│   │   │   └── insightController.js  # Personalized recommendations
│   │   ├── db/
│   │   │   ├── schema.sql            # PostgreSQL DDL, indexes, and RLS
│   │   │   └── localStore.js         # Pre-seeded local fallback store
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer token verifier
│   │   │   ├── errorMiddleware.js    # Centralized 404 and 500 handler
│   │   │   ├── rateLimiter.js        # Rate limiting protection
│   │   │   └── validationMiddleware.js# Express-validator result parser
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── expenseModel.js
│   │   │   ├── categoryModel.js
│   │   │   ├── budgetModel.js
│   │   │   ├── savingsModel.js
│   │   │   └── incomeModel.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── savingsRoutes.js
│   │   │   ├── incomeRoutes.js
│   │   │   ├── analyticsRoutes.js
│   │   │   └── insightRoutes.js
│   │   ├── services/
│   │   │   ├── financialCalcService.js# Pure financial math helpers
│   │   │   ├── analyticsService.js    # Trends & aggregations
│   │   │   └── recommendationService.js# Teen money insight algorithms
│   │   ├── validators/                # Request validation rules
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── password.js
│   │   │   ├── dateUtils.js
│   │   │   ├── responseHelper.js
│   │   │   └── exportCsv.js
│   │   ├── scripts/
│   │   │   └── seed.js               # Database seeding script
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # HTTP listener & graceful shutdown
│   ├── tests/
│   │   └── api.test.js               # Jest & Supertest test suite (23 tests)
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/               # Recharts visual charts
│   │   │   ├── common/               # Button, Input, Select, Modal, Toast
│   │   │   ├── layout/               # Navbar, Sidebar, MobileNav, PageContainer
│   │   │   ├── expenses/             # ExpenseModal, ExpenseFilters
│   │   │   ├── budgets/              # BudgetModal
│   │   │   ├── savings/              # SavingsModal, ContributeModal
│   │   │   └── income/               # IncomeModal
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── AddExpensePage.tsx
│   │   │   ├── BudgetsPage.tsx
│   │   │   ├── SavingsPage.tsx
│   │   │   ├── IncomePage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/                 # Axios API services
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── App.tsx                   # Route configurations & guards
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind base styles
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## ⚡ Prerequisites

- **Node.js**: `v18.0.0` or later (tested on Node v24)
- **npm**: `v9.0.0` or later

---

## ⚙️ Installation & Setup

### 1. Clone or Open the Workspace
```bash
cd teen-expense-tracker
```

### 2. Configure Backend Environment
Navigate to `backend/` and verify `.env`:
```bash
cd backend
cp .env.example .env
```

`backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=super_secret_jwt_key_teenspend_2026_finance
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
> *Note: If Supabase credentials are not provided initially, the backend automatically runs in local development mode pre-seeded with Alex Rivera's demo profile.*

Install dependencies:
```bash
npm install
```

### 3. Configure Frontend Environment
Navigate to `frontend/`:
```bash
cd ../frontend
cp .env.example .env
```

`frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies:
```bash
npm install
```

---

## 🗄 Database Schema & Supabase Setup

The complete relational database schema is located at:  
[`backend/src/db/schema.sql`](file:///c:/Users/MCM/OneDrive/Documents/Projet%201/teen-expense-tracker/backend/src/db/schema.sql)

### Tables Created:
1. `users` / `profiles`: User accounts, hashed passwords, currency, and monthly allowance.
2. `categories`: User categories with unique name constraints, color hex codes, and icons.
3. `expenses`: Transaction logs with foreign keys, checks (`amount > 0`), payment methods, and timestamps.
4. `budgets`: Spending limits per category and period.
5. `savings_goals`: Target amounts, current amounts, and target dates.
6. `income`: Earnings, allowances, and gift records.
7. `notifications`: In-app system alerts and reminders.

### Applying Schema to Supabase:
1. Open your Supabase Dashboard: [https://supabase.com](https://supabase.com)
2. Go to **SQL Editor** -> **New query**
3. Copy and paste the contents of `backend/src/db/schema.sql`
4. Click **Run**
5. Seed demo data using:
   ```bash
   cd backend
   npm run seed
   ```

---

## 🚀 Running the Application

### Start Backend API Server:
```bash
cd teen-expense-tracker/backend
npm run dev     # Starts nodemon on port 5000
# or
npm run start   # Starts production node server
```
Server runs at: `http://localhost:5000`

### Start Frontend Vite Dev Server:
```bash
cd teen-expense-tracker/frontend
npm run dev
```
Client runs at: `http://localhost:5173`

### Pre-configured Demo Login:
- **Email:** `alex@teenspend.io`
- **Password:** `Alex123!`
*(Or simply click the **"⚡ Quick Demo Login"** button on `/login`)*

---

## 📡 REST API Documentation

All routes return a standardized response format:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... }
}
```

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (hashes password with bcrypt, auto-seeds default categories)
- `POST /api/auth/login` — Sign in and receive JWT bearer token
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Get current authenticated user profile
- `PUT /api/auth/profile` — Update name, age, currency, or monthly allowance

### Expense Endpoints
- `GET /api/expenses` — Query expenses (search, category_id, payment_method, start_date, end_date, min_amount, max_amount, sortBy, page, limit)
- `GET /api/expenses/export` — Download matching expenses as RFC 4180 CSV
- `GET /api/expenses/:id` — Get single expense (enforces ownership)
- `POST /api/expenses` — Record new expense
- `PUT /api/expenses/:id` — Edit expense
- `DELETE /api/expenses/:id` — Remove expense

### Category Endpoints
- `GET /api/categories` — List user categories
- `POST /api/categories` — Create custom category (validates hex color and prevents duplicates)
- `PUT /api/categories/:id` — Edit category
- `DELETE /api/categories/:id` — Delete category

### Budget Endpoints
- `GET /api/budgets` — List budgets with real-time calculated spent amounts and utilization %
- `POST /api/budgets` — Set category limit
- `PUT /api/budgets/:id` — Update limit
- `DELETE /api/budgets/:id` — Delete budget

### Savings Goals Endpoints
- `GET /api/savings` — List savings goals with progress and remaining target
- `POST /api/savings` — Create goal
- `PUT /api/savings/:id` — Edit goal
- `DELETE /api/savings/:id` — Delete goal
- `POST /api/savings/:id/contribute` — Deposit money toward goal

### Income Endpoints
- `GET /api/income` — List income streams
- `GET /api/income/export` — Download income records as CSV
- `POST /api/income` — Log allowance or earnings
- `PUT /api/income/:id` — Edit income
- `DELETE /api/income/:id` — Delete income

### Analytics & Insights Endpoints
- `GET /api/analytics/dashboard` — Complete financial overview metrics
- `GET /api/analytics/monthly` — 6-month historical spending trend
- `GET /api/analytics/categories` — Current month category breakdown
- `GET /api/analytics/weekly` — Weekday distribution (Monday to Sunday)
- `GET /api/insights` — Personalized, educational suggestions and health status

---

## 🧪 Testing & Quality Assurance

The backend includes a comprehensive Jest & Supertest automated test suite covering:
1. System health check
2. User registration and input validation
3. Duplicate email conflict handling (409)
4. Password hashing and authentication
5. Protected route authentication barriers (401)
6. Category creation and uniqueness checks
7. Expense validation (rejecting negative/zero amounts)
8. Strict resource ownership isolation
9. RFC 4180 CSV export generation
10. Category budget utilization math
11. Savings goals and deposit increments
12. Analytics summaries and smart insights generation

To run backend tests:
```bash
cd teen-expense-tracker/backend
npm run test
```
Result: **23 passing tests (100% pass rate)**.

To validate the frontend build:
```bash
cd teen-expense-tracker/frontend
npm run build
```
Result: **TypeScript compiles with 0 errors and generates optimized production bundle in `dist/`**.

---

## 🔒 Security Best Practices

1. **Password Security:** Never stores plain-text passwords. All credentials hashed using `bcryptjs` with salt factor 10.
2. **Token Authentication:** Secure JWT tokens with configurable expiration (`7d`).
3. **Strict Ownership Enforcement:** Every SQL and model query requires `WHERE user_id = req.user.id`. No user can access or mutate another teenager's records.
4. **Rate Limiting:** Protects against brute-force attacks via `express-rate-limit` (20 attempts per 15 min on auth, 300 per 15 min on general API).
5. **HTTP Security Headers:** Protected with `helmet` for XSS, MIME sniffing, and clickjacking protection.
6. **Input Validation:** Rigorous schema validation using `express-validator` prevents malformed financial numbers and injection attacks.
7. **Environment Secrets:** Secrets are kept strictly in `.env` and excluded from Git via `.gitignore`. The Supabase service role key is never exposed to the frontend.

---

## 🚢 Deployment Instructions

### Deploy Backend (e.g. Render, Railway, Fly.io, or Heroku):
- 🟢 **Live Production Deployment:** `https://teentracker-backend-qi30.onrender.com/api`
- **Health Check:** `https://teentracker-backend-qi30.onrender.com/api/health`
1. Set the root directory to `teen-expense-tracker/backend` (or repo root for backend repository).
2. Configure environment variables (`PORT`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`).
3. Build command: `npm install`
4. Start command: `npm run start`

### Deploy Frontend (e.g. Vercel, Netlify, Cloudflare Pages):
1. Set the root directory to `teen-expense-tracker/frontend` (or repo root for frontend repository).
2. Configure environment variable: `VITE_API_URL=https://teentracker-backend-qi30.onrender.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 💬 Financial Safety Disclaimer
*TEENSPEND is an educational personal finance tracker built specifically for teenagers to foster good money habits, understand expenses, and celebrate savings goals. All insights and recommendations are educational observations generated strictly from user-entered data and do not constitute professional financial or investment advice.*
