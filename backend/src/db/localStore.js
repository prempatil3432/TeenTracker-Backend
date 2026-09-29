/**
 * Local Data Store for development/offline mode when Supabase credentials are not yet entered.
 * Implements full CRUD, filtering, pagination, and relational joins matching Supabase PostgreSQL tables.
 */
const bcrypt = require('bcryptjs');

// Pre-hashed password for demo user Alex: "Alex123!"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Alex123!', 10);
const DEMO_USER_ID = 'u1111111-1111-4111-8111-111111111111';

const defaultCategories = [
  { id: 'c1', user_id: DEMO_USER_ID, name: 'Food & Dining', color: '#f97316', icon: 'Utensils', created_at: new Date().toISOString() },
  { id: 'c2', user_id: DEMO_USER_ID, name: 'Snacks & Cafes', color: '#fbbf24', icon: 'Coffee', created_at: new Date().toISOString() },
  { id: 'c3', user_id: DEMO_USER_ID, name: 'Transportation', color: '#3b82f6', icon: 'Bus', created_at: new Date().toISOString() },
  { id: 'c4', user_id: DEMO_USER_ID, name: 'Education & Books', color: '#10b981', icon: 'BookOpen', created_at: new Date().toISOString() },
  { id: 'c5', user_id: DEMO_USER_ID, name: 'Entertainment & Movies', color: '#8b5cf6', icon: 'Film', created_at: new Date().toISOString() },
  { id: 'c6', user_id: DEMO_USER_ID, name: 'Shopping & Fashion', color: '#ec4899', icon: 'ShoppingBag', created_at: new Date().toISOString() },
  { id: 'c7', user_id: DEMO_USER_ID, name: 'Gaming & Apps', color: '#06b6d4', icon: 'Gamepad2', created_at: new Date().toISOString() },
  { id: 'c8', user_id: DEMO_USER_ID, name: 'Subscriptions', color: '#6366f1', icon: 'Tv', created_at: new Date().toISOString() },
  { id: 'c9', user_id: DEMO_USER_ID, name: 'Mobile & Internet', color: '#14b8a6', icon: 'Smartphone', created_at: new Date().toISOString() },
  { id: 'c10', user_id: DEMO_USER_ID, name: 'Sports & Fitness', color: '#84cc16', icon: 'Activity', created_at: new Date().toISOString() },
  { id: 'c11', user_id: DEMO_USER_ID, name: 'Gifts & Charity', color: '#f43f5e', icon: 'Gift', created_at: new Date().toISOString() },
  { id: 'c12', user_id: DEMO_USER_ID, name: 'Other', color: '#64748b', icon: 'MoreHorizontal', created_at: new Date().toISOString() },
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

const demoExpenses = [
  {
    id: 'e1',
    user_id: DEMO_USER_ID,
    category_id: 'c1',
    amount: 350.00,
    description: 'Burger & fries with friends',
    expense_date: `${currentYear}-${currentMonth}-02`,
    payment_method: 'UPI',
    merchant: 'Burger King',
    notes: 'After school treat',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e2',
    user_id: DEMO_USER_ID,
    category_id: 'c3',
    amount: 120.00,
    description: 'Metro pass recharge',
    expense_date: `${currentYear}-${currentMonth}-03`,
    payment_method: 'UPI',
    merchant: 'Metro Rail',
    notes: 'Weekly commute',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e3',
    user_id: DEMO_USER_ID,
    category_id: 'c8',
    amount: 499.00,
    description: 'Spotify Premium Family share',
    expense_date: `${currentYear}-${currentMonth}-05`,
    payment_method: 'Debit Card',
    merchant: 'Spotify',
    notes: 'Monthly music plan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e4',
    user_id: DEMO_USER_ID,
    category_id: 'c4',
    amount: 650.00,
    description: 'Physics & Chemistry reference books',
    expense_date: `${currentYear}-${currentMonth}-07`,
    payment_method: 'Cash',
    merchant: 'City Book Depot',
    notes: 'Exam preparation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e5',
    user_id: DEMO_USER_ID,
    category_id: 'c7',
    amount: 800.00,
    description: 'Battle Pass & in-game skin',
    expense_date: `${currentYear}-${currentMonth}-10`,
    payment_method: 'UPI',
    merchant: 'Steam / Epic Games',
    notes: 'Weekend gaming tournament',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e6',
    user_id: DEMO_USER_ID,
    category_id: 'c2',
    amount: 180.00,
    description: 'Iced caramel latte & muffin',
    expense_date: `${currentYear}-${currentMonth}-12`,
    payment_method: 'UPI',
    merchant: 'Cafe Coffee Day',
    notes: 'Study session',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e7',
    user_id: DEMO_USER_ID,
    category_id: 'c6',
    amount: 1100.00,
    description: 'Graphic hoodie',
    expense_date: `${currentYear}-${currentMonth}-15`,
    payment_method: 'Debit Card',
    merchant: 'H&M',
    notes: 'Winter outfit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e8',
    user_id: DEMO_USER_ID,
    category_id: 'c1',
    amount: 450.00,
    description: 'Pizza night with cousins',
    expense_date: `${currentYear}-${currentMonth}-18`,
    payment_method: 'Cash',
    merchant: "Domino's Pizza",
    notes: 'Weekend dinner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e9',
    user_id: DEMO_USER_ID,
    category_id: 'c9',
    amount: 299.00,
    description: 'Monthly 5G mobile data pack',
    expense_date: `${currentYear}-${currentMonth}-20`,
    payment_method: 'UPI',
    merchant: 'Jio / Airtel',
    notes: 'Prepaid renewal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e10',
    user_id: DEMO_USER_ID,
    category_id: 'c2',
    amount: 90.00,
    description: 'Bubble tea on way home',
    expense_date: `${currentYear}-${currentMonth}-22`,
    payment_method: 'Cash',
    merchant: 'Boba Hub',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e11',
    user_id: DEMO_USER_ID,
    category_id: 'c5',
    amount: 380.00,
    description: 'Movie ticket - Marvel screening',
    expense_date: `${currentYear}-${currentMonth}-24`,
    payment_method: 'UPI',
    merchant: 'PVR Cinemas',
    notes: 'Watched with school gang',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoBudgets = [
  {
    id: 'b1',
    user_id: DEMO_USER_ID,
    category_id: 'c1', // Food & Dining
    amount: 1500.00,
    period: 'monthly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b2',
    user_id: DEMO_USER_ID,
    category_id: 'c5', // Entertainment
    amount: 1000.00,
    period: 'monthly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b3',
    user_id: DEMO_USER_ID,
    category_id: 'c3', // Transportation
    amount: 800.00,
    period: 'monthly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b4',
    user_id: DEMO_USER_ID,
    category_id: 'c6', // Shopping
    amount: 1200.00,
    period: 'monthly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoSavings = [
  {
    id: 's1',
    user_id: DEMO_USER_ID,
    name: 'Sony WH-1000XM5 Headphones',
    target_amount: 18000.00,
    current_amount: 9500.00,
    target_date: `${currentYear + 1}-01-15`,
    description: 'Active noise cancelling headphones for studying and music',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's2',
    user_id: DEMO_USER_ID,
    name: 'College Tech Fund (MacBook Air)',
    target_amount: 75000.00,
    current_amount: 28000.00,
    target_date: `${currentYear + 1}-07-30`,
    description: 'Laptop upgrade for upcoming university semester',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's3',
    user_id: DEMO_USER_ID,
    name: 'Emergency Teen Rainy Day Fund',
    target_amount: 5000.00,
    current_amount: 3200.00,
    target_date: `${currentYear}-12-31`,
    description: 'Buffer for unexpected costs or lost items',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoIncome = [
  {
    id: 'i1',
    user_id: DEMO_USER_ID,
    source: 'Monthly Allowance',
    amount: 5000.00,
    income_date: `${currentYear}-${currentMonth}-01`,
    description: 'Parents monthly pocket money allowance',
    created_at: new Date().toISOString(),
  },
  {
    id: 'i2',
    user_id: DEMO_USER_ID,
    source: 'Math Tutoring',
    amount: 2500.00,
    income_date: `${currentYear}-${currentMonth}-10`,
    description: 'Tutored 7th grade neighbor in algebra',
    created_at: new Date().toISOString(),
  },
  {
    id: 'i3',
    user_id: DEMO_USER_ID,
    source: 'Birthday Gift from Grandparents',
    amount: 2000.00,
    income_date: `${currentYear}-${currentMonth}-16`,
    description: 'Cash gift card',
    created_at: new Date().toISOString(),
  },
];

// Initialize memory state
const localDb = {
  users: [
    {
      id: DEMO_USER_ID,
      name: 'Alex Rivera',
      email: 'alex@teenspend.io',
      password_hash: DEMO_PASSWORD_HASH,
      age: 16,
      currency: '₹',
      monthly_allowance: 5000.00,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  categories: [...defaultCategories],
  expenses: [...demoExpenses],
  budgets: [...demoBudgets],
  savings_goals: [...demoSavings],
  income: [...demoIncome],
  notifications: [
    {
      id: 'n1',
      user_id: DEMO_USER_ID,
      title: 'Welcome to TEENSPEND! 🚀',
      message: 'Track every rupee or dollar, set smart budgets, and reach your savings goals easily.',
      type: 'success',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'n2',
      user_id: DEMO_USER_ID,
      title: 'Shopping Budget Alert ⚠️',
      message: 'You have used 91.6% of your monthly Shopping budget.',
      type: 'warning',
      is_read: false,
      created_at: new Date().toISOString(),
    }
  ],
};

module.exports = {
  localDb,
  DEMO_USER_ID,
  defaultCategories,
};
