'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateDMY } from '@/lib/utils/formatting';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import ExpenseForm from './expense-form';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesContentProps {
  initialExpenses: Expense[];
  userId: string;
}

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Bills', 'Entertainment', 'Others'];

export default function ExpensesContent({ initialExpenses, userId }: ExpensesContentProps) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id);
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const handleAddSuccess = (newExpense: Expense) => {
    if (editingId) {
      setExpenses(expenses.map((item) => (item.id === editingId ? newExpense : item)));
      setEditingId(null);
    } else {
      setExpenses([newExpense, ...expenses]);
    }
    setShowForm(false);
  };

  const editingExpense = editingId ? expenses.find((item) => item.id === editingId) : null;

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Food: 'bg-red-100 text-red-800',
      Travel: 'bg-blue-100 text-blue-800',
      Shopping: 'bg-yellow-100 text-yellow-800',
      Education: 'bg-green-100 text-green-800',
      Bills: 'bg-pink-100 text-pink-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Others: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and manage your spending</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Add Expense
        </Button>
      </div>

      {showForm && (
        <ExpenseForm
          userId={userId}
          categories={EXPENSE_CATEGORIES}
          initialData={editingExpense}
          onSuccess={handleAddSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{formatDateDMY(item.date)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{item.description}</td>
                      <td className="py-3 px-4 text-sm text-right text-red-600 font-semibold">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(item.id);
                              setShowForm(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No expenses recorded yet. Add one to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
