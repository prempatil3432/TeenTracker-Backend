import React, { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { Expense, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ExpenseFilters } from '../components/expenses/ExpenseFilters';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currency = user?.currency || '₹';

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<{
    search: string;
    category_id: string;
    payment_method: string;
    start_date: string;
    end_date: string;
    min_amount: string;
    max_amount: string;
    sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  }>({
    search: '',
    category_id: '',
    payment_method: '',
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
    sortBy: 'newest',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await expenseService.getExpenses({
        ...filters,
        page,
        limit: 15,
      });
      setExpenses(res.expenses);
      setTotal(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      showToast('Failed to load expenses', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value as any }));
    setPage(1); // Reset to page 1 upon filtering
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      payment_method: '',
      start_date: '',
      end_date: '',
      min_amount: '',
      max_amount: '',
      sortBy: 'newest',
    });
    setPage(1);
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const blob = await expenseService.exportCsv(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teenspend-expenses-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Expenses exported successfully! 📄', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      setIsDeleting(true);
      await expenseService.deleteExpense(expenseToDelete.id);
      showToast('Expense removed', 'success');
      setExpenseToDelete(null);
      fetchExpenses();
    } catch (err) {
      showToast('Failed to delete expense', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Expense Log 🧾
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and search every purchase. Found {total} records.
          </p>
        </div>

        <Button
          onClick={() => {
            setExpenseToEdit(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Expense
        </Button>
      </div>

      {/* Filters Bar */}
      <ExpenseFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onExport={handleExportCsv}
        isExporting={isExporting}
      />

      {/* Expense List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No expenses found"
              description={
                filters.search || filters.category_id
                  ? 'No transactions matched your current search filters.'
                  : 'Start tracking your spending to level up your financial freedom!'
              }
              actionText="Log Your First Expense"
              onAction={() => {
                setExpenseToEdit(null);
                setIsModalOpen(true);
              }}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-400 font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Merchant</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {expenses.map((expense) => {
                    const category = expense.category;
                    return (
                      <tr
                        key={expense.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {expense.expense_date}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                          <div>{expense.description}</div>
                          {expense.notes && (
                            <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">
                              {expense.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: `${category.color}15`,
                                color: category.color,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> Uncategorized
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {expense.merchant || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {expense.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                          {currency}{Number(expense.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setExpenseToEdit(expense);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                              title="Edit expense"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpenseToDelete(expense)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                              title="Delete expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Responsive Layout) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {expenses.map((expense) => {
                const category = expense.category;
                return (
                  <div
                    key={expense.id}
                    className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {expense.description}
                        </h4>
                        <p className="text-xs text-slate-400">{expense.expense_date}</p>
                      </div>
                      <span className="font-black text-base text-slate-900 dark:text-white">
                        {currency}{Number(expense.amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {category ? (
                        <span
                          className="px-2 py-0.5 rounded-full font-semibold text-[11px]"
                          style={{
                            backgroundColor: `${category.color}15`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">Uncategorized</span>
                      )}

                      <span className="text-slate-500 dark:text-slate-400">
                        {expense.payment_method}
                      </span>
                    </div>

                    {expense.merchant && (
                      <p className="text-xs text-slate-400">
                        Merchant: <span className="text-slate-600 dark:text-slate-300">{expense.merchant}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setExpenseToEdit(expense);
                          setIsModalOpen(true);
                        }}
                        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600"
                        onClick={() => setExpenseToDelete(expense)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={expenseToEdit}
        onSuccess={() => {
          showToast(
            expenseToEdit ? 'Expense updated successfully! ✏️' : 'Expense recorded! 🚀',
            'success'
          );
          fetchExpenses();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.description}"? This cannot be undone.`}
        confirmText="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
