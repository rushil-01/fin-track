'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ExpenseFormProps {
  userId: string;
  categories: string[];
  initialData?: {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
  } | null;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  userId,
  categories,
  initialData,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (initialData) {
        const { data, error } = await supabase
          .from('expenses')
          .update({
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            date: formData.date,
          })
          .eq('id', initialData.id)
          .select()
          .single();

        if (error) {
          console.error('Expense update error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to update expense');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            user_id: userId,
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            date: formData.date,
          })
          .select()
          .single();

        if (error) {
          console.error('Expense insert error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to save expense');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      }
    } catch (err) {
      console.error('Unexpected error saving expense:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-input rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              type="text"
              placeholder="Enter expense description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (₹)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date (YYYY-MM-DD)</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-600 pt-2">{errorMessage}</div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
