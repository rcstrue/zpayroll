'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
  Plus,
  Edit,
  Settings,
  Info,
  Save,
  DollarSign,
  Grid3X3,
  Building2,
  Factory,
  RefreshCw,
  Copy,
  FileSpreadsheet,
  Calculator,
  Hash,
  ClipboardList
} from 'lucide-react';
import { MONTHS, ATTENDANCE_STATUS, INDIAN_STATES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Extended attendance status
interface AttendanceCode {
  value: string;
  label: string;
  color: string;
  description: string;
  dayCount: number;
  paymentMultiplier: number;
  calculateOn: 'gross' | 'basic_da' | 'none';
  isCustom?: boolean;
}

// Default attendance codes
const DEFAULT_ATTENDANCE_CODES: AttendanceCode[] = ATTENDANCE_STATUS.map(status => ({
  value: status.value,
  label: status.label,
  color: status.color,
  description: status.description || '',
  dayCount: status.dayCount,
  paymentMultiplier: status.paymentMultiplier,
  calculateOn: status.calculateOn,
}));

// Sample Client Data
const SAMPLE_CLIENTS = [
  { id: '1', code: 'CLI001', name: 'ABC Manufacturing Pvt Ltd', units: [
    { id: 'u1', code: 'CLI001-UNI001', name: 'Factory Unit - Andheri' },
    { id: 'u2', code: 'CLI001-UNI002', name: 'Warehouse - Bhiwandi' },
  ]},
  { id: '2', code: 'CLI002', name: 'XYZ Corporation', units: [
    { id: 'u3', code: 'CLI002-UNI001', name: 'Main Office - Hinjewadi' },
  ]},
  { id: '3', code: 'CLI003', name: 'Tech Industries Ltd', units: [
    { id: 'u4', code: 'CLI003-UNI001', name: 'Production Unit - Electronic City' },
    { id: 'u5', code: 'CLI003-UNI002', name: 'R&D Center - Whitefield' },
  ]},
];

// Sample Employee Data per unit
const EMPLOYEES_BY_UNIT: Record<string, Array<{ id: string; code: string; name: string; designation: string; grossSalary: number }>> = {
  'u1': [
    { id: 'e1', code: 'EMP001', name: 'Rajesh Kumar', designation: 'Machine Operator', grossSalary: 18500 },
    { id: 'e2', code: 'EMP002', name: 'Priya Sharma', designation: 'Quality Inspector', grossSalary: 19200 },
    { id: 'e3', code: 'EMP003', name: 'Amit Singh', designation: 'Supervisor', grossSalary: 25000 },
    { id: 'e4', code: 'EMP004', name: 'Sunita Devi', designation: 'Helper', grossSalary: 17600 },
    { id: 'e5', code: 'EMP005', name: 'Rahul Verma', designation: 'Machine Operator', grossSalary: 18500 },
    { id: 'e6', code: 'EMP006', name: 'Deepak Kumar', designation: 'Technician', grossSalary: 22000 },
    { id: 'e7', code: 'EMP007', name: 'Anita Singh', designation: 'Helper', grossSalary: 17600 },
    { id: 'e8', code: 'EMP008', name: 'Rakesh Yadav', designation: 'Operator', grossSalary: 18000 },
  ],
  'u2': [
    { id: 'e9', code: 'EMP009', name: 'Vikram Patel', designation: 'Store Keeper', grossSalary: 18000 },
    { id: 'e10', code: 'EMP010', name: 'Neha Gupta', designation: 'Inventory Clerk', grossSalary: 17500 },
    { id: 'e11', code: 'EMP011', name: 'Sanjay Kumar', designation: 'Loader', grossSalary: 17200 },
    { id: 'e12', code: 'EMP012', name: 'Kavita Devi', designation: 'Helper', grossSalary: 17000 },
  ],
  'u3': [
    { id: 'e13', code: 'EMP013', name: 'Suresh Kumar', designation: 'Office Assistant', grossSalary: 18000 },
    { id: 'e14', code: 'EMP014', name: 'Meena Patel', designation: 'Receptionist', grossSalary: 17500 },
    { id: 'e15', code: 'EMP015', name: 'Ravi Shankar', designation: 'Data Entry', grossSalary: 17000 },
  ],
  'u4': [
    { id: 'e16', code: 'EMP016', name: 'Arun Kumar', designation: 'Production Worker', grossSalary: 17800 },
    { id: 'e17', code: 'EMP017', name: 'Lakshmi Devi', designation: 'Assembly Worker', grossSalary: 17500 },
    { id: 'e18', code: 'EMP018', name: 'Prasad Rao', designation: 'Technician', grossSalary: 22500 },
    { id: 'e19', code: 'EMP019', name: 'Divya Sharma', designation: 'Quality Checker', grossSalary: 19000 },
    { id: 'e20', code: 'EMP020', name: 'Manjunath K', designation: 'Operator', grossSalary: 18200 },
  ],
  'u5': [
    { id: 'e21', code: 'EMP021', name: 'Sneha Reddy', designation: 'Lab Assistant', grossSalary: 20000 },
    { id: 'e22', code: 'EMP022', name: 'Gopal Krishna', designation: 'Research Assistant', grossSalary: 22000 },
    { id: 'e23', code: 'EMP023', name: 'Aishwarya N', designation: 'Junior Engineer', grossSalary: 28000 },
  ],
};

// Status color mapping
const getStatusColor = (color: string) => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-700 border-emerald-500',
    red: 'bg-red-500/20 text-red-700 border-red-500',
    amber: 'bg-amber-500/20 text-amber-700 border-amber-500',
    sky: 'bg-sky-500/20 text-sky-700 border-sky-500',
    slate: 'bg-slate-500/20 text-slate-700 border-slate-500',
    purple: 'bg-purple-500/20 text-purple-700 border-purple-500',
    rose: 'bg-rose-500/20 text-rose-700 border-rose-500',
    teal: 'bg-teal-500/20 text-teal-700 border-teal-500',
  };
  return colors[color] || colors.slate;
};

// Get days in month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

// Get day name
const getDayName = (day: number, month: number, year: number) => {
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Check if Sunday
const isSunday = (day: number, month: number, year: number) => {
  const date = new Date(year, month - 1, day);
  return date.getDay() === 0;
};

// Monthly attendance entry interface
interface MonthlyAttendanceEntry {
  employeeId: string;
  present: number;      // P
  absent: number;       // A
  presentHoliday: number; // PH (double pay)
  paidHoliday: number;  // H
  weekOff: number;      // W
  halfDay: number;      // P/2
  overtime: number;     // Hours
  remarks: string;
}

export function AttendanceModule() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddCodeOpen, setIsAddCodeOpen] = useState(false);
  const [attendanceCodes, setAttendanceCodes] = useState<AttendanceCode[]>(DEFAULT_ATTENDANCE_CODES);
  const { toast } = useToast();

  // Attendance Entry State
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dayWiseAttendance, setDayWiseAttendance] = useState<Record<string, Record<number, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Monthly Attendance State
  const [monthlyAttendance, setMonthlyAttendance] = useState<Record<string, MonthlyAttendanceEntry>>({});
  const [workingDays, setWorkingDays] = useState<number>(26);

  // New code form
  const [newCodeForm, setNewCodeForm] = useState({
    value: '',
    label: '',
    description: '',
    dayCount: '1',
    paymentMultiplier: '1',
    calculateOn: 'gross' as 'gross' | 'basic_da' | 'none',
    color: 'teal',
  });

  // Employees state - can be modified dynamically
  const [employeesList, setEmployeesList] = useState<Record<string, Array<{ id: string; code: string; name: string; designation: string; grossSalary: number }>>>({});
  
  // Get selected client/unit data
  const selectedClientData = SAMPLE_CLIENTS.find(c => c.id === selectedClient);
  const selectedUnitData = selectedClientData?.units.find(u => u.id === selectedUnit);
  
  // Merge static employees with custom employees
  const employees = useMemo(() => {
    if (!selectedUnit) return [];
    const staticEmps = EMPLOYEES_BY_UNIT[selectedUnit] || [];
    const customEmps = employeesList[selectedUnit] || [];
    return [...staticEmps, ...customEmps];
  }, [selectedUnit, employeesList]);

  // Quick add employee state
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  // Get days in selected month
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calculate total days in month
  const totalDaysInMonth = useMemo(() => {
    let sundays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      if (isSunday(d, selectedMonth, selectedYear)) sundays++;
    }
    return {
      total: daysInMonth,
      sundays,
      workingDays: daysInMonth - sundays,
    };
  }, [selectedMonth, selectedYear]);

  // Load attendance data from localStorage
  useEffect(() => {
    const savedCodes = localStorage.getItem('attendanceCodes');
    if (savedCodes) {
      setAttendanceCodes(JSON.parse(savedCodes));
    }

    const savedAttendance = localStorage.getItem('dayWiseAttendance');
    if (savedAttendance) {
      setDayWiseAttendance(JSON.parse(savedAttendance));
    }

    const savedMonthly = localStorage.getItem('monthlyAttendance');
    if (savedMonthly) {
      setMonthlyAttendance(JSON.parse(savedMonthly));
    }

    const savedWorkingDays = localStorage.getItem('workingDays');
    if (savedWorkingDays) {
      setWorkingDays(JSON.parse(savedWorkingDays));
    }

    const savedEmployeesList = localStorage.getItem('employeesList');
    if (savedEmployeesList) {
      setEmployeesList(JSON.parse(savedEmployeesList));
    }
  }, []);

  // Save functions
  const saveAttendanceCodes = (codes: AttendanceCode[]) => {
    setAttendanceCodes(codes);
    localStorage.setItem('attendanceCodes', JSON.stringify(codes));
  };

  // ===== DAY-WISE ATTENDANCE FUNCTIONS =====
  
  // Handle day-wise attendance change
  const handleDayWiseChange = (employeeId: string, day: number, status: string) => {
    setDayWiseAttendance(prev => {
      const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
      const unitData = prev[key] || {};
      const empData = { ...unitData[employeeId] } as Record<number, string>;
      
      if (status === 'NONE') {
        delete empData[day];
      } else {
        empData[day] = status;
      }
      
      return {
        ...prev,
        [key]: {
          ...unitData,
          [employeeId]: empData,
        },
      };
    });
    setHasChanges(true);
  };

  // Get attendance for employee on specific day
  const getDayWiseAttendance = (employeeId: string, day: number): string => {
    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    return dayWiseAttendance[key]?.[employeeId]?.[day] || '';
  };

  // ===== MONTHLY ATTENDANCE FUNCTIONS =====

  // Get monthly attendance entry for employee
  const getMonthlyEntry = (employeeId: string): MonthlyAttendanceEntry => {
    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    return monthlyAttendance[key]?.[employeeId] || {
      employeeId,
      present: 0,
      absent: 0,
      presentHoliday: 0,
      paidHoliday: 0,
      weekOff: 0,
      halfDay: 0,
      overtime: 0,
      remarks: '',
    };
  };

  // Update monthly attendance entry
  const updateMonthlyEntry = (employeeId: string, field: keyof MonthlyAttendanceEntry, value: number | string) => {
    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    setMonthlyAttendance(prev => {
      const unitData = prev[key] || {};
      const existing = unitData[employeeId] || {
        employeeId,
        present: 0,
        absent: 0,
        presentHoliday: 0,
        paidHoliday: 0,
        weekOff: 0,
        halfDay: 0,
        overtime: 0,
        remarks: '',
      };
      
      return {
        ...prev,
        [key]: {
          ...unitData,
          [employeeId]: {
            ...existing,
            [field]: value,
          },
        },
      };
    });
    setHasChanges(true);
  };

  // Calculate paid days from monthly entry
  const calculatePaidDays = (entry: MonthlyAttendanceEntry): number => {
    return entry.present + entry.presentHoliday + entry.paidHoliday + entry.weekOff + (entry.halfDay * 0.5);
  };

  // Bulk fill monthly attendance
  const handleBulkFillMonthly = (field: keyof MonthlyAttendanceEntry, value: number) => {
    if (!selectedUnit || employees.length === 0) return;

    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    const newData = { ...monthlyAttendance };
    const unitData = newData[key] || {};

    employees.forEach(emp => {
      const existing = unitData[emp.id] || {
        employeeId: emp.id,
        present: 0,
        absent: 0,
        presentHoliday: 0,
        paidHoliday: 0,
        weekOff: 0,
        halfDay: 0,
        overtime: 0,
        remarks: '',
      };

      // If setting present days, auto-fill week off
      if (field === 'present') {
        const weekOffs = totalDaysInMonth.sundays;
        unitData[emp.id] = {
          ...existing,
          present: value,
          absent: Math.max(0, workingDays - value - weekOffs),
          weekOff: weekOffs,
        };
      } else {
        unitData[emp.id] = {
          ...existing,
          [field]: value,
        };
      }
    });

    newData[key] = unitData;
    setMonthlyAttendance(newData);
    setHasChanges(true);
    toast({ title: 'Bulk Fill Complete', description: `All employees updated` });
  };

  // Copy previous month attendance
  const handleCopyPreviousMonth = () => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    const prevKey = `${selectedUnit}_${prevMonth}_${prevYear}`;
    const currentKey = `${selectedUnit}_${selectedMonth}_${selectedYear}`;

    if (monthlyAttendance[prevKey]) {
      setMonthlyAttendance(prev => ({
        ...prev,
        [currentKey]: prev[prevKey],
      }));
      setHasChanges(true);
      toast({ title: 'Copied', description: 'Previous month attendance copied' });
    } else {
      toast({ variant: 'destructive', title: 'No Data', description: 'No attendance found for previous month' });
    }
  };

  // Clear all monthly attendance
  const handleClearMonthly = () => {
    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    setMonthlyAttendance(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
    setHasChanges(true);
    toast({ title: 'Cleared', description: 'All attendance data cleared' });
  };

  // Quick Add Employee - Only name required
  const handleQuickAddEmployee = () => {
    if (!newEmployeeName.trim() || !selectedUnit) return;

    const newId = `emp_${Date.now()}`;
    const empCode = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    
    const newEmployee = {
      id: newId,
      code: empCode,
      name: newEmployeeName.trim(),
      designation: 'To Be Updated',
      grossSalary: 0, // Will be updated in employee manager
    };

    setEmployeesList(prev => {
      const updated = {
        ...prev,
        [selectedUnit]: [...(prev[selectedUnit] || []), newEmployee],
      };
      localStorage.setItem('employeesList', JSON.stringify(updated));
      return updated;
    });

    setNewEmployeeName('');
    setIsAddingEmployee(false);
    toast({ 
      title: 'Employee Added', 
      description: `${newEmployeeName} added. Update details in Employee Manager.` 
    });
  };

  // Delete quick-added employee
  const handleDeleteQuickEmployee = (empId: string) => {
    if (!selectedUnit) return;
    
    setEmployeesList(prev => {
      const updated = {
        ...prev,
        [selectedUnit]: (prev[selectedUnit] || []).filter(e => e.id !== empId),
      };
      localStorage.setItem('employeesList', JSON.stringify(updated));
      return updated;
    });
    toast({ title: 'Removed', description: 'Employee removed from this unit' });
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem('monthlyAttendance', JSON.stringify(monthlyAttendance));
    localStorage.setItem('dayWiseAttendance', JSON.stringify(dayWiseAttendance));
    localStorage.setItem('workingDays', JSON.stringify(workingDays));
    setHasChanges(false);
    setIsSaving(false);
    toast({ title: 'Saved', description: 'Attendance data saved successfully' });
  };

  // Export to Excel
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
      const unitData = monthlyAttendance[key] || {};
      
      let csv = 'Employee Code,Employee Name,Designation,Gross Salary,Present (P),Absent (A),Holiday + Work (PH),Paid Holiday (H),Week Off (W),Half Day (P/2),Overtime (Hrs),Paid Days,Gross Payable,Remarks\n';

      employees.forEach(emp => {
        const entry = unitData[emp.id] || {
          present: 0, absent: 0, presentHoliday: 0, paidHoliday: 0, weekOff: 0, halfDay: 0, overtime: 0, remarks: ''
        };
        const paidDays = calculatePaidDays(entry);
        const dailyWage = emp.grossSalary / workingDays;
        const grossPayable = Math.round(dailyWage * paidDays);

        csv += `${emp.code},${emp.name},${emp.designation},${emp.grossSalary},${entry.present},${entry.absent},${entry.presentHoliday},${entry.paidHoliday},${entry.weekOff},${entry.halfDay},${entry.overtime},${paidDays.toFixed(1)},${grossPayable},${entry.remarks}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Monthly_Attendance_${selectedClientData?.name}_${selectedUnitData?.name}_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export Complete', description: 'Attendance exported to CSV' });
    } finally {
      setIsExporting(false);
    }
  };

  // Add new attendance code
  const handleAddCode = () => {
    if (!newCodeForm.value || !newCodeForm.label) {
      toast({ variant: 'destructive', title: 'Error', description: 'Code and Label are required' });
      return;
    }

    const newCode: AttendanceCode = {
      value: newCodeForm.value.toUpperCase(),
      label: newCodeForm.label,
      description: newCodeForm.description,
      dayCount: parseFloat(newCodeForm.dayCount),
      paymentMultiplier: parseFloat(newCodeForm.paymentMultiplier),
      calculateOn: newCodeForm.calculateOn,
      color: newCodeForm.color,
      isCustom: true,
    };

    saveAttendanceCodes([...attendanceCodes, newCode]);
    setIsAddCodeOpen(false);
    setNewCodeForm({
      value: '',
      label: '',
      description: '',
      dayCount: '1',
      paymentMultiplier: '1',
      calculateOn: 'gross',
      color: 'teal',
    });
    toast({ title: 'Success', description: 'Attendance code added successfully' });
  };

  // Calculate summary stats for monthly
  const monthlySummary = useMemo(() => {
    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
    const unitData = monthlyAttendance[key] || {};
    
    let totalPresent = 0, totalAbsent = 0, totalPH = 0, totalH = 0, totalW = 0, totalP2 = 0;
    let totalGrossPayable = 0;

    employees.forEach(emp => {
      const entry = unitData[emp.id] || {
        present: 0, absent: 0, presentHoliday: 0, paidHoliday: 0, weekOff: 0, halfDay: 0
      };
      totalPresent += entry.present;
      totalAbsent += entry.absent;
      totalPH += entry.presentHoliday;
      totalH += entry.paidHoliday;
      totalW += entry.weekOff;
      totalP2 += entry.halfDay;

      const paidDays = calculatePaidDays(entry);
      const dailyWage = emp.grossSalary / workingDays;
      totalGrossPayable += Math.round(dailyWage * paidDays);
    });

    return { totalPresent, totalAbsent, totalPH, totalH, totalW, totalP2, totalGrossPayable };
  }, [monthlyAttendance, selectedUnit, selectedMonth, selectedYear, employees, workingDays]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Monthly & Day-wise attendance entry</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isExporting || !selectedUnit}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
        </div>
      </div>

      {/* Attendance Codes Legend */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Codes:</span>
            {attendanceCodes.map(code => (
              <Badge 
                key={code.value} 
                variant="outline" 
                className={cn("cursor-default", getStatusColor(code.color))}
                title={code.description}
              >
                {code.value} - {code.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Monthly Entry
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Day-wise Entry
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Monthly Attendance Entry Tab */}
        <TabsContent value="monthly" className="space-y-4">
          {/* Filters Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {/* Client Select */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Client
                  </Label>
                  <Select value={selectedClient} onValueChange={(v) => { setSelectedClient(v); setSelectedUnit(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_CLIENTS.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Unit Select */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    Unit
                  </Label>
                  <Select 
                    value={selectedUnit} 
                    onValueChange={setSelectedUnit}
                    disabled={!selectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClientData?.units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Select */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Month
                  </Label>
                  <Select 
                    value={String(selectedMonth)} 
                    onValueChange={(v) => setSelectedMonth(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => (
                        <SelectItem key={m.value} value={String(m.value)}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Select */}
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select 
                    value={String(selectedYear)} 
                    onValueChange={(v) => setSelectedYear(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Working Days */}
                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <Input 
                    type="number" 
                    value={workingDays}
                    onChange={(e) => setWorkingDays(parseInt(e.target.value) || 26)}
                    className="w-20"
                  />
                </div>

                {/* Save Button */}
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button 
                    onClick={handleSaveAttendance} 
                    disabled={!selectedUnit || !hasChanges || isSaving}
                    className="w-full"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              </div>

              {/* Month Info & Quick Actions */}
              {selectedUnit && (
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">
                      Total Days: {totalDaysInMonth.total}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-100">
                      Sundays: {totalDaysInMonth.sundays}
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700">
                      Working Days: {totalDaysInMonth.workingDays}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkFillMonthly('present', workingDays)}>
                      Fill All P = {workingDays}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkFillMonthly('present', 0)}>
                      Clear All
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCopyPreviousMonth}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Previous
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={handleClearMonthly}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Attendance Grid */}
          {selectedUnit ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedClientData?.name} - {selectedUnitData?.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {employees.length} employees • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor('emerald')}>P: {monthlySummary.totalPresent}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor('red')}>A: {monthlySummary.totalAbsent}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor('slate')}>W: {monthlySummary.totalW}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-purple-100 text-purple-700">
                        Gross: ₹{(monthlySummary.totalGrossPayable / 100000).toFixed(1)}L
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-max">
                    <Table className="border-collapse">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="sticky left-0 bg-muted/50 z-20 min-w-[180px] border-r">
                            Employee
                          </TableHead>
                          <TableHead className="min-w-[100px] text-right border-r">Gross Salary</TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-emerald-50">
                            <span className="text-emerald-700">P</span>
                            <div className="text-[10px] text-muted-foreground">Present</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-red-50">
                            <span className="text-red-700">A</span>
                            <div className="text-[10px] text-muted-foreground">Absent</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-purple-50">
                            <span className="text-purple-700">PH</span>
                            <div className="text-[10px] text-muted-foreground">Double</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-sky-50">
                            <span className="text-sky-700">H</span>
                            <div className="text-[10px] text-muted-foreground">Holiday</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-slate-100">
                            <span className="text-slate-700">W</span>
                            <div className="text-[10px] text-muted-foreground">Week Off</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r bg-amber-50">
                            <span className="text-amber-700">P/2</span>
                            <div className="text-[10px] text-muted-foreground">Half</div>
                          </TableHead>
                          <TableHead className="min-w-[70px] text-center border-r">
                            <span className="text-purple-700">OT</span>
                            <div className="text-[10px] text-muted-foreground">Hours</div>
                          </TableHead>
                          <TableHead className="min-w-[80px] text-center border-r bg-emerald-100 font-semibold">
                            Paid Days
                          </TableHead>
                          <TableHead className="min-w-[100px] text-right bg-emerald-100 font-semibold">
                            Gross Payable
                          </TableHead>
                          <TableHead className="min-w-[150px] border-l">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                              No employees found for this unit
                            </TableCell>
                          </TableRow>
                        ) : (
                          employees.map((emp, idx) => {
                            const entry = getMonthlyEntry(emp.id);
                            const paidDays = calculatePaidDays(entry);
                            const dailyWage = emp.grossSalary / workingDays;
                            const grossPayable = Math.round(dailyWage * paidDays);

                            return (
                              <TableRow key={emp.id} className={cn(
                                idx % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                                emp.id.startsWith('emp_') && 'border-l-2 border-l-amber-400'
                              )}>
                                <TableCell className="sticky left-0 bg-inherit z-10 border-r font-medium">
                                  <div className="flex items-center justify-between gap-2">
                                    <div>
                                      <p className="truncate">{emp.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {emp.code}
                                        {emp.id.startsWith('emp_') && (
                                          <span className="ml-1 text-amber-600">(New)</span>
                                        )}
                                      </p>
                                    </div>
                                    {emp.id.startsWith('emp_') && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500 hover:text-red-600"
                                        onClick={() => handleDeleteQuickEmployee(emp.id)}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="border-r text-right text-sm">
                                  {emp.grossSalary > 0 ? `₹${emp.grossSalary.toLocaleString()}` : (
                                    <span className="text-amber-600 text-xs">Not Set</span>
                                  )}
                                </TableCell>
                                
                                {/* P - Present */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="31"
                                    value={entry.present || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'present', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* A - Absent */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="31"
                                    value={entry.absent || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'absent', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* PH - Present Holiday (Double Pay) */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={entry.presentHoliday || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'presentHoliday', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* H - Paid Holiday */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={entry.paidHoliday || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'paidHoliday', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* W - Week Off */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="8"
                                    value={entry.weekOff || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'weekOff', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* P/2 - Half Day */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="15"
                                    value={entry.halfDay || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'halfDay', parseInt(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* OT - Overtime */}
                                <TableCell className="p-1 border-r">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={entry.overtime || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'overtime', parseFloat(e.target.value) || 0)}
                                    className="h-8 text-center text-sm border-0 bg-transparent focus:bg-background"
                                  />
                                </TableCell>
                                
                                {/* Paid Days (Calculated) */}
                                <TableCell className="text-center font-semibold bg-emerald-50/50 border-r">
                                  {paidDays.toFixed(1)}
                                </TableCell>
                                
                                {/* Gross Payable (Calculated) */}
                                <TableCell className="text-right font-semibold bg-emerald-50/50">
                                  {emp.grossSalary > 0 ? (
                                    <span className="text-emerald-700">₹{grossPayable.toLocaleString()}</span>
                                  ) : (
                                    <span className="text-amber-600 text-xs">Set Salary</span>
                                  )}
                                </TableCell>
                                
                                {/* Remarks */}
                                <TableCell className="p-1 border-l">
                                  <Input
                                    value={entry.remarks || ''}
                                    onChange={(e) => updateMonthlyEntry(emp.id, 'remarks', e.target.value)}
                                    placeholder="Notes..."
                                    className="h-8 text-sm border-0 bg-transparent"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                        
                        {/* Quick Add Employee Row */}
                        <TableRow className="bg-primary/5 hover:bg-primary/10">
                          <TableCell className="sticky left-0 bg-inherit z-10 border-r" colSpan={2}>
                            {isAddingEmployee ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  autoFocus
                                  placeholder="Enter employee name..."
                                  value={newEmployeeName}
                                  onChange={(e) => setNewEmployeeName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleQuickAddEmployee();
                                    if (e.key === 'Escape') { setIsAddingEmployee(false); setNewEmployeeName(''); }
                                  }}
                                  className="h-8 text-sm"
                                />
                                <Button size="sm" onClick={handleQuickAddEmployee} disabled={!newEmployeeName.trim()}>
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setIsAddingEmployee(false); setNewEmployeeName(''); }}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-muted-foreground hover:text-primary"
                                onClick={() => setIsAddingEmployee(true)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Employee (Quick)
                              </Button>
                            )}
                          </TableCell>
                          <TableCell colSpan={10} className="text-center text-sm text-muted-foreground">
                            {isAddingEmployee ? 'Fill attendance after adding' : 'Click to add new employee - only name required'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-muted-foreground">Select Client & Unit</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose a client and unit to enter monthly attendance</p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Day-wise Entry Tab */}
        <TabsContent value="daily" className="space-y-4">
          {/* Filters Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Client
                  </Label>
                  <Select value={selectedClient} onValueChange={(v) => { setSelectedClient(v); setSelectedUnit(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_CLIENTS.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    Unit
                  </Label>
                  <Select 
                    value={selectedUnit} 
                    onValueChange={setSelectedUnit}
                    disabled={!selectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClientData?.units.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Month
                  </Label>
                  <Select 
                    value={String(selectedMonth)} 
                    onValueChange={(v) => setSelectedMonth(Number(v))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTHS.map(m => (
                        <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select 
                    value={String(selectedYear)} 
                    onValueChange={(v) => setSelectedYear(Number(v))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button 
                    onClick={handleSaveAttendance} 
                    disabled={!selectedUnit || !hasChanges || isSaving}
                    className="w-full"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save
                  </Button>
                </div>
              </div>

              {selectedUnit && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <span className="text-sm text-muted-foreground self-center mr-2">Quick Fill:</span>
                  <Button size="sm" variant="outline" onClick={() => {
                    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
                    const newData = { ...dayWiseAttendance };
                    const unitData: Record<string, Record<number, string>> = {};
                    employees.forEach(emp => {
                      const empData: Record<number, string> = {};
                      daysArray.forEach(day => {
                        empData[day] = isSunday(day, selectedMonth, selectedYear) ? 'W' : 'P';
                      });
                      unitData[emp.id] = empData;
                    });
                    newData[key] = unitData;
                    setDayWiseAttendance(newData);
                    setHasChanges(true);
                  }}>
                    All Present
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    const key = `${selectedUnit}_${selectedMonth}_${selectedYear}`;
                    const newData = { ...dayWiseAttendance };
                    delete newData[key];
                    setDayWiseAttendance(newData);
                    setHasChanges(true);
                  }}>
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Day-wise Grid */}
          {selectedUnit ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {selectedClientData?.name} - {selectedUnitData?.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Day-wise attendance for {employees.length} employees
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-max">
                    <Table className="border-collapse">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="sticky left-0 bg-muted/50 z-20 min-w-[150px] border-r">Employee</TableHead>
                          <TableHead className="min-w-[80px] border-r text-center">Designation</TableHead>
                          {daysArray.map(day => {
                            const isSun = isSunday(day, selectedMonth, selectedYear);
                            return (
                              <TableHead 
                                key={day} 
                                className={cn(
                                  "text-center min-w-[40px] px-1 border-r",
                                  isSun && "bg-red-100 dark:bg-red-900/20 text-red-600"
                                )}
                              >
                                <div className="text-xs">{day}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  {getDayName(day, selectedMonth, selectedYear)}
                                </div>
                              </TableHead>
                            );
                          })}
                          <TableHead className="text-center min-w-[60px] bg-emerald-50">Paid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((emp, idx) => {
                          let paidDays = 0;
                          daysArray.forEach(day => {
                            const status = getDayWiseAttendance(emp.id, day);
                            const code = attendanceCodes.find(c => c.value === status);
                            paidDays += code?.dayCount || 0;
                          });

                          return (
                            <TableRow key={emp.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                              <TableCell className="sticky left-0 bg-inherit z-10 border-r font-medium">
                                <div>
                                  <p className="truncate">{emp.name}</p>
                                  <p className="text-xs text-muted-foreground">{emp.code}</p>
                                </div>
                              </TableCell>
                              <TableCell className="border-r text-sm text-muted-foreground">
                                {emp.designation}
                              </TableCell>
                              {daysArray.map(day => {
                                const status = getDayWiseAttendance(emp.id, day);
                                const code = attendanceCodes.find(c => c.value === status);
                                const isSun = isSunday(day, selectedMonth, selectedYear);

                                return (
                                  <TableCell 
                                    key={day} 
                                    className={cn(
                                      "p-0 border-r",
                                      isSun && !status && "bg-red-50 dark:bg-red-900/10"
                                    )}
                                  >
                                    <Select
                                      value={status || 'NONE'}
                                      onValueChange={(v) => handleDayWiseChange(emp.id, day, v)}
                                    >
                                      <SelectTrigger 
                                        className={cn(
                                          "h-8 w-full border-0 px-1 text-center",
                                          status && code && getStatusColor(code.color)
                                        )}
                                      >
                                        <span className="text-xs font-medium">{status || (isSun ? 'W' : '-')}</span>
                                      </SelectTrigger>
                                      <SelectContent className="min-w-[120px]">
                                        <SelectItem value="NONE">- Clear -</SelectItem>
                                        {attendanceCodes.map(c => (
                                          <SelectItem key={c.value} value={c.value}>
                                            <span className="flex items-center gap-2">
                                              <Badge variant="outline" className={cn("text-xs", getStatusColor(c.color))}>
                                                {c.value}
                                              </Badge>
                                              {c.label}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center font-semibold bg-emerald-50/50">
                                {paidDays.toFixed(1)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <Grid3X3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-muted-foreground">Select Client & Unit</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose a client and unit to view day-wise attendance</p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedUnit && employees.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="text-right">Present (P)</TableHead>
                        <TableHead className="text-right">Absent (A)</TableHead>
                        <TableHead className="text-right">Holiday Work (PH)</TableHead>
                        <TableHead className="text-right">Paid Holiday (H)</TableHead>
                        <TableHead className="text-right">Week Off (W)</TableHead>
                        <TableHead className="text-right">Half Day</TableHead>
                        <TableHead className="text-right">Overtime</TableHead>
                        <TableHead className="text-right font-semibold">Paid Days</TableHead>
                        <TableHead className="text-right font-semibold">Gross Payable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map(emp => {
                        const entry = getMonthlyEntry(emp.id);
                        const paidDays = calculatePaidDays(entry);
                        const dailyWage = emp.grossSalary / workingDays;
                        const grossPayable = Math.round(dailyWage * paidDays);

                        return (
                          <TableRow key={emp.id}>
                            <TableCell>
                              <div className="font-medium">{emp.name}</div>
                              <div className="text-xs text-muted-foreground">{emp.code}</div>
                            </TableCell>
                            <TableCell className="text-right text-emerald-600">{entry.present || 0}</TableCell>
                            <TableCell className="text-right text-red-600">{entry.absent || 0}</TableCell>
                            <TableCell className="text-right text-purple-600">{entry.presentHoliday || 0}</TableCell>
                            <TableCell className="text-right text-sky-600">{entry.paidHoliday || 0}</TableCell>
                            <TableCell className="text-right text-slate-600">{entry.weekOff || 0}</TableCell>
                            <TableCell className="text-right text-amber-600">{entry.halfDay || 0}</TableCell>
                            <TableCell className="text-right">{entry.overtime || 0}h</TableCell>
                            <TableCell className="text-right font-semibold">{paidDays.toFixed(1)}</TableCell>
                            <TableCell className="text-right font-semibold text-emerald-700">₹{grossPayable.toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a client and unit to view attendance summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Attendance Settings</SheetTitle>
            <SheetDescription>Manage attendance codes and payment calculation rules</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Attendance Codes</h4>
                <Button size="sm" onClick={() => setIsAddCodeOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Code
                </Button>
              </div>

              <div className="space-y-2">
                {attendanceCodes.map(code => (
                  <div 
                    key={code.value}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(code.color)}>
                        {code.value}
                      </Badge>
                      <div>
                        <p className="font-medium">{code.label}</p>
                        <p className="text-xs text-muted-foreground">{code.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>Days: <span className="font-medium">{code.dayCount}</span></p>
                      <p>Pay: <span className="font-medium">{code.paymentMultiplier}x</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Rules
              </h4>
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P (Present):</span>
                    <span>Full day pay (1x)</span>
                  </div>
                  <div className="flex justify-between text-purple-600">
                    <span className="font-medium">PH (Holiday Work):</span>
                    <span className="font-medium">Double pay on Basic+DA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P/2 (Half Day):</span>
                    <span>Half day pay (0.5x)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Custom Code Dialog */}
      <Dialog open={isAddCodeOpen} onOpenChange={setIsAddCodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Attendance Code</DialogTitle>
            <DialogDescription>Create a new attendance code</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input 
                  placeholder="e.g., OD" 
                  value={newCodeForm.value}
                  onChange={(e) => setNewCodeForm(prev => ({ ...prev, value: e.target.value.toUpperCase() }))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input 
                  placeholder="e.g., On Duty" 
                  value={newCodeForm.label}
                  onChange={(e) => setNewCodeForm(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day Count</Label>
                <Input 
                  type="number" 
                  step="0.5"
                  value={newCodeForm.dayCount}
                  onChange={(e) => setNewCodeForm(prev => ({ ...prev, dayCount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Multiplier</Label>
                <Input 
                  type="number" 
                  step="0.5"
                  value={newCodeForm.paymentMultiplier}
                  onChange={(e) => setNewCodeForm(prev => ({ ...prev, paymentMultiplier: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddCodeOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCode}>Add Code</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
