import React, { useState, useEffect, useCallback } from 'react';
import { savingsService } from '../services/savingsService';
import { SavingsGoal } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SavingsModal } from '../components/savings/SavingsModal';
import { ContributeModal } from '../components/savings/ContributeModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import {
  Target,
  Plus,
  Coins,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const SavingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currency = user?.currency || '₹';

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
  const [goalToContribute, setGoalToContribute] = useState<SavingsGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await savingsService.getGoals();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching savings goals:', err);
      showToast('Failed to load savings goals', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;
    try {
      setIsDeleting(true);
      await savingsService.deleteGoal(goalToDelete.id);
      showToast('Savings goal deleted', 'success');
      setGoalToDelete(null);
      fetchGoals();
    } catch (err) {
      showToast('Failed to delete goal', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0);
  const completedGoalsCount = goals.filter((g) => Number(g.current_amount) >= Number(g.target_amount)).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Savings Goals 🎯
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stack your cash, achieve your wishlist, and build financial habits early!
          </p>
        </div>

        <Button
          onClick={() => {
            setGoalToEdit(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Goal
        </Button>
      </div>

      {/* Hero Overview */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Total Money Saved</p>
            <h3 className="text-2xl font-black mt-1">
              {currency}{totalSaved.toLocaleString()}
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Total Target Wishlist</p>
            <h3 className="text-2xl font-black mt-1">
              {currency}{totalTarget.toLocaleString()}
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Completed Goals</p>
            <h3 className="text-2xl font-black mt-1 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-300" />
              <span>{completedGoalsCount} Goals Unlocked</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size="lg" />
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
          <EmptyState
            icon={<Target className="w-8 h-8 text-brand-500" />}
            title="No savings goals yet"
            description="Whether it is noise-canceling headphones, gaming gear, or emergency savings, set a goal and start saving today!"
            actionText="Create Your First Goal"
            onAction={() => {
              setGoalToEdit(null);
              setIsModalOpen(true);
            }}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const current = Number(goal.current_amount || 0);
            const target = Number(goal.target_amount);
            const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            const remaining = Math.max(0, target - current);
            const isCompleted = current >= target;

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {goal.name}
                        </h3>
                        {goal.target_date && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Target: {goal.target_date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setGoalToEdit(goal);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                        title="Edit goal"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-3 leading-relaxed">
                      {goal.description}
                    </p>
                  )}

                  {/* Amounts */}
                  <div className="mt-4 flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {currency}{current.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Target: {currency}{target.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-brand-600 to-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-brand-600 dark:text-brand-400 font-bold">
                      {percentage}% achieved
                    </span>
                    {isCompleted ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" /> Goal Complete!
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        {currency}{remaining.toLocaleString()} left to save
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant={isCompleted ? 'secondary' : 'primary'}
                    className="w-full text-xs"
                    onClick={() => setGoalToContribute(goal)}
                    leftIcon={<Coins className="w-4 h-4" />}
                  >
                    {isCompleted ? 'Add More Savings' : 'Deposit Money 💰'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <SavingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
        onSuccess={() => {
          showToast(
            goalToEdit ? 'Savings goal updated!' : 'Savings goal created! 🎯',
            'success'
          );
          fetchGoals();
        }}
      />

      {/* Deposit Money Modal */}
      <ContributeModal
        isOpen={Boolean(goalToContribute)}
        onClose={() => setGoalToContribute(null)}
        goal={goalToContribute}
        onSuccess={(isComplete: boolean) => {
          showToast(
            isComplete ? '🎉 CONGRATS! You reached your savings goal!' : 'Deposit recorded! 💰',
            'success'
          );
          fetchGoals();
        }}
      />

      {/* Delete Goal Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleDeleteGoal}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete "${goalToDelete?.name}"?`}
        confirmText="Delete Goal"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
