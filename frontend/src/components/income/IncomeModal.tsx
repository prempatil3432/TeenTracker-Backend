import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { incomeService } from '../../services/incomeService';
import { Income } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  incomeToEdit?: Income | null;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  incomeToEdit,
}) => {
  const { user } = useAuth();
  const [source, setSource] = useState('Monthly Allowance');
  const [amount, setAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (incomeToEdit) {
        setSource(incomeToEdit.source);
        setAmount(String(incomeToEdit.amount));
        setIncomeDate(incomeToEdit.income_date);
        setDescription(incomeToEdit.description || '');
      } else {
        setSource('Monthly Allowance');
        setAmount('');
        setIncomeDate(new Date().toISOString().split('T')[0]);
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, incomeToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        source,
        amount: parsed,
        income_date: incomeDate,
        description: description.trim() || undefined,
      };

      if (incomeToEdit) {
        await incomeService.updateIncome(incomeToEdit.id, payload);
      } else {
        await incomeService.createIncome(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save income');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={incomeToEdit ? 'Edit Income' : 'Log Income / Allowance'}
      description="Record allowance, gifts, or earnings to calculate your true remaining balance."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Income Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="Monthly Allowance">Monthly Allowance</option>
            <option value="Part-time Job">Part-time Job</option>
            <option value="Gifts">Gifts / Birthday</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Chores & Yard Work">Chores & Yard Work</option>
            <option value="Freelance / Digital">Freelance / Digital</option>
            <option value="Other Income">Other Income</option>
          </Select>

          <Input
            label={`Amount (${user?.currency || '₹'})`}
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Input
          label="Date Received"
          type="date"
          required
          value={incomeDate}
          onChange={(e) => setIncomeDate(e.target.value)}
        />

        <Input
          label="Description / Note (Optional)"
          placeholder="e.g. From mom and dad, Saturday babysitting"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {incomeToEdit ? 'Save Changes' : 'Log Income'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
