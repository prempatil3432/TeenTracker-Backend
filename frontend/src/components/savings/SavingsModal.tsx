import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { savingsService } from '../../services/savingsService';
import { SavingsGoal } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goalToEdit?: SavingsGoal | null;
}

export const SavingsModal: React.FC<SavingsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  goalToEdit,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (goalToEdit) {
        setName(goalToEdit.name);
        setTargetAmount(String(goalToEdit.target_amount));
        setCurrentAmount(String(goalToEdit.current_amount || 0));
        setTargetDate(goalToEdit.target_date || '');
        setDescription(goalToEdit.description || '');
      } else {
        setName('');
        setTargetAmount('');
        setCurrentAmount('0');
        setTargetDate('');
        setDescription('');
      }
      setError(null);
    }
  }, [isOpen, goalToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount || '0');

    if (!name.trim()) {
      setError('Please provide a name for your savings goal');
      return;
    }
    if (isNaN(target) || target <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name: name.trim(),
        target_amount: target,
        current_amount: current,
        target_date: targetDate || undefined,
        description: description.trim() || undefined,
      };

      if (goalToEdit) {
        await savingsService.updateGoal(goalToEdit.id, payload);
      } else {
        await savingsService.createGoal(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save savings goal';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Edit Savings Goal' : 'Create New Savings Goal'}
      description="Pick something you really want and watch your progress grow!"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <Input
          label="Goal Name"
          placeholder="e.g. New Headphones, Bike, College Fund"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Target Amount (${user?.currency || '₹'})`}
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="e.g. 10000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <Input
            label={`Starting Savings (${user?.currency || '₹'})`}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        </div>

        <Input
          label="Target Date (Optional)"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />

        <Input
          label="Why are you saving for this? (Optional)"
          placeholder="e.g. For music production and study sessions"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {goalToEdit ? 'Save Changes' : 'Start Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
