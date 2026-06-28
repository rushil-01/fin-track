'use client'

import { useEffect, useState } from 'react';
import IncomeContent from '@/components/dashboard/income-content';
import { createClient } from '@/lib/supabase/client';
import { demoGetUser } from '@/lib/demo-auth';

export default function IncomePage() {
  const [userId, setUserId] = useState('');
  const [income, setIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      try {
        const { data: userData } = await supabase.auth.getUser();
        let currentUserId = '';
        
        if (userData?.user?.id) {
          currentUserId = userData.user.id;
          setUserId(currentUserId);
          
          // Fetch income for this user
          const { data: incomeData, error } = await supabase
            .from('income')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });
          
          if (!error && incomeData) {
            setIncome(incomeData);
          }
        } else {
          // Fallback to demo user
          const demoUser = demoGetUser();
          setUserId(demoUser?.id || '');
        }
      } catch (error) {
        console.error('Error loading income:', error);
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
      <IncomeContent initialIncome={income} userId={userId} />
    </div>
  );
}
