'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateSimpleInterest, calculateCompoundInterest } from '@/lib/utils/calculations';
import { formatCurrency } from '@/lib/utils/formatting';

interface LoansFormProps {
  userId: string;
  initialData?: {
    id: string;
    name: string;
    principal: number;
    rate: number;
    tenure: number;
    loan_type: 'simple' | 'compound';
    start_date: string;
  } | null;
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export default function LoansForm({ userId, initialData, onSuccess, onCancel }: LoansFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    principal: initialData?.principal?.toString() || '',
    rate: initialData?.rate?.toString() || '',
    tenure: initialData?.tenure?.toString() || '',
    loan_type: initialData?.loan_type || 'simple',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  const principal = parseFloat(formData.principal) || 0;
  const rate = parseFloat(formData.rate) || 0;
  const tenure = parseFloat(formData.tenure) || 0;

  const interest = formData.loan_type === 'simple'
    ? calculateSimpleInterest(principal, rate, tenure).interest
    : calculateCompoundInterest(principal, rate, tenure).interest;

  const totalAmount = principal + interest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (initialData) {
        const { data, error } = await supabase
          .from('loans')
          .update({
            name: formData.name,
            principal: parseFloat(formData.principal),
            rate: parseFloat(formData.rate),
            tenure: parseInt(formData.tenure),
            loan_type: formData.loan_type,
            start_date: formData.start_date,
          })
          .eq('id', initialData.id)
          .select()
          .single();

        if (error) {
          console.error('Loans update error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to update loan');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      } else {
        const { data, error } = await supabase
          .from('loans')
          .insert({
            user_id: userId,
            name: formData.name,
            principal: parseFloat(formData.principal),
            rate: parseFloat(formData.rate),
            tenure: parseInt(formData.tenure),
            loan_type: formData.loan_type,
            start_date: formData.start_date,
          })
          .select()
          .single();

        if (error) {
          console.error('Loans insert error:', error);
          const msg = error?.message || (typeof error === 'string' ? error : 'Failed to save loan');
          setErrorMessage(msg);
          return;
        }
        onSuccess(data);
      }
    } catch (err) {
      console.error('Unexpected error saving loan:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-lg">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Loan' : 'Add New Loan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Loan Name</label>
            <Input
              type="text"
              placeholder="e.g., Home Loan, Car Loan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Principal Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter principal"
                step="0.01"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rate (% per year)</label>
              <Input
                type="number"
                placeholder="Enter rate"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tenure (years)</label>
              <Input
                type="number"
                placeholder="Enter tenure"
                step="1"
                value={formData.tenure}
                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loan Type</label>
              <select
                value={formData.loan_type}
                onChange={(e) => setFormData({ ...formData, loan_type: e.target.value as 'simple' | 'compound' })}
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="simple">Simple Interest</option>
                <option value="compound">Compound Interest</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date (YYYY-MM-DD)</label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>

          {/* Loan Calculation Summary */}
          {principal > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Calculation Preview</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Principal Amount:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Interest Amount:</span>
                <span className="font-medium text-red-600">{formatCurrency(interest)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-semibold">
                <span>Total Amount:</span>
                <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}

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
