'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateDMY } from '@/lib/utils/formatting';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import SavingsForm from './savings-form';

interface Saving {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface SavingsContentProps {
  initialSavings: Saving[];
  userId: string;
}

export default function SavingsContent({ initialSavings, userId }: SavingsContentProps) {
  const [savings, setSavings] = useState(initialSavings);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    await supabase.from('savings').delete().eq('id', id);
    setSavings(savings.filter((item) => item.id !== id));
  };

  const handleAddSuccess = (newSaving: Saving) => {
    if (editingId) {
      setSavings(savings.map((item) => (item.id === editingId ? newSaving : item)));
      setEditingId(null);
    } else {
      setSavings([newSaving, ...savings]);
    }
    setShowForm(false);
  };

  const editingSaving = editingId ? savings.find((item) => item.id === editingId) : null;
  const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Savings</h1>
          <p className="text-muted-foreground mt-1">Build and track your savings</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Add Saving
        </Button>
      </div>

      {showForm && (
        <SavingsForm
          userId={userId}
          initialData={editingSaving}
          onSuccess={handleAddSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalSavings)}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saving Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{savings.length}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(savings.length > 0 ? totalSavings / savings.length : 0)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Savings Records</CardTitle>
        </CardHeader>
        <CardContent>
          {savings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Goal Name</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savings.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{formatDateDMY(item.date)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-right text-blue-600 font-semibold">
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
              No savings recorded yet. Start building your savings!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
