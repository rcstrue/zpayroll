'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  Calendar, 
  Receipt, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { formatIndianCurrency } from '@/lib/indian-payroll';

const summaryData = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12',
    changeType: 'positive' as const,
    icon: Users,
    color: 'emerald',
  },
  {
    title: 'Active Deployments',
    value: '186',
    change: '+8',
    changeType: 'positive' as const,
    icon: Calendar,
    color: 'sky',
  },
  {
    title: 'Active Clients',
    value: '15',
    change: '+2',
    changeType: 'positive' as const,
    icon: Building2,
    color: 'amber',
  },
  {
    title: 'Monthly Payroll',
    value: '₹48,72,500',
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: Receipt,
    color: 'purple',
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    icon: 'text-sky-600 dark:text-sky-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
  },
};

export function SummaryCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => {
        const colors = colorClasses[item.color as keyof typeof colorClasses];
        
        return (
          <Card key={item.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <item.icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {item.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-xs ${
                  item.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {item.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
