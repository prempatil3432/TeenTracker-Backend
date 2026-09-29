import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { Category, Expense } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expenseToEdit?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expenseToEdit,
}) => {
  const { user } = useAuth();
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

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      categoryService
        .getCategories()
        .then((cats) => {
          setCategories(cats);
          if (!expenseToEdit && cats.length > 0) {
            setCategoryId(cats[0].id);
          }
        })
        .catch(console.error);

      if (expenseToEdit) {
        setAmount(String(expenseToEdit.amount));
        setDescription(expenseToEdit.description);
        setCategoryId(expenseToEdit.category_id || '');
        setExpenseDate(expenseToEdit.expense_date);
        setPaymentMethod(expenseToEdit.payment_method);
        setMerchant(expenseToEdit.merchant || '');
        setNotes(expenseToEdit.notes || '');
      } else {
        // Reset fields
        setAmount('');
        setDescription('');
        setExpenseDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('UPI');
        setMerchant('');
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, expenseToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description for the expense');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        amount: parsedAmount,
        description: description.trim(),
        category_id: categoryId || undefined,
        expense_date: expenseDate,
        payment_method: paymentMethod,
        merchant: merchant.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      if (expenseToEdit) {
        await expenseService.updateExpense(expenseToEdit.id, payload);
      } else {
        await expenseService.createExpense(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.amount || 'Failed to save expense';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense' : 'Log New Expense'}
      description="Keep track of where your pocket money goes."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Amount (${user?.currency || '₹'})`}
            type="number"
            step="0.01"
            min="0.01"
            required
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
          placeholder="e.g. Burger with friends, Spotify, Books"
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
            <option value="UPI">UPI / GPay / Paytm</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Merchant / Place (Optional)"
            placeholder="e.g. McDonald's, Amazon, Subway"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />

          <Input
            label="Notes (Optional)"
            placeholder="e.g. Split with Ryan, reimbursed ₹100"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {expenseToEdit ? 'Save Changes' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
