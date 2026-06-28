'use client'

import { useEffect, useState } from 'react';
import LoansContent from '@/components/dashboard/loans-content';
import { createClient } from '@/lib/supabase/client';
import { demoGetUser } from '@/lib/demo-auth';

export default function LoansPage() {
  const [userId, setUserId] = useState('');
  const [loans, setLoans] = useState([]);
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
          
          // Fetch loans for this user
          const { data: loansData, error } = await supabase
            .from('loans')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });
          
          if (!error && loansData) {
            setLoans(loansData);
          }
        } else {
          // Fallback to demo user
          const demoUser = demoGetUser();
          setUserId(demoUser?.id || '');
        }
      } catch (error) {
        console.error('Error loading loans:', error);
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
      <LoansContent initialLoans={loans} userId={userId} />
    </div>
  );
}
