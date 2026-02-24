import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  designation?: string;
  department?: string;
  status: string;
  dateOfJoining?: Date;
  currentClient?: string;
  salary?: number;
}

export interface Client {
  id: string;
  clientCode: string;
  companyName: string;
  contactPerson?: string;
  contactPhone?: string;
  city?: string;
  state?: string;
  activeDeployments: number;
  status: string;
}

export interface PayrollSummary {
  month: number;
  year: number;
  totalEmployees: number;
  processedEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployerCost: number;
  status: string;
}

export interface ComplianceItem {
  id: string;
  type: 'epf' | 'esi' | 'pt' | 'lwf';
  month: number;
  year: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'filed' | 'paid';
}

interface HRMSState {
  // Current selections
  currentModule: string;
  selectedEmployeeId: string | null;
  selectedClientId: string | null;
  selectedMonth: number;
  selectedYear: number;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  
  // Loading states
  isLoading: boolean;
  
  // Data
  employees: Employee[];
  clients: Client[];
  payrollSummary: PayrollSummary | null;
  complianceItems: ComplianceItem[];
  
  // Actions
  setCurrentModule: (module: string) => void;
  setSelectedEmployee: (id: string | null) => void;
  setSelectedClient: (id: string | null) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setEmployees: (employees: Employee[]) => void;
  setClients: (clients: Client[]) => void;
  setPayrollSummary: (summary: PayrollSummary | null) => void;
  setComplianceItems: (items: ComplianceItem[]) => void;
  
  // Computed
  getCurrentMonth: () => { month: number; year: number };
}

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

export const useHRMSStore = create<HRMSState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentModule: 'dashboard',
      selectedEmployeeId: null,
      selectedClientId: null,
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      sidebarCollapsed: false,
      isLoading: false,
      employees: [],
      clients: [],
      payrollSummary: null,
      complianceItems: [],
      
      // Actions
      setCurrentModule: (module) => set({ currentModule: module }),
      setSelectedEmployee: (id) => set({ selectedEmployeeId: id }),
      setSelectedClient: (id) => set({ selectedClientId: id }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedYear: (year) => set({ selectedYear: year }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLoading: (loading) => set({ isLoading: loading }),
      setEmployees: (employees) => set({ employees }),
      setClients: (clients) => set({ clients }),
      setPayrollSummary: (summary) => set({ payrollSummary: summary }),
      setComplianceItems: (items) => set({ complianceItems: items }),
      
      // Computed
      getCurrentMonth: () => {
        const state = get();
        return { month: state.selectedMonth, year: state.selectedYear };
      },
    }),
    {
      name: 'hrms-storage',
      partialize: (state) => ({
        currentModule: state.currentModule,
        selectedMonth: state.selectedMonth,
        selectedYear: state.selectedYear,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Utility hook for module navigation
export const useModuleNavigation = () => {
  const { setCurrentModule, currentModule } = useHRMSStore();
  
  const navigateTo = (module: string) => {
    setCurrentModule(module);
  };
  
  return { navigateTo, currentModule };
};

// Utility hook for date selection
export const useDateSelection = () => {
  const { 
    selectedMonth, 
    selectedYear, 
    setSelectedMonth, 
    setSelectedYear 
  } = useHRMSStore();
  
  const setDate = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };
  
  return { 
    selectedMonth, 
    selectedYear, 
    setSelectedMonth, 
    setSelectedYear, 
    setDate 
  };
};
