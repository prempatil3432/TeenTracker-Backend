import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ExpenseModal } from '../expenses/ExpenseModal';
import { useToast } from '../../context/ToastContext';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar onOpenAddExpense={() => setIsAddExpenseOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>

      <MobileNav />

      {/* Global Quick Add Expense Modal */}
      <ExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={() => {
          showToast('Expense recorded successfully! 🎉', 'success');
          // Reload page or trigger global refresh
          window.dispatchEvent(new Event('teenspend_refresh_data'));
        }}
      />
    </div>
  );
};
