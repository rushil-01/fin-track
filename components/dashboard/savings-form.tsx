'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SavingsFormProps {
  userId: string;
  initialData?: {
    id: string;
    name: string;
    amount: number;
    date: string;
  } | null;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function SavingsForm({ userId, initialData, onSuccess, onCancel }: SavingsFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
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
          .from('savings')
          .update({
            name: formData.name,
            amount: parseFloat(formData.amount),
            date: formData.date,
          })
          .eq('id', initialData.id)
          .select()
          .single();

        if (error) {
          console.error('Savings update error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to update savings');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('savings')
          .insert({
            user_id: userId,
            name: formData.name,
            amount: parseFloat(formData.amount),
            date: formData.date,
          })
          .select()
          .single();

        if (error) {
          console.error('Savings insert error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to save savings');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      }
    } catch (err) {
      console.error('Unexpected error saving savings:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Saving' : 'Add New Saving'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Goal Name</label>
            <Input
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, Car"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
