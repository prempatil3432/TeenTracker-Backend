const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { localDb } = require('../db/localStore');
const crypto = require('crypto');

class BudgetModel {
  static async findAll(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    const budgets = localDb.budgets.filter((b) => b.user_id === userId);
    return budgets.map((b) => {
      const cat = localDb.categories.find((c) => c.id === b.category_id);
      return {
        ...b,
        category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
      };
    });
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
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

    const b = localDb.budgets.find((item) => item.id === id && item.user_id === userId);
    if (!b) return null;
    const cat = localDb.categories.find((c) => c.id === b.category_id);
    return {
      ...b,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async findByCategoryAndPeriod(userId, categoryId, period = 'monthly') {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .eq('period', period)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    return (
      localDb.budgets.find(
        (b) => b.user_id === userId && b.category_id === categoryId && b.period === period
      ) || null
    );
  }

  static async create({ user_id, category_id, amount, period = 'monthly', start_date, end_date }) {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id,
            category_id,
            amount: Number(amount),
            period,
            start_date: start_date || null,
            end_date: end_date || null,
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

    const newBudget = {
      id: crypto.randomUUID(),
      user_id,
      category_id,
      amount: Number(amount),
      period,
      start_date: start_date || null,
      end_date: end_date || null,
      created_at: now,
      updated_at: now,
    };

    localDb.budgets.push(newBudget);
    const cat = localDb.categories.find((c) => c.id === newBudget.category_id);
    return {
      ...newBudget,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async update(id, userId, updates) {
    const allowed = ['amount', 'period', 'category_id', 'start_date', 'end_date'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = key === 'amount' ? Number(updates[key]) : updates[key];
      }
    }
    filtered.updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
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

    const index = localDb.budgets.findIndex((b) => b.id === id && b.user_id === userId);
    if (index === -1) return null;

    localDb.budgets[index] = {
      ...localDb.budgets[index],
      ...filtered,
    };

    const updated = localDb.budgets[index];
    const cat = localDb.categories.find((c) => c.id === updated.category_id);
    return {
      ...updated,
      category: cat ? { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon } : null,
    };
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.budgets.findIndex((b) => b.id === id && b.user_id === userId);
    if (index === -1) return null;

    return localDb.budgets.splice(index, 1)[0];
  }
}

module.exports = BudgetModel;
