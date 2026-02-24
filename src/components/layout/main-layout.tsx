'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { Footer } from './footer';
import { useHRMSStore } from '@/stores/hrms-store';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export function MainLayout({ children, onLogout }: MainLayoutProps) {
  const { sidebarCollapsed } = useHRMSStore();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          'lg:ml-0' // Sidebar handles its own positioning
        )}>
          <Header onLogout={onLogout} />
          <main className="flex-1 p-4 lg:p-6 bg-muted/30">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
