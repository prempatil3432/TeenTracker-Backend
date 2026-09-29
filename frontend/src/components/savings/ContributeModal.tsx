import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { savingsService } from '../../services/savingsService';
import { SavingsGoal } from '../../types';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isCompleted: boolean) => void;
  goal: SavingsGoal | null;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  goal,
}) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      const res = await savingsService.contribute(goal.id, val);

      if (res.isCompleted) {
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      onSuccess(res.isCompleted);
      setAmount('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add contribution');
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add to "${goal.name}"`}
      description={`Currently saved: ${user?.currency || '₹'}${goal.current_amount.toLocaleString()} of ${user?.currency || '₹'}${goal.target_amount.toLocaleString()}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <Input
          label={`Amount to Deposit (${user?.currency || '₹'})`}
          type="number"
          step="0.01"
          min="1"
          required
          autoFocus
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          helperText={`Remaining needed: ${user?.currency || '₹'}${remaining.toLocaleString()}`}
        />

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {[100, 250, 500, 1000].map((quick) => (
            <button
              key={quick}
              type="button"
              onClick={() => setAmount(String(quick))}
              className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              +{user?.currency || '₹'}{quick}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Add Money 💰
          </Button>
        </div>
      </form>
    </Modal>
  );
};
