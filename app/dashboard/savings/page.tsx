'use client'

import { useEffect, useState } from 'react';
import SavingsContent from '@/components/dashboard/savings-content';
import { createClient } from '@/lib/supabase/client';
import { demoGetUser } from '@/lib/demo-auth';

export default function SavingsPage() {
  const [userId, setUserId] = useState('');
  const [savings, setSavings] = useState([]);
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
          
          // Fetch savings for this user
          const { data: savingsData, error } = await supabase
            .from('savings')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false });
          
          if (!error && savingsData) {
            setSavings(savingsData);
          }
        } else {
          // Fallback to demo user
          const demoUser = demoGetUser();
          setUserId(demoUser?.id || '');
        }
      } catch (error) {
        console.error('Error loading savings:', error);
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
      <SavingsContent initialSavings={savings} userId={userId} />
    </div>
  );
}
