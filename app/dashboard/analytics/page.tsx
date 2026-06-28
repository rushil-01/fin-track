'use server'

import AnalyticsContent from '@/components/dashboard/analytics-content';
import { createClient } from '@/lib/supabase/server';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: incomeData }, { data: expensesData }, { data: savingsData }, { data: loansData }] =
    await Promise.all([
      supabase.from('income').select('*').order('date', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('savings').select('*').order('date', { ascending: false }),
      supabase.from('loans').select('*').order('start_date', { ascending: false }),
    ]);

  const income = (incomeData ?? []).map((r: any) => ({
    id: String(r.id),
    source: r.source ?? r.description ?? 'Income',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }));

  const expenses = (expensesData ?? []).map((r: any) => ({
    id: String(r.id),
    category: r.category ?? 'Other',
    description: r.description ?? '',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }));

  const savings = (savingsData ?? []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? r.description ?? 'Saving',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }));

  const loans = (loansData ?? []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? r.description ?? 'Loan',
    principal: Number(r.principal) || 0,
    rate: Number(r.rate) || 0,
    tenure: Number(r.tenure) || 0,
    loan_type: r.loan_type ?? 'simple',
    start_date: r.start_date || null,
  }));

  return (
    <div className="p-8">
      <AnalyticsContent
        income={income}
        expenses={expenses}
        savings={savings}
        loans={loans}
      />
    </div>
  );
}
