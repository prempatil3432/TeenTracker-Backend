const { supabase, isSupabaseConfigured, isTableMissingError } = require('../config/supabase');
const { localDb } = require('../db/localStore');
const crypto = require('crypto');

class UserModel {
  static async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (error) {
          if (isTableMissingError(error)) {
            return localDb.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
          }
          throw error;
        }
        return data;
      } catch (err) {
        if (isTableMissingError(err)) {
          return localDb.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
        }
        throw err;
      }
    }

    return localDb.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
  }

  static async findById(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, age, currency, monthly_allowance, created_at, updated_at')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          if (isTableMissingError(error)) {
            const user = localDb.users.find((u) => u.id === id);
            if (!user) return null;
            const { password_hash, ...safeUser } = user;
            return safeUser;
          }
          throw error;
        }
        return data;
      } catch (err) {
        if (isTableMissingError(err)) {
          const user = localDb.users.find((u) => u.id === id);
          if (!user) return null;
          const { password_hash, ...safeUser } = user;
          return safeUser;
        }
        throw err;
      }
    }

    const user = localDb.users.find((u) => u.id === id);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  static async create({ name, email, password_hash, age = 16, currency = '₹', monthly_allowance = 0.0 }) {
    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              name,
              email: normalizedEmail,
              password_hash,
              age: Number(age) || 16,
              currency: currency || '₹',
              monthly_allowance: Number(monthly_allowance) || 0.0,
              created_at: now,
              updated_at: now,
            },
          ])
          .select()
          .single();

        if (error) {
          if (!isTableMissingError(error)) {
            throw error;
          }
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) {
          throw err;
        }
      }
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      password_hash,
      age: Number(age) || 16,
      currency: currency || '₹',
      monthly_allowance: Number(monthly_allowance) || 0.0,
      created_at: now,
      updated_at: now,
    };

    localDb.users.push(newUser);
    return newUser;
  }

  static async update(id, updates) {
    const allowed = ['name', 'age', 'currency', 'monthly_allowance', 'password_hash'];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }
    filteredUpdates.updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update(filteredUpdates)
          .eq('id', id)
          .select('id, name, email, age, currency, monthly_allowance, created_at, updated_at')
          .single();

        if (error) {
          if (!isTableMissingError(error)) {
            throw error;
          }
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) {
          throw err;
        }
      }
    }

    const index = localDb.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    localDb.users[index] = {
      ...localDb.users[index],
      ...filteredUpdates,
    };

    const { password_hash, ...safeUser } = localDb.users[index];
    return safeUser;
  }
}

module.exports = UserModel;
