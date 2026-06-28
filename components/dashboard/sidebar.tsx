'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { demoLogout } from '@/lib/demo-auth';
import {
  BarChart3,
  DollarSign,
  Home,
  LogOut,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/income', label: 'Income', icon: TrendingUp },
  { href: '/dashboard/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/dashboard/savings', label: 'Savings', icon: PiggyBank },
  { href: '/dashboard/loans', label: 'Loans', icon: DollarSign },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    demoLogout();
    router.push('/auth/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          FinTrack
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full justify-start gap-3 border-slate-700 text-slate-300 hover:bg-slate-800"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </Button>
    </aside>
  );
}
