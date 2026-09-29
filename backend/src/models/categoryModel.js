const { supabase, isSupabaseConfigured, isTableMissingError } = require('../config/supabase');
const { localDb, defaultCategories } = require('../db/localStore');
const crypto = require('crypto');

class CategoryModel {
  static async findByUserId(userId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
          .order('name', { ascending: true });

        if (error) {
          if (!isTableMissingError(error)) throw error;
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) throw err;
      }
    }

    return localDb.categories
      .filter((c) => c.user_id === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  static async findById(id, userId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          if (!isTableMissingError(error)) throw error;
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) throw err;
      }
    }

    return localDb.categories.find((c) => c.id === id && c.user_id === userId) || null;
  }

  static async findByName(userId, name) {
    const normalized = name.toLowerCase().trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
          .ilike('name', normalized)
          .maybeSingle();

        if (error) {
          if (!isTableMissingError(error)) throw error;
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) throw err;
      }
    }

    return localDb.categories.find(
      (c) => c.user_id === userId && c.name.toLowerCase().trim() === normalized
    ) || null;
  }

  static async create({ user_id, name, color = '#6366f1', icon = 'Tag' }) {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([
            {
              user_id,
              name: name.trim(),
              color,
              icon,
              created_at: now,
            },
          ])
          .select()
          .single();

        if (error) {
          if (!isTableMissingError(error)) throw error;
        } else {
          return data;
        }
      } catch (err) {
        if (!isTableMissingError(err)) throw err;
      }
    }

    const newCategory = {
      id: crypto.randomUUID(),
      user_id,
      name: name.trim(),
      color,
      icon,
      created_at: now,
    };

    localDb.categories.push(newCategory);
    return newCategory;
  }

  static async update(id, userId, updates) {
    const allowed = ['name', 'color', 'icon'];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = key === 'name' ? updates[key].trim() : updates[key];
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .update(filtered)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.categories.findIndex((c) => c.id === id && c.user_id === userId);
    if (index === -1) return null;

    localDb.categories[index] = {
      ...localDb.categories[index],
      ...filtered,
    };

    return localDb.categories[index];
  }

  static async delete(id, userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const index = localDb.categories.findIndex((c) => c.id === id && c.user_id === userId);
    if (index === -1) return null;

    const removed = localDb.categories.splice(index, 1)[0];
    return removed;
  }

  static async seedDefaultCategoriesForUser(userId) {
    const categoriesToSeed = [
      { name: 'Food & Dining', color: '#f97316', icon: 'Utensils' },
      { name: 'Snacks & Cafes', color: '#fbbf24', icon: 'Coffee' },
      { name: 'Transportation', color: '#3b82f6', icon: 'Bus' },
      { name: 'Education & Books', color: '#10b981', icon: 'BookOpen' },
      { name: 'Entertainment & Movies', color: '#8b5cf6', icon: 'Film' },
      { name: 'Shopping & Fashion', color: '#ec4899', icon: 'ShoppingBag' },
      { name: 'Gaming & Apps', color: '#06b6d4', icon: 'Gamepad2' },
      { name: 'Subscriptions', color: '#6366f1', icon: 'Tv' },
      { name: 'Mobile & Internet', color: '#14b8a6', icon: 'Smartphone' },
      { name: 'Sports & Fitness', color: '#84cc16', icon: 'Activity' },
      { name: 'Gifts & Charity', color: '#f43f5e', icon: 'Gift' },
      { name: 'Other', color: '#64748b', icon: 'MoreHorizontal' },
    ];

    const results = [];
    for (const cat of categoriesToSeed) {
      const created = await CategoryModel.create({
        user_id: userId,
        ...cat,
      });
      results.push(created);
    }
    return results;
  }
}

module.exports = CategoryModel;
