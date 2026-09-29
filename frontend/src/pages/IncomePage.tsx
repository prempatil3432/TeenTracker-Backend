import React, { useState, useEffect, useCallback } from 'react';
import { incomeService } from '../services/incomeService';
import { expenseService } from '../services/expenseService';
import { Income, Expense } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IncomeModal } from '../components/income/IncomeModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import {
  Wallet,
  Plus,
  Download,
  Edit2,
  Trash2,
  TrendingUp,
  Gift,
  Briefcase,
  DollarSign,
} from 'lucide-react';

export const IncomePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currency = user?.currency || '₹';

  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchIncomeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        incomeService.getIncomeList(),
        expenseService.getExpenses({ limit: 100 }),
      ]);

      setIncomeList(incomeRes.incomeList);
      setTotalIncome(incomeRes.totalIncome);

      const expSum = expenseRes.expenses.reduce((s: number, e: Expense) => s + Number(e.amount), 0);
      setTotalExpenses(expSum);
    } catch (err) {
      console.error('Error fetching income data:', err);
      showToast('Failed to load income records', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const blob = await incomeService.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teenspend-income-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Income history exported to CSV! 📄', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;
    try {
      setIsDeleting(true);
      await incomeService.deleteIncome(incomeToDelete.id);
      showToast('Income record removed', 'success');
      setIncomeToDelete(null);
      fetchIncomeData();
    } catch (err) {
      showToast('Failed to delete income', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const remaining = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0;

  const getSourceIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('allowance')) return <Wallet className="w-4 h-4 text-emerald-500" />;
    if (s.includes('gift')) return <Gift className="w-4 h-4 text-rose-500" />;
    if (s.includes('job') || s.includes('tutoring') || s.includes('freelance'))
      return <Briefcase className="w-4 h-4 text-brand-500" />;
    return <DollarSign className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Income & Allowance 💵
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track monthly pocket money, side-hustles, and gifts in one spot.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            isLoading={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            onClick={() => {
              setIncomeToEdit(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Log Income
          </Button>
        </div>
      </div>

      {/* Financial Health Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Income</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {currency}{totalIncome.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">From all tracked sources</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Expenses</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {currency}{totalExpenses.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Money spent this period</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Net Remaining</p>
          <h3 className={`text-2xl font-black mt-1 ${remaining >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-rose-500'}`}>
            {currency}{remaining.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Income minus expenses</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Savings Rate</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-1">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <span>{savingsRate}%</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Percentage of income kept</p>
        </div>
      </div>

      {/* Income Records List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Income Stream History</h3>
          <span className="text-xs text-slate-400">{incomeList.length} records</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
          </div>
        ) : incomeList.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<Wallet className="w-8 h-8 text-brand-500" />}
              title="No income recorded yet"
              description="Record your monthly allowance or part-time earnings to calculate your available balance."
              actionText="Add Income Entry"
              onAction={() => {
                setIncomeToEdit(null);
                setIsModalOpen(true);
              }}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {incomeList.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getSourceIcon(item.source)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.source}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.income_date} {item.description ? `• ${item.description}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{currency}{Number(item.amount).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIncomeToEdit(item);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                      title="Edit income"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIncomeToDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete income"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Income Modal */}
      <IncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incomeToEdit={incomeToEdit}
        onSuccess={() => {
          showToast(
            incomeToEdit ? 'Income record updated!' : 'Income logged successfully! 💵',
            'success'
          );
          fetchIncomeData();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={Boolean(incomeToDelete)}
        onClose={() => setIncomeToDelete(null)}
        onConfirm={handleDeleteIncome}
        title="Delete Income Record"
        message={`Are you sure you want to remove the income entry for "${incomeToDelete?.source}" (${currency}${incomeToDelete?.amount})?`}
        confirmText="Delete Income"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
