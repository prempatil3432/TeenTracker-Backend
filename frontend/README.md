# TEENSPEND — Frontend 🚀
> Modern, Responsive React + TypeScript Money Management & Expense Tracker for Teenagers

[![Live App](https://img.shields.io/badge/Vercel-Live%20Demo-brightgreen?logo=vercel)](https://teen-tracker-frontend-alpha.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22c55e)](https://recharts.org/)

---

## ✨ Overview

**TEENSPEND** is a gamified, intuitive, and responsive web application designed to help teenagers master their pocket money, track expenses, stay within category budgets, crush savings goals, and understand their financial habits through beautiful graphical analytics.

This repository contains the standalone **Frontend client** built with React, Vite, and TypeScript.

- 🚀 **Live Production Web App:** [https://teen-tracker-frontend-alpha.vercel.app/](https://teen-tracker-frontend-alpha.vercel.app/)
- 🌐 **Deployed Backend API:** `https://teentracker-backend-qi30.onrender.com/api`
- 🩺 **Backend Health Endpoint:** `https://teentracker-backend-qi30.onrender.com/api/health`

---

## 🌟 Key Features

- **📱 Fully Responsive Design:**
  - Modern desktop layout with collapsible sidebar and sticky glassmorphic navigation.
  - Native-feeling touch-friendly bottom navigation bar for mobile devices.
- **⚡ Sign-Up Pop-Up Modal & Auth:**
  - Interactive **Sign-Up Pop-Up Modal** allowing quick account creation without leaving the login page.
  - One-click **⚡ Quick Demo Login** (Alex Rivera, age 16) for instant testing.
  - Multi-currency support (`₹` INR, `$` USD, `€` EUR, `£` GBP, `A$` AUD, `C$` CAD).
- **💸 Expense & Income Management:**
  - Quick-add modal accessible from anywhere.
  - Category filters, date sorting, and instant search.
  - CSV export for financial records.
- **🎯 Visual Budgets & Alerts:**
  - Visual category progress bars with real-time percentage indicators.
  - Color-coded warning indicators (`Safe`, `Warning`, `Over Budget`).
- **🏆 Savings Goals with Confetti Celebrations:**
  - Target amount, target date, and progress tracking.
  - Dynamic milestone celebration with confetti effects upon completing goals.
- **📊 6 Recharts Visualizations:**
  - Daily spending area trend.
  - Category breakdown donut chart.
  - Budget vs. Actual spending bar comparison.
  - Income vs. Expense monthly overview.
  - Savings growth curve.
- **🌓 Dark & Light Modes:**
  - Persistent theme switching with smooth transitions and tailored color palettes.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS utilities
- **Icons:** Lucide React
- **Charts:** Recharts
- **Celebrations:** Canvas-Confetti
- **HTTP Client:** Axios with JWT token interceptors

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/prempatil3432/TeenTracker-Frontend.git
   cd TeenTracker-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (defaults to live Render backend if omitted):
   ```env
   VITE_API_URL=https://teentracker-backend-qi30.onrender.com/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📁 Project Structure

```text
frontend/
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images and design assets
│   ├── components/         # Reusable React components
│   │   ├── auth/           # SignUpModal, AuthCard
│   │   ├── budgets/        # BudgetCard, BudgetModal
│   │   ├── charts/         # Recharts visual analytics
│   │   ├── common/         # Button, Input, Modal, Select, Toast
│   │   ├── expenses/       # ExpenseList, AddExpenseModal
│   │   ├── income/         # IncomeList, AddIncomeModal
│   │   ├── layout/         # Navbar, Sidebar, MobileNav, PageContainer
│   │   └── savings/        # SavingsGoalCard, SavingsModal
│   ├── context/            # AuthContext, ThemeContext, ToastContext
│   ├── pages/              # LoginPage, RegisterPage, DashboardPage, AnalyticsPage, etc.
│   ├── services/           # Axios API services
│   ├── types/              # TypeScript interface definitions
│   ├── App.tsx             # Route definitions & guards
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind CSS imports
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 👤 Author

**Prem Kumar Patil**
- Email: [prempatil82340@gmail.com](mailto:prempatil82340@gmail.com)
- GitHub: [@prempatil3432](https://github.com/prempatil3432)

---

## 📄 License

This project is licensed under the MIT License.
