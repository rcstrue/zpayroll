'use client';

import { useState, useEffect, Suspense } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ComplianceStatus } from '@/components/dashboard/compliance-status';
import { DashboardCharts } from '@/components/dashboard/charts';
import { EmployeesModule } from '@/components/employees/employees-module';
import { ClientsModule } from '@/components/clients/clients-module';
import { PayrollModule } from '@/components/payroll/payroll-module';
import { ComplianceModule } from '@/components/compliance/compliance-module';
import { AttendanceModule } from '@/components/attendance/attendance-module';
import { SettingsModule } from '@/components/settings/settings-module';
import { ReportsModule } from '@/components/reports/reports-module';
import { AuthModule } from '@/components/auth/auth-module';
import { RegistrationsModule } from '@/components/registrations/registrations-module';
import { useSearchParams } from 'next/navigation';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
}

function DashboardModule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HRMS Pro - Manpower Management System</p>
      </div>
      
      <SummaryCards />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <ComplianceStatus />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  const searchParams = useSearchParams();
  const activeModule = searchParams.get('module') || 'dashboard';

  const renderModule = () => {
    switch (activeModule) {
      case 'employees':
        return <EmployeesModule />;
      case 'clients':
        return <ClientsModule />;
      case 'payroll':
        return <PayrollModule />;
      case 'compliance':
        return <ComplianceModule />;
      case 'attendance':
      case 'leaves':
        return <AttendanceModule />;
      case 'settings':
        return <SettingsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'registrations':
        return <RegistrationsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <MainLayout>
      {renderModule()}
    </MainLayout>
  );
}

function AuthWrapper({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('hrms_authenticated');
    const timer = setTimeout(() => {
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('hrms_authenticated', 'true');
    setIsAuthenticated(true);
    onAuthenticated();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthModule onLogin={handleLogin} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <MainContent />
    </Suspense>
  );
}

export default function HomePage() {
  const [isReady, setIsReady] = useState(false);

  const handleAuthenticated = () => {
    setIsReady(true);
  };

  if (!isReady) {
    return <AuthWrapper onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <MainContent />
    </Suspense>
  );
}
