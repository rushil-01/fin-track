'use server'

import { Suspense } from 'react'
import AnalyticsContent from '@/components/dashboard/analytics-content'
import { createClient } from '@/lib/supabase/server'
import AnalyticsLoading from './loading'

async function fetchRows<T>(queryPromise: Promise<{ data: T[] | null; error: unknown }>) {
  const result = await Promise.race([
    queryPromise,
    new Promise<{ data: T[] | null; error: unknown }>((resolve) => {
      setTimeout(() => resolve({ data: [], error: null }), 1800)
    }),
  ])

  return (result?.data ?? []) as T[]
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="p-8">
        <AnalyticsContent income={[]} expenses={[]} savings={[]} loans={[]} />
      </div>
    )
  }

  const [incomeData, expensesData, savingsData, loansData] = await Promise.all([
    fetchRows<any>(supabase.from('income').select('*').order('date', { ascending: false })),
    fetchRows<any>(supabase.from('expenses').select('*').order('date', { ascending: false })),
    fetchRows<any>(supabase.from('savings').select('*').order('date', { ascending: false })),
    fetchRows<any>(supabase.from('loans').select('*').order('start_date', { ascending: false })),
  ])

  const income = (incomeData ?? []).map((r: any) => ({
    id: String(r.id),
    source: r.source ?? r.description ?? 'Income',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }))

  const expenses = (expensesData ?? []).map((r: any) => ({
    id: String(r.id),
    category: r.category ?? 'Other',
    description: r.description ?? '',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }))

  const savings = (savingsData ?? []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? r.description ?? 'Saving',
    amount: Number(r.amount) || 0,
    date: r.date || r.created_at || null,
  }))

  const loans = (loansData ?? []).map((r: any) => ({
    id: String(r.id),
    name: r.name ?? r.description ?? 'Loan',
    principal: Number(r.principal) || 0,
    rate: Number(r.rate) || 0,
    tenure: Number(r.tenure) || 0,
    loan_type: r.loan_type ?? 'simple',
    start_date: r.start_date || null,
  }))

  return (
    <div className="p-8">
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsContent income={income} expenses={expenses} savings={savings} loans={loans} />
      </Suspense>
    </div>
  )
}
