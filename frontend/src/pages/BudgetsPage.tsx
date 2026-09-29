import React, { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { Budget } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { Plus, Edit2, Trash2, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currency = user?.currency || '₹';

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      showToast('Failed to load budgets', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;
    try {
      setIsDeleting(true);
      await budgetService.deleteBudget(budgetToDelete.id);
      showToast('Budget deleted', 'success');
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (err) {
      showToast('Failed to delete budget', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Category Budgets 📊
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set spending boundaries so you don't run out of pocket money before the month ends!
          </p>
        </div>

        <Button
          onClick={() => {
            setBudgetToEdit(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Budget
        </Button>
      </div>

      {/* Overview Card */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-200 font-bold">Total Budgeted</p>
            <h3 className="text-2xl font-black mt-1">
              {currency}{totalBudgeted.toLocaleString()}
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-200 font-bold">Total Spent</p>
            <h3 className="text-2xl font-black mt-1">
              {currency}{totalSpent.toLocaleString()}
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-brand-200 font-bold">Overall Status</p>
            <h3 className="text-2xl font-black mt-1">
              {totalBudgeted > 0 ? `${Math.round((totalSpent / totalBudgeted) * 100)}% Used` : 'No Limits'}
            </h3>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Spinner size="lg" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
          <EmptyState
            icon={<PieChart className="w-8 h-8 text-brand-500" />}
            title="No budgets created yet"
            description="Create your first category budget for food, snacks, or entertainment to stay on track."
            actionText="Create Budget"
            onAction={() => {
              setBudgetToEdit(null);
              setIsModalOpen(true);
            }}
            actionIcon={<Plus className="w-4 h-4" />}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const percentage = b.percentage || 0;
            const isOver = percentage > 100;
            const isWarning = percentage >= 80 && !isOver;
            const isCaution = percentage >= 60 && percentage < 80;

            const progressColor = isOver
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-orange-500'
              : isCaution
              ? 'bg-amber-400'
              : 'bg-emerald-500';

            const statusText = isOver
              ? 'Over Budget'
              : isWarning
              ? 'Near Limit (80%+)'
              : isCaution
              ? 'Caution (60%+)'
              : 'On Track (0-60%)';

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: b.category?.color || '#6366f1' }}
                      />
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {b.category?.name || 'Category'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setBudgetToEdit(b);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                        title="Edit budget"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBudgetToDelete(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Delete budget"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {currency}{(b.spent || 0).toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      of {currency}{Number(b.amount).toLocaleString()} limit
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>

                  {/* Text indicator for accessibility */}
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-500 dark:text-slate-400">
                      {percentage}% used
                    </span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isOver
                          ? 'text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'text-orange-500'
                          : isCaution
                          ? 'text-amber-500'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isOver ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Footer remaining notice */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {isOver ? (
                    <span className="text-rose-500 font-bold">
                      Exceeded budget by {currency}{Math.abs(b.remaining || 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      {currency}{(b.remaining || 0).toLocaleString()} remaining this month
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budgetToEdit={budgetToEdit}
        onSuccess={() => {
          showToast(
            budgetToEdit ? 'Budget updated successfully!' : 'New budget created!',
            'success'
          );
          fetchBudgets();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={handleDeleteBudget}
        title="Delete Budget"
        message={`Are you sure you want to remove the budget for "${budgetToDelete?.category?.name}"?`}
        confirmText="Delete Budget"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
