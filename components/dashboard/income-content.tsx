'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateDMY } from '@/lib/utils/formatting';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import IncomeForm from './income-form';

interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
}

interface IncomeContentProps {
  initialIncome: Income[];
  userId: string;
}

export default function IncomeContent({ initialIncome, userId }: IncomeContentProps) {
  const [income, setIncome] = useState(initialIncome);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    await supabase.from('income').delete().eq('id', id);
    setIncome(income.filter((item) => item.id !== id));
  };

  const handleAddSuccess = (newIncome: Income) => {
    if (editingId) {
      setIncome(income.map((item) => (item.id === editingId ? newIncome : item)));
      setEditingId(null);
    } else {
      setIncome([newIncome, ...income]);
    }
    setShowForm(false);
  };

  const editingIncome = editingId ? income.find((item) => item.id === editingId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Income</h1>
          <p className="text-muted-foreground mt-1">Track all your income sources</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Add Income
        </Button>
      </div>

      {showForm && (
        <IncomeForm
          userId={userId}
          initialData={editingIncome}
          onSuccess={handleAddSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          {income.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Source</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {income.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{formatDateDMY(item.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{item.source}</td>
                      <td className="py-3 px-4 text-sm text-right text-emerald-600 font-semibold">
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
              No income records yet. Add one to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
