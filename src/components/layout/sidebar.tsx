'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useHRMSStore } from '@/stores/hrms-store';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FileText,
  Receipt,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Employees', href: '/?module=employees', icon: Users },
  { name: 'Registrations', href: '/?module=registrations', icon: UserPlus },
  { name: 'Clients', href: '/?module=clients', icon: Building2 },
  { name: 'Attendance', href: '/?module=attendance', icon: Calendar },
  { name: 'Leave Management', href: '/?module=leaves', icon: FileText },
  { name: 'Payroll', href: '/?module=payroll', icon: Receipt },
  { name: 'Compliance', href: '/?module=compliance', icon: ShieldCheck },
  { name: 'Reports', href: '/?module=reports', icon: BarChart3 },
  { name: 'Settings', href: '/?module=settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useHRMSStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-300',
          'lg:translate-x-0 lg:static lg:z-0',
          sidebarCollapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            'flex items-center h-16 border-b border-border',
            sidebarCollapsed ? 'justify-center px-2' : 'px-4'
          )}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">HRMS Pro</h1>
                  <p className="text-xs text-muted-foreground">Manpower Solutions</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      sidebarCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Collapse button - desktop only */}
          <div className="hidden lg:block border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="w-full justify-center"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
