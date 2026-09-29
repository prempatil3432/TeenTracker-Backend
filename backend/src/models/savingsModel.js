const { supabase, isSupabaseConfigured } = require('../config/supabase');
const { localDb } = require('../db/localStore');
const crypto = require('crypto');

class SavingsModel {
  static async findAll(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return localDb.savings_goals
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    return localDb.savings_goals.find((s) => s.id === id && s.user_id === userId) || null;
  }

  static async create({ user_id, name, target_amount, current_amount = 0, target_date = null, description = '' }) {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([
          {
            user_id,
            name: name.trim(),
            target_amount: Number(target_amount),
            current_amount: Number(current_amount) || 0,
            target_date: target_date || null,
            description: description ? description.trim() : null,
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const newGoal = {
      id: crypto.randomUUID(),
      user_id,
      name: name.trim(),
      target_amount: Number(target_amount),
      current_amount: Number(current_amount) || 0,
      target_date: target_date || null,
      description: description ? description.trim() : null,
      created_at: now,
      updated_at: now,
    };

    localDb.savings_goals.push(newGoal);
    return newGoal;
  }

  static async update(id, userId, updates) {
    const allowed = ['name', 'target_amount', 'current_amount', 'target_date', 'description'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'target_amount' || key === 'current_amount') {
          filtered[key] = Number(updates[key]);
        } else if (key === 'name') {
          filtered[key] = updates[key].trim();
        } else {
          filtered[key] = updates[key];
        }
      }
    }
    filtered.updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(filtered)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.savings_goals.findIndex((s) => s.id === id && s.user_id === userId);
    if (index === -1) return null;

    localDb.savings_goals[index] = {
      ...localDb.savings_goals[index],
      ...filtered,
    };

    return localDb.savings_goals[index];
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.savings_goals.findIndex((s) => s.id === id && s.user_id === userId);
    if (index === -1) return null;

    return localDb.savings_goals.splice(index, 1)[0];
  }

  static async contribute(id, userId, amount) {
    const goal = await SavingsModel.findById(id, userId);
    if (!goal) return null;

    const newAmount = Math.max(0, Number(goal.current_amount || 0) + Number(amount));
    return await SavingsModel.update(id, userId, { current_amount: newAmount });
  }
}

module.exports = SavingsModel;
