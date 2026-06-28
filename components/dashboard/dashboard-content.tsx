'use client';

import { useState, useMemo } from 'react';
import {
  formatCurrency,
  formatMonthYear,
  getMonthYear,
} from '@/lib/utils/formatting';
import { filterByMonth, sumAmounts, calculateCompoundInterest, calculateSimpleInterest } from '@/lib/utils/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SummaryCard from './summary-card';
import InsightsSection from './insights-section';

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface Saving {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface Loan {
  id: string;
  name: string;
  principal: number;
  rate: number;
  tenure: number;
  loan_type: 'simple' | 'compound';
  start_date: string;
}

interface DashboardContentProps {
  initialIncome: Income[];
  initialExpenses: Expense[];
  initialSavings: Saving[];
  initialLoans: Loan[];
}

export default function DashboardContent({
  initialIncome,
  initialExpenses,
  initialSavings,
  initialLoans,
}: DashboardContentProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  // Filter data by selected month
  const monthlyIncome = useMemo(
    () => filterByMonth(initialIncome, month, year),
    [initialIncome, month, year]
  );

  const monthlyExpenses = useMemo(
    () => filterByMonth(initialExpenses, month, year),
    [initialExpenses, month, year]
  );

  const monthlySavings = useMemo(
    () => filterByMonth(initialSavings, month, year),
    [initialSavings, month, year]
  );

  // Calculate totals
  const totalIncome = useMemo(() => sumAmounts(monthlyIncome), [monthlyIncome]);
  const totalExpenses = useMemo(() => sumAmounts(monthlyExpenses), [monthlyExpenses]);
  const totalSavings = useMemo(() => sumAmounts(monthlySavings), [monthlySavings]);

  // Calculate loan amounts
  const totalLoans = useMemo(() => {
    return sumAmounts(
      initialLoans.map((loan) => {
        const result =
          loan.loan_type === 'simple'
            ? calculateSimpleInterest(loan.principal, loan.rate, loan.tenure)
            : calculateCompoundInterest(loan.principal, loan.rate, loan.tenure);
        return { amount: result.total };
      })
    );
  }, [initialLoans]);

  // Calculate remaining balance
  const remainingBalance = useMemo(
    () => totalIncome - totalExpenses - totalSavings,
    [totalIncome, totalExpenses, totalSavings]
  );

  // Navigate months
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  return (
    <div className="space-y-8">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your financial overview</p>
        </div>

        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            className="p-2"
          >
            <ChevronLeft size={18} />
          </Button>
          <div className="min-w-48 text-center">
            <p className="text-lg font-semibold">{formatMonthYear(month, year)}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="p-2"
          >
            <ChevronRight size={18} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToday}
            className="ml-4"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Income"
          amount={totalIncome}
          color="from-emerald-400 to-teal-400"
        />
        <SummaryCard
          title="Expenses"
          amount={totalExpenses}
          color="from-red-400 to-pink-400"
        />
        <SummaryCard
          title="Savings"
          amount={totalSavings}
          color="from-blue-400 to-cyan-400"
        />
        <SummaryCard
          title="Loans"
          amount={totalLoans}
          color="from-orange-400 to-amber-400"
        />
        <SummaryCard
          title="Remaining Balance"
          amount={remainingBalance}
          color={remainingBalance >= 0 ? "from-emerald-400 to-teal-400" : "from-red-400 to-pink-400"}
        />
      </div>

      {/* Insights Section */}
      <InsightsSection
        expenses={monthlyExpenses}
        income={monthlyIncome}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />
    </div>
  );
}
