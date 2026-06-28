'use client'

import { useEffect, useState } from 'react';
import ExpensesContent from '@/components/dashboard/expenses-content';
import { createClient } from '@/lib/supabase/client';
import { demoGetUser } from '@/lib/demo-auth';

export default function ExpensesPage() {
  const [userId, setUserId] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      try {
        const { data: userData } = await supabase.auth.getUser();
        let currentUserId = '';
        
        if (userData?.user?.id) {
          currentUserId = userData.user.id;
          setUserId(currentUserId);
          
          // Fetch expenses for this user
          const { data: expensesData, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });
          
          if (!error && expensesData) {
            setExpenses(expensesData);
          }
        } else {
          // Fallback to demo user
          const demoUser = demoGetUser();
          setUserId(demoUser?.id || '');
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
        const demoUser = demoGetUser();
        setUserId(demoUser?.id || '');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <ExpensesContent initialExpenses={expenses} userId={userId} categories={categories} />
    </div>
  );
}
