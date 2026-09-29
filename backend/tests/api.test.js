const request = require('supertest');
const app = require('../src/app');

describe('TEENSPEND Backend API Test Suite', () => {
  let authToken = '';
  let testUserId = '';
  let testCategoryId = '';
  let testExpenseId = '';

  const uniqueEmail = `teen_test_${Date.now()}@teenspend.io`;

  describe('1. Health Check', () => {
    it('GET /health should return 200 and healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('TEENSPEND API');
    });
  });

  describe('2. Authentication Flow', () => {
    it('POST /api/auth/register should fail with invalid email or short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sam',
          email: 'invalid-email',
          password: '123',
        });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('email');
      expect(res.body.errors).toHaveProperty('password');
    });

    it('POST /api/auth/register should create new user and return JWT', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Sam Tester',
          email: uniqueEmail,
          password: 'Password123!',
          age: 17,
          currency: '₹',
          monthly_allowance: 4000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(uniqueEmail.toLowerCase());
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).not.toHaveProperty('password_hash');

      authToken = res.body.data.token;
      testUserId = res.body.data.user.id;
    });

    it('POST /api/auth/register should reject duplicate email with 409', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Sam',
          email: uniqueEmail,
          password: 'Password123!',
        });
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/login should authenticate user with correct password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('POST /api/auth/login should reject incorrect password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: uniqueEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should return authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.id).toBe(testUserId);
    });

    it('GET /api/auth/me should reject request without token with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('3. Category Management', () => {
    it('GET /api/categories should list seeded categories for the user', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
      expect(res.body.data.categories.length).toBeGreaterThan(0);
      testCategoryId = res.body.data.categories[0].id;
    });

    it('POST /api/categories should create a custom category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Skateboarding & Gear',
          color: '#06b6d4',
          icon: 'Sparkles',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.category.name).toBe('Skateboarding & Gear');
    });

    it('POST /api/categories should reject duplicate category name with 409', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Skateboarding & Gear',
          color: '#06b6d4',
          icon: 'Sparkles',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('4. Expense Management & Ownership Validation', () => {
    it('POST /api/expenses should reject negative or zero amount', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: -50,
          description: 'Invalid negative test',
          category_id: testCategoryId,
        });

      expect(res.status).toBe(422);
      expect(res.body.errors).toHaveProperty('amount');
    });

    it('POST /api/expenses should record a valid expense', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 250.50,
          description: 'Movie ticket with friends',
          category_id: testCategoryId,
          expense_date: new Date().toISOString().split('T')[0],
          payment_method: 'UPI',
          merchant: 'PVR Cinemas',
          notes: 'Weekend afternoon show',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.expense).toBeDefined();
      expect(Number(res.body.data.expense.amount)).toBe(250.50);
      expect(res.body.data.expense.description).toBe('Movie ticket with friends');
      testExpenseId = res.body.data.expense.id;
    });

    it('GET /api/expenses should retrieve user expenses with pagination', async () => {
      const res = await request(app)
        .get('/api/expenses?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.expenses.length).toBeGreaterThan(0);
      expect(res.body.data.total).toBeGreaterThan(0);
      expect(res.body.data.page).toBe(1);
    });

    it('GET /api/expenses/export should return CSV attachment', async () => {
      const res = await request(app)
        .get('/api/expenses/export')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('"Date"');
      expect(res.text).toContain('"Description"');
      expect(res.text).toContain('Movie ticket with friends');
    });

    it('PUT /api/expenses/:id should update user expense', async () => {
      const res = await request(app)
        .put(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 280.00,
          description: 'Movie ticket and popcorn',
        });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.expense.amount)).toBe(280.00);
      expect(res.body.data.expense.description).toBe('Movie ticket and popcorn');
    });

    it('DELETE /api/expenses/:id should remove expense', async () => {
      const res = await request(app)
        .delete(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);

      // Verify it is gone
      const check = await request(app)
        .get(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(check.status).toBe(404);
    });
  });

  describe('5. Budgets & Financial Calculations', () => {
    it('POST /api/budgets should create a category budget', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category_id: testCategoryId,
          amount: 1500,
          period: 'monthly',
        });

      expect(res.status).toBe(201);
      expect(Number(res.body.data.budget.amount)).toBe(1500);
    });

    it('GET /api/budgets should return calculated budget utilization status', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.budgets.length).toBeGreaterThan(0);
      const budget = res.body.data.budgets[0];
      expect(budget).toHaveProperty('spent');
      expect(budget).toHaveProperty('remaining');
      expect(budget).toHaveProperty('percentage');
      expect(budget).toHaveProperty('status');
    });
  });

  describe('6. Savings Goals & Contributions', () => {
    let goalId = '';

    it('POST /api/savings should create a savings goal', async () => {
      const res = await request(app)
        .post('/api/savings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Gaming Headset',
          target_amount: 3000,
          current_amount: 500,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.goal.name).toBe('Gaming Headset');
      goalId = res.body.data.goal.id;
    });

    it('POST /api/savings/:id/contribute should increment current amount', async () => {
      const res = await request(app)
        .post(`/api/savings/${goalId}/contribute`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 500,
        });

      expect(res.status).toBe(200);
      expect(Number(res.body.data.goal.current_amount)).toBe(1000);
    });
  });

  describe('7. Analytics & Personalized Insights', () => {
    it('GET /api/analytics/dashboard should return complete financial summary', async () => {
      const res = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.summary).toHaveProperty('totalSpent');
      expect(res.body.data.summary).toHaveProperty('remaining');
      expect(res.body.data.summary).toHaveProperty('savingsRate');
    });

    it('GET /api/insights should generate personalized, teen-friendly suggestions', async () => {
      const res = await request(app)
        .get('/api/insights')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.health).toBeDefined();
      expect(res.body.data.health).toHaveProperty('status');
      expect(res.body.data.health).toHaveProperty('disclaimer');
      expect(Array.isArray(res.body.data.suggestions)).toBe(true);
    });
  });
});
