const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { localDb } = require('../db/localStore');
const crypto = require('crypto');

class IncomeModel {
  static async findAll(userId, { start_date, end_date, source } = {}) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('income')
        .select('*')
        .eq('user_id', userId)
        .order('income_date', { ascending: false });

      if (start_date) query = query.gte('income_date', start_date);
      if (end_date) query = query.lte('income_date', end_date);
      if (source) query = query.eq('source', source);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let results = localDb.income.filter((i) => i.user_id === userId);
    if (start_date) results = results.filter((i) => i.income_date >= start_date);
    if (end_date) results = results.filter((i) => i.income_date <= end_date);
    if (source) results = results.filter((i) => i.source.toLowerCase() === source.toLowerCase());

    return results.sort((a, b) => new Date(b.income_date) - new Date(a.income_date));
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    return localDb.income.find((i) => i.id === id && i.user_id === userId) || null;
  }

  static async create({ user_id, source, amount, income_date, description }) {
    const now = new Date().toISOString();
    const date = income_date || now.split('T')[0];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('income')
        .insert([
          {
            user_id,
            source: source.trim(),
            amount: Number(amount),
            income_date: date,
            description: description ? description.trim() : null,
            created_at: now,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const newIncome = {
      id: crypto.randomUUID(),
      user_id,
      source: source.trim(),
      amount: Number(amount),
      income_date: date,
      description: description ? description.trim() : null,
      created_at: now,
    };

    localDb.income.push(newIncome);
    return newIncome;
  }

  static async update(id, userId, updates) {
    const allowed = ['source', 'amount', 'income_date', 'description'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'amount') filtered[key] = Number(updates[key]);
        else if (key === 'source') filtered[key] = updates[key].trim();
        else filtered[key] = updates[key];
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('income')
        .update(filtered)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.income.findIndex((i) => i.id === id && i.user_id === userId);
    if (index === -1) return null;

    localDb.income[index] = {
      ...localDb.income[index],
      ...filtered,
    };

    return localDb.income[index];
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('income')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.income.findIndex((i) => i.id === id && i.user_id === userId);
    if (index === -1) return null;

    return localDb.income.splice(index, 1)[0];
  }

  static async findByDateRange(userId, startDate, endDate) {
    return await IncomeModel.findAll(userId, { start_date: startDate, end_date: endDate });
  }
}

module.exports = IncomeModel;
