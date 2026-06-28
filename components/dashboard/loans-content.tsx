'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateDMY } from '@/lib/utils/formatting';
import { calculateSimpleInterest, calculateCompoundInterest } from '@/lib/utils/calculations';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import LoansForm from './loans-form';

interface Loan {
  id: string;
  name: string;
  principal: number;
  rate: number;
  tenure: number;
  loan_type: 'simple' | 'compound';
  start_date: string;
}

interface LoansContentProps {
  initialLoans: Loan[];
  userId: string;
}

export default function LoansContent({ initialLoans, userId }: LoansContentProps) {
  const [loans, setLoans] = useState(initialLoans);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    await supabase.from('loans').delete().eq('id', id);
    setLoans(loans.filter((item) => item.id !== id));
  };

  const handleAddSuccess = (newLoan: Loan) => {
    if (editingId) {
      setLoans(loans.map((item) => (item.id === editingId ? newLoan : item)));
      setEditingId(null);
    } else {
      setLoans([newLoan, ...loans]);
    }
    setShowForm(false);
  };

  const editingLoan = editingId ? loans.find((item) => item.id === editingId) : null;

  const getTotalLoanAmount = (loan: Loan) => {
    const result =
      loan.loan_type === 'simple'
        ? calculateSimpleInterest(loan.principal, loan.rate, loan.tenure)
        : calculateCompoundInterest(loan.principal, loan.rate, loan.tenure);
    return result.total;
  };

  const getTotalInterest = (loan: Loan) => {
    const result =
      loan.loan_type === 'simple'
        ? calculateSimpleInterest(loan.principal, loan.rate, loan.tenure)
        : calculateCompoundInterest(loan.principal, loan.rate, loan.tenure);
    return result.interest;
  };

  const totalAllLoans = loans.reduce((sum, loan) => sum + getTotalLoanAmount(loan), 0);
  const totalInterest = loans.reduce((sum, loan) => sum + getTotalInterest(loan), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Loans</h1>
          <p className="text-muted-foreground mt-1">Track and calculate your loans</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="gap-2"
        >
          <Plus size={20} />
          Add Loan
        </Button>
      </div>

      {showForm && (
        <LoansForm
          userId={userId}
          initialData={editingLoan}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Loan Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(totalAllLoans)}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Interest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalInterest)}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loans.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle>Loans Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Loan Name</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Principal</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Rate (%)</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Total Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Interest</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{formatDateDMY(item.start_date)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-right">{formatCurrency(item.principal)}</td>
                      <td className="py-3 px-4 text-sm text-right">{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.loan_type === 'simple' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {item.loan_type === 'simple' ? 'Simple' : 'Compound'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold">{formatCurrency(getTotalLoanAmount(item))}</td>
                      <td className="py-3 px-4 text-sm text-right text-red-600 font-semibold">{formatCurrency(getTotalInterest(item))}</td>
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
              No loans recorded yet. Track your loans here!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
