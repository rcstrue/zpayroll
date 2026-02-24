'use client';

import { useHRMSStore } from '@/stores/hrms-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  Building2,
  FileText,
  IndianRupee,
  CalendarDays,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'employee':
      return UserPlus;
    case 'client':
      return Building2;
    case 'payroll':
      return IndianRupee;
    case 'compliance':
      return FileText;
    case 'leave':
      return CalendarDays;
    case 'attendance':
      return Clock;
    default:
      return FileText;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'employee':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
    case 'client':
      return 'bg-sky-100 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400';
    case 'payroll':
      return 'bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400';
    case 'compliance':
      return 'bg-teal-100 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400';
    case 'leave':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';
    case 'attendance':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export function RecentActivities() {
  const { recentActivities } = useHRMSStore();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
        <Button variant="ghost" size="sm" className="text-emerald-600">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);

              return (
                <div key={activity.id} className="flex gap-3">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={cn('p-2 rounded-full', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < recentActivities.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          <span className="text-emerald-600">{activity.action}</span>{' '}
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {activity.userName && (
                            <span className="text-xs text-muted-foreground">
                              by {activity.userName}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
