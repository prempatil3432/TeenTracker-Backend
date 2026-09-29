/**
 * Database Seeding Script for TEENSPEND
 * Seeds demo user, categories, expenses, budgets, savings goals, and income.
 * Passwords are encrypted with bcrypt (rounds = 10).
 */
const bcrypt = require('bcryptjs');
const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { defaultCategories } = require('../db/localStore');

const DEMO_EMAIL = 'alex@teenspend.io';
const DEMO_PASSWORD_RAW = 'Alex123!';

async function runSeed() {
  console.log('🌱 Starting TEENSPEND database seeding...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD_RAW, 10);

  if (isSupabaseConfigured && supabase) {
    console.log('Connecting to Supabase PostgreSQL database...');

    // 1. Create or get user
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', DEMO_EMAIL)
      .maybeSingle();

    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            name: 'Alex Rivera',
            email: DEMO_EMAIL,
            password_hash: passwordHash,
            age: 16,
            currency: '₹',
            monthly_allowance: 5000.00,
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating demo user in Supabase:', createError);
        process.exit(1);
      }
      user = newUser;
      console.log('✓ Demo user created in Supabase:', user.id);
    } else {
      console.log('✓ Demo user already exists:', user.id);
    }

    const userId = user.id;

    // 2. Seed categories
    const seededCategories = [];
    for (const cat of defaultCategories) {
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .eq('name', cat.name)
        .maybeSingle();

      if (!existing) {
        const { data: created } = await supabase
          .from('categories')
          .insert([
            {
              user_id: userId,
              name: cat.name,
              color: cat.color,
              icon: cat.icon,
            },
          ])
          .select()
          .single();
        seededCategories.push(created);
      } else {
        seededCategories.push(existing);
      }
    }
    console.log(`✓ ${seededCategories.length} categories seeded.`);

    // 3. Seed Income
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

    await supabase.from('income').insert([
      {
        user_id: userId,
        source: 'Monthly Allowance',
        amount: 5000.00,
        income_date: `${currentYear}-${currentMonth}-01`,
        description: 'Monthly pocket money allowance',
      },
      {
        user_id: userId,
        source: 'Math Tutoring',
        amount: 2500.00,
        income_date: `${currentYear}-${currentMonth}-10`,
        description: 'Tutored neighbor in algebra',
      },
      {
        user_id: userId,
        source: 'Birthday Gift',
        amount: 2000.00,
        income_date: `${currentYear}-${currentMonth}-15`,
        description: 'Gift from grandparents',
      }
    ]);
    console.log('✓ Demo income seeded.');

    // 4. Seed Expenses
    const foodCat = seededCategories.find((c) => c.name.includes('Food')) || seededCategories[0];
    const transCat = seededCategories.find((c) => c.name.includes('Transport')) || seededCategories[1];
    const entCat = seededCategories.find((c) => c.name.includes('Entertainment')) || seededCategories[2];
    const gameCat = seededCategories.find((c) => c.name.includes('Gaming')) || seededCategories[3];
    const shopCat = seededCategories.find((c) => c.name.includes('Shopping')) || seededCategories[4];

    await supabase.from('expenses').insert([
      {
        user_id: userId,
        category_id: foodCat.id,
        amount: 350.00,
        description: 'Burger & fries with friends',
        expense_date: `${currentYear}-${currentMonth}-02`,
        payment_method: 'UPI',
        merchant: 'Burger King',
        notes: 'Lunch after class',
      },
      {
        user_id: userId,
        category_id: transCat.id,
        amount: 150.00,
        description: 'Metro smart card top-up',
        expense_date: `${currentYear}-${currentMonth}-04`,
        payment_method: 'UPI',
        merchant: 'Metro Rail',
      },
      {
        user_id: userId,
        category_id: entCat.id,
        amount: 450.00,
        description: 'Movie ticket & popcorn',
        expense_date: `${currentYear}-${currentMonth}-08`,
        payment_method: 'Debit Card',
        merchant: 'PVR Cinemas',
      },
      {
        user_id: userId,
        category_id: gameCat.id,
        amount: 800.00,
        description: 'Steam summer game bundle',
        expense_date: `${currentYear}-${currentMonth}-12`,
        payment_method: 'UPI',
        merchant: 'Steam Games',
      },
      {
        user_id: userId,
        category_id: shopCat.id,
        amount: 1200.00,
        description: 'New denim jacket',
        expense_date: `${currentYear}-${currentMonth}-16`,
        payment_method: 'Debit Card',
        merchant: 'Zara / H&M',
      },
    ]);
    console.log('✓ Demo expenses seeded.');

    // 5. Seed Budgets
    await supabase.from('budgets').insert([
      { user_id: userId, category_id: foodCat.id, amount: 1500.00, period: 'monthly' },
      { user_id: userId, category_id: transCat.id, amount: 800.00, period: 'monthly' },
      { user_id: userId, category_id: entCat.id, amount: 1000.00, period: 'monthly' },
    ]);
    console.log('✓ Demo budgets seeded.');

    // 6. Seed Savings Goals
    await supabase.from('savings_goals').insert([
      {
        user_id: userId,
        name: 'Wireless Noise-Canceling Headphones',
        target_amount: 12000.00,
        current_amount: 7500.00,
        target_date: `${currentYear + 1}-02-15`,
        description: 'Sony WH-CH720N or similar for focused studying',
      },
      {
        user_id: userId,
        name: 'Gaming Console Fund',
        target_amount: 45000.00,
        current_amount: 18000.00,
        target_date: `${currentYear + 1}-08-20`,
        description: 'Saving up for PS5 / Xbox Series X',
      },
    ]);
    console.log('✓ Demo savings goals seeded.');
  } else {
    console.log('✓ Local in-memory data store is already pre-configured with rich demo data for Alex Rivera.');
  }

  console.log('\n======================================================');
  console.log('🎉 Seeding completed successfully!');
  console.log('Demo Credentials:');
  console.log(`Email:    ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD_RAW}`);
  console.log('======================================================\n');
}

runSeed().catch((err) => {
  console.error('Seeding failed with error:', err);
  process.exit(1);
});
