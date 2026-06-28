'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatting';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

interface AnalyticsContentProps {
  income: Income[];
  expenses: Expense[];
  savings: Saving[];
  loans: Loan[];
}

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

export default function AnalyticsContent({
  income,
  expenses,
  savings,
  loans,
}: AnalyticsContentProps) {
  // Monthly analysis
  const monthlyData = useMemo(() => {
    const monthMap: Record<string, { income: number; expenses: number }> = {};

    income.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
      monthMap[key].income += item.amount;
    });

    expenses.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
      monthMap[key].expenses += item.amount;
    });

    return Object.entries(monthMap)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort();
  }, [income, expenses]);

  // Income by source
  const incomeBySource = useMemo(() => {
    const sourceMap: Record<string, number> = {};
    income.forEach((item) => {
      sourceMap[item.source] = (sourceMap[item.source] || 0) + item.amount;
    });

    return Object.entries(sourceMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [income]);

  // Expense by category
  const expenseByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    expenses.forEach((item) => {
      categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Summary statistics
  const stats = useMemo(() => {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0);
    const totalLoans = loans.reduce((sum, item) => sum + item.principal, 0);

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      totalLoans,
      averageMonthlyIncome: monthlyData.length > 0 ? totalIncome / monthlyData.length : 0,
      averageMonthlyExpenses: monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0,
    };
  }, [income, expenses, savings, loans, monthlyData]);

  const summaryData = [
    { name: 'Income', value: stats.totalIncome },
    { name: 'Expenses', value: stats.totalExpenses },
    { name: 'Savings', value: stats.totalSavings },
    { name: 'Loans', value: stats.totalLoans },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive financial analysis</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {formatCurrency(stats.totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(stats.totalSavings)}
            </p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {formatCurrency(stats.totalLoans)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Source */}
        {incomeBySource.length > 0 && (
          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle>Income by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Expense by Category */}
        {expenseByCategory.length > 0 && (
          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Overview */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Monthly Income', value: stats.averageMonthlyIncome, color: 'emerald' },
              { label: 'Avg Monthly Expenses', value: stats.averageMonthlyExpenses, color: 'red' },
              {
                label: 'Savings Ratio',
                value: stats.totalIncome > 0 ? ((stats.totalSavings / stats.totalIncome) * 100).toFixed(1) + '%' : '0%',
                color: 'blue',
              },
              {
                label: 'Expense Ratio',
                value: stats.totalIncome > 0 ? ((stats.totalExpenses / stats.totalIncome) * 100).toFixed(1) + '%' : '0%',
                color: 'orange',
              },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600`}>
                  {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
