'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComplianceItem {
  id: string;
  name: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  amount?: string;
  progress?: number;
}

const complianceData: ComplianceItem[] = [
  {
    id: '1',
    name: 'EPF Payment',
    type: 'EPF',
    dueDate: '15 Feb 2025',
    status: 'pending',
    amount: '₹2,45,780',
    progress: 0,
  },
  {
    id: '2',
    name: 'ESI Payment',
    type: 'ESI',
    dueDate: '15 Feb 2025',
    status: 'pending',
    amount: '₹78,450',
    progress: 0,
  },
  {
    id: '3',
    name: 'Professional Tax',
    type: 'PT',
    dueDate: '21 Feb 2025',
    status: 'pending',
    amount: '₹49,600',
    progress: 0,
  },
  {
    id: '4',
    name: 'LWF Return (MH)',
    type: 'LWF',
    dueDate: '30 Jun 2025',
    status: 'completed',
    progress: 100,
  },
];

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'text-amber-500', 
    bg: 'bg-amber-500/10',
    badge: 'secondary' as const 
  },
  in_progress: { 
    icon: AlertCircle, 
    color: 'text-sky-500', 
    bg: 'bg-sky-500/10',
    badge: 'default' as const 
  },
  completed: { 
    icon: CheckCircle2, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    badge: 'default' as const 
  },
  overdue: { 
    icon: AlertCircle, 
    color: 'text-red-500', 
    bg: 'bg-red-500/10',
    badge: 'destructive' as const 
  },
};

const typeColors: Record<string, string> = {
  EPF: 'text-emerald-600 border-emerald-600',
  ESI: 'text-sky-600 border-sky-600',
  PT: 'text-amber-600 border-amber-600',
  LWF: 'text-purple-600 border-purple-600',
};

export function ComplianceStatus() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Compliance Status
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceData.map((item) => {
            const config = statusConfig[item.status];
            
            return (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${typeColors[item.type]}`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Due: {item.dueDate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {item.amount && (
                    <span className="font-medium">{item.amount}</span>
                  )}
                  <div className="mt-1">
                    <Badge variant={config.badge} className="text-xs">
                      {item.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
