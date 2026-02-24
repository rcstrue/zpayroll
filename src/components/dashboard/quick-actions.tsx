'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Building2, 
  Receipt, 
  Calculator,
  FileText,
  Upload
} from 'lucide-react';

const quickActions = [
  { label: 'Add Employee', icon: UserPlus, color: 'emerald' },
  { label: 'Add Client', icon: Building2, color: 'sky' },
  { label: 'Process Payroll', icon: Calculator, color: 'amber' },
  { label: 'Generate Bill', icon: Receipt, color: 'purple' },
  { label: 'File EPF Return', icon: FileText, color: 'rose' },
  { label: 'Import Attendance', icon: Upload, color: 'slate' },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500 hover:bg-emerald-600',
  sky: 'bg-sky-500 hover:bg-sky-600',
  amber: 'bg-amber-500 hover:bg-amber-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  rose: 'bg-rose-500 hover:bg-rose-600',
  slate: 'bg-slate-500 hover:bg-slate-600',
};

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              className={`h-auto flex-col gap-2 py-4 text-white ${colorMap[action.color]}`}
              variant="default"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
