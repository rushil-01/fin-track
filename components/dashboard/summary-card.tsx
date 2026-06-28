'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatting';

interface SummaryCardProps {
  title: string;
  amount: number;
  color: string;
}

export default function SummaryCard({ title, amount, color }: SummaryCardProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${color}`} />
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(amount)}</p>
      </CardContent>
    </Card>
  );
}
