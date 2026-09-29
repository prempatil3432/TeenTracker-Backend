import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';
import { Category, Budget } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetToEdit?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  budgetToEdit,
}) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      categoryService
        .getCategories()
        .then((cats) => {
          setCategories(cats);
          if (!budgetToEdit && cats.length > 0) {
            setCategoryId(cats[0].id);
          }
        })
        .catch(console.error);

      if (budgetToEdit) {
        setCategoryId(budgetToEdit.category_id);
        setAmount(String(budgetToEdit.amount));
        setPeriod(budgetToEdit.period);
      } else {
        setAmount('');
        setPeriod('monthly');
      }
      setError(null);
    }
  }, [isOpen, budgetToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    try {
      setIsLoading(true);
      if (budgetToEdit) {
        await budgetService.updateBudget(budgetToEdit.id, {
          amount: parsed,
          period,
        });
      } else {
        await budgetService.createBudget({
          category_id: categoryId,
          amount: parsed,
          period,
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={budgetToEdit ? 'Edit Budget' : 'Set Category Budget'}
      description="Define spending limits to keep your money on target."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {!budgetToEdit && (
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}

        <Input
          label={`Budget Limit (${user?.currency || '₹'})`}
          type="number"
          step="0.01"
          min="1"
          required
          placeholder="e.g. 2000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Select
          label="Budget Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {budgetToEdit ? 'Save Budget' : 'Create Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
