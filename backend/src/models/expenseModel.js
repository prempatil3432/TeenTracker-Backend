const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { localDb } = require('../db/localStore');
const crypto = require('crypto');

class ExpenseModel {
  static async findAll(userId, {
    search = '',
    category_id,
    payment_method,
    start_date,
    end_date,
    min_amount,
    max_amount,
    sortBy = 'newest', // newest, oldest, highest, lowest
    page = 1,
    limit = 20,
    all = false,
  } = {}) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `, { count: 'exact' })
        .eq('user_id', userId);

      if (search) {
        query = query.or(`description.ilike.%${search}%,merchant.ilike.%${search}%`);
      }
      if (category_id) {
        query = query.eq('category_id', category_id);
      }
      if (payment_method) {
        query = query.eq('payment_method', payment_method);
      }
      if (start_date) {
        query = query.gte('expense_date', start_date);
      }
      if (end_date) {
        query = query.lte('expense_date', end_date);
      }
      if (min_amount) {
        query = query.gte('amount', Number(min_amount));
      }
      if (max_amount) {
        query = query.lte('amount', Number(max_amount));
      }

      // Sorting
      if (sortBy === 'oldest') {
        query = query.order('expense_date', { ascending: true }).order('created_at', { ascending: true });
      } else if (sortBy === 'highest') {
        query = query.order('amount', { ascending: false });
      } else if (sortBy === 'lowest') {
        query = query.order('amount', { ascending: true });
      } else {
        // default newest
        query = query.order('expense_date', { ascending: false }).order('created_at', { ascending: false });
      }

      if (!all) {
        query = query.range(offset, offset + limitNum - 1);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      return {
        expenses: data || [],
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        totalPages: all ? 1 : Math.ceil((count || 0) / limitNum),
      };
    }

    // Local in-memory filtering
    let filtered = localDb.expenses.filter((e) => e.user_id === userId);

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          (e.description && e.description.toLowerCase().includes(term)) ||
          (e.merchant && e.merchant.toLowerCase().includes(term))
      );
    }
    if (category_id) {
      filtered = filtered.filter((e) => e.category_id === category_id);
    }
    if (payment_method) {
      filtered = filtered.filter((e) => e.payment_method === payment_method);
    }
    if (start_date) {
      filtered = filtered.filter((e) => e.expense_date >= start_date);
    }
    if (end_date) {
      filtered = filtered.filter((e) => e.expense_date <= end_date);
    }
    if (min_amount !== undefined && min_amount !== '') {
      filtered = filtered.filter((e) => Number(e.amount) >= Number(min_amount));
    }
    if (max_amount !== undefined && max_amount !== '') {
      filtered = filtered.filter((e) => Number(e.amount) <= Number(max_amount));
    }

    // Sort
    if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.expense_date) - new Date(b.expense_date));
    } else if (sortBy === 'highest') {
      filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortBy === 'lowest') {
      filtered.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));
    }

    const total = filtered.length;
    const paginated = all ? filtered : filtered.slice(offset, offset + limitNum);

    // Join category data
    const enriched = paginated.map((exp) => {
      const cat = localDb.categories.find((c) => c.id === exp.category_id);
      return {
        ...exp,
        category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
      };
    });

    return {
      expenses: enriched,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: all ? 1 : Math.ceil(total / limitNum),
    };
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const exp = localDb.expenses.find((e) => e.id === id && e.user_id === userId);
    if (!exp) return null;

    const cat = localDb.categories.find((c) => c.id === exp.category_id);
    return {
      ...exp,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async create({
    user_id,
    category_id,
    amount,
    description,
    expense_date,
    payment_method = 'Cash',
    merchant = null,
    notes = null,
  }) {
    const now = new Date().toISOString();
    const date = expense_date || now.split('T')[0];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id,
            category_id: category_id || null,
            amount: Number(amount),
            description: description.trim(),
            expense_date: date,
            payment_method,
            merchant: merchant ? merchant.trim() : null,
            notes: notes ? notes.trim() : null,
            created_at: now,
            updated_at: now,
          },
        ])
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .single();

      if (error) throw error;
      return data;
    }

    const newExpense = {
      id: crypto.randomUUID(),
      user_id,
      category_id: category_id || null,
      amount: Number(amount),
      description: description.trim(),
      expense_date: date,
      payment_method,
      merchant: merchant ? merchant.trim() : null,
      notes: notes ? notes.trim() : null,
      created_at: now,
      updated_at: now,
    };

    localDb.expenses.push(newExpense);

    const cat = localDb.categories.find((c) => c.id === newExpense.category_id);
    return {
      ...newExpense,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async update(id, userId, updates) {
    const allowed = ['category_id', 'amount', 'description', 'expense_date', 'payment_method', 'merchant', 'notes'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = key === 'amount' ? Number(updates[key]) : updates[key];
      }
    }
    filtered.updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .update(filtered)
        .eq('id', id)
        .eq('user_id', userId)
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.expenses.findIndex((e) => e.id === id && e.user_id === userId);
    if (index === -1) return null;

    localDb.expenses[index] = {
      ...localDb.expenses[index],
      ...filtered,
    };

    const updated = localDb.expenses[index];
    const cat = localDb.categories.find((c) => c.id === updated.category_id);
    return {
      ...updated,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.expenses.findIndex((e) => e.id === id && e.user_id === userId);
    if (index === -1) return null;

    const removed = localDb.expenses.splice(index, 1)[0];
    return removed;
  }

  static async findByDateRange(userId, startDate, endDate) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .eq('user_id', userId)
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    const expenses = localDb.expenses.filter(
      (e) => e.user_id === userId && e.expense_date >= startDate && e.expense_date <= endDate
    );

    return expenses.map((exp) => {
      const cat = localDb.categories.find((c) => c.id === exp.category_id);
      return {
        ...exp,
        category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
      };
    });
  }
}

module.exports = ExpenseModel;
