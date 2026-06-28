'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatting';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

interface InsightsSectionProps {
  expenses: Expense[];
  income: Income[];
  totalIncome: number;
  totalExpenses: number;
}

const EXPENSE_COLORS = {
  Food: '#FF6B6B',
  Travel: '#4ECDC4',
  Shopping: '#FFE66D',
  Education: '#95E1D3',
  Bills: '#F38181',
  Entertainment: '#AA96DA',
  Others: '#FCBAD3',
};

export default function InsightsSection({
  expenses,
  income,
  totalIncome,
  totalExpenses,
}: InsightsSectionProps) {
  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {};

    expenses.forEach((expense) => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });

    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Prepare comparison data
  const comparisonData = useMemo(
    () => [
      { name: 'Income', amount: totalIncome },
      { name: 'Expenses', amount: totalExpenses },
    ],
    [totalIncome, totalExpenses]
  );

  // Top expense categories
  const topExpenses = useMemo(
    () => expensesByCategory.slice(0, 5),
    [expensesByCategory]
  );

  // Calculate percentage spent
  const percentageSpent = useMemo(
    () => (totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0),
    [totalIncome, totalExpenses]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Distribution */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={EXPENSE_COLORS[entry.name as keyof typeof EXPENSE_COLORS] || '#999'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No expenses recorded
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income vs Expenses */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending Stats */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Spending Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Spending Rate</span>
              <span className="font-semibold">{percentageSpent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              />
            </div>
          </div>

          {topExpenses.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Top Expenses</h4>
              {topExpenses.map((category) => (
                <div key={category.name} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                  <span className="font-medium">{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Daily Spend</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalExpenses / 30)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Daily Income</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalIncome / 30)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
