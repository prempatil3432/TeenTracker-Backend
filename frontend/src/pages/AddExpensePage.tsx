import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Plus } from 'lucide-react';

export const AddExpensePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Bank Transfer' | 'Other'>('UPI');
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setIsLoading(true);
      await expenseService.createExpense({
        amount: parsed,
        description: description.trim(),
        category_id: categoryId || undefined,
        expense_date: expenseDate,
        payment_method: paymentMethod,
        merchant: merchant.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      showToast('Expense recorded successfully! 🎉', 'success');
      navigate('/expenses');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/expenses')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Add New Expense 💳
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log today's purchases or pocket money spending.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Amount (${user?.currency || '₹'})`}
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Description"
            placeholder="e.g. Cinema ticket with friends"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              required
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />

            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="UPI">UPI / PhonePe / GPay</option>
              <option value="Cash">Cash</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Merchant / Shop (Optional)"
              placeholder="e.g. Subway, Zara, Steam"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
            />

            <Input
              label="Notes (Optional)"
              placeholder="e.g. Treated Maya for her birthday"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate('/expenses')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} leftIcon={<Plus className="w-4 h-4" />}>
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
