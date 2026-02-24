'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calculator,
  Plus,
  Edit,
  Trash2,
  Users,
  Copy,
  Download,
  Upload,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Save,
  MapPin,
  Percent,
  RefreshCw
} from 'lucide-react';
import { INDIAN_STATES, PT_SLABS_BY_STATE, EPF_CONSTANTS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Gujarat Minimum Wages 2024 (Per Day)
const GUJARAT_MINIMUM_WAGES = {
  A: {
    name: 'Zone A (Municipal Corporation Areas)',
    unskilled: { basic: 478.50, vda: 198.60, total: 677.10 },
    semiSkilled: { basic: 504.80, vda: 205.20, total: 710.00 },
    skilled: { basic: 532.00, vda: 211.80, total: 743.80 },
    highlySkilled: { basic: 560.20, vda: 219.00, total: 779.20 },
  },
  B: {
    name: 'Zone B (Municipalities & Notified Areas)',
    unskilled: { basic: 456.00, vda: 189.00, total: 645.00 },
    semiSkilled: { basic: 480.80, vda: 195.40, total: 676.20 },
    skilled: { basic: 506.00, vda: 201.40, total: 707.40 },
    highlySkilled: { basic: 532.50, vda: 208.00, total: 740.50 },
  },
  C: {
    name: 'Zone C (Rural Areas)',
    unskilled: { basic: 433.60, vda: 179.80, total: 613.40 },
    semiSkilled: { basic: 456.80, vda: 185.60, total: 642.40 },
    skilled: { basic: 480.40, vda: 191.00, total: 671.40 },
    highlySkilled: { basic: 505.20, vda: 197.20, total: 702.40 },
  },
};

// Working days in a month
const WORKING_DAYS = 26;

// Compliance Settings Interface
interface ComplianceSettings {
  pf: {
    employeeRate: number;
    employerRate: number;
    epsRate: number;
    edliRate: number;
    adminChargeRate: number;
    wageCeiling: number;
    calculateOn: 'gross' | 'basic_da';
  };
  esi: {
    employeeRate: number;
    employerRate: number;
    wageCeiling: number;
  };
  lwf: {
    employee: number;
    employer: number;
    frequency: string;
  };
  bonus: {
    minRate: number;
    maxRate: number;
    wageCeiling: number;
  };
  gratuity: {
    rate: number;
  };
  ptState: string;
}

// Default compliance settings
const DEFAULT_COMPLIANCE: ComplianceSettings = {
  pf: {
    employeeRate: 12,
    employerRate: 12,
    epsRate: 8.33,
    edliRate: 0.5,
    adminChargeRate: 0.5,
    wageCeiling: 15000,
    calculateOn: 'gross',
  },
  esi: {
    employeeRate: 0.75,
    employerRate: 3.25,
    wageCeiling: 21000,
  },
  lwf: {
    employee: 6,
    employer: 18,
    frequency: 'half-yearly',
  },
  bonus: {
    minRate: 8.33,
    maxRate: 20,
    wageCeiling: 21000,
  },
  gratuity: {
    rate: 4.81,
  },
  ptState: 'GJ',
};

interface SalaryStructure {
  id: string;
  name: string;
  zone: 'A' | 'B' | 'C';
  skillLevel: 'unskilled' | 'semiSkilled' | 'skilled' | 'highlySkilled';
  effectiveFrom: string;
  basic: number;
  vda: number;
  hra: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  otherAllowance: number;
  pfApplicable: boolean;
  esiApplicable: boolean;
  ptApplicable: boolean;
  lwfApplicable: boolean;
  bonusApplicable: boolean;
  gratuityApplicable: boolean;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  employerCost: number;
  ptState: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  skillLevel: string;
  salaryStructureId?: string;
  salaryStructureName?: string;
}

const generateId = () => `sal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export function SalaryStructureModule() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState('structures');
  const [showDialog, setShowDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<SalaryStructure | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>(DEFAULT_COMPLIANCE);
  const [ptSlabs, setPtSlabs] = useState(PT_SLABS_BY_STATE);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    zone: 'A' as 'A' | 'B' | 'C',
    skillLevel: 'unskilled' as 'unskilled' | 'semiSkilled' | 'skilled' | 'highlySkilled',
    effectiveFrom: new Date().toISOString().split('T')[0],
    customBasic: '',
    customVda: '',
    hra: '',
    conveyance: '300',
    medical: '250',
    specialAllowance: '',
    otherAllowance: '0',
    pfApplicable: true,
    esiApplicable: true,
    ptApplicable: true,
    lwfApplicable: true,
    bonusApplicable: true,
    gratuityApplicable: true,
    ptState: 'GJ',
  });

  // PT Settings form
  const [ptForm, setPtForm] = useState({
    state: 'GJ',
    slabs: [] as Array<{ min: number; max: number; amount: number }>,
  });

  // Load data from localStorage
  useEffect(() => {
    const savedStructures = localStorage.getItem('salaryStructures');
    if (savedStructures) {
      setStructures(JSON.parse(savedStructures));
    }

    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }

    const savedCompliance = localStorage.getItem('complianceSettings');
    if (savedCompliance) {
      setComplianceSettings(JSON.parse(savedCompliance));
    }

    const savedPtSlabs = localStorage.getItem('ptSlabs');
    if (savedPtSlabs) {
      setPtSlabs(JSON.parse(savedPtSlabs));
    }
  }, []);

  // Save functions
  const saveStructures = (newStructures: SalaryStructure[]) => {
    setStructures(newStructures);
    localStorage.setItem('salaryStructures', JSON.stringify(newStructures));
  };

  const saveComplianceSettings = (settings: ComplianceSettings) => {
    setComplianceSettings(settings);
    localStorage.setItem('complianceSettings', JSON.stringify(settings));
  };

  const savePtSlabs = (slabs: typeof ptSlabs) => {
    setPtSlabs(slabs);
    localStorage.setItem('ptSlabs', JSON.stringify(slabs));
  };

  // Calculate PT based on state and gross salary
  const calculatePT = (grossSalary: number, state: string): number => {
    const stateSlabs = ptSlabs[state] || ptSlabs['DEFAULT'];
    for (const slab of stateSlabs.slabs) {
      if (grossSalary >= slab.min && grossSalary <= slab.max) {
        return slab.amount;
      }
    }
    return stateSlabs.maxPT;
  };

  // Calculate Salary Breakup
  const calculateSalaryBreakup = (
    zone: 'A' | 'B' | 'C',
    skillLevel: 'unskilled' | 'semiSkilled' | 'skilled' | 'highlySkilled',
    customBasic?: number,
    customVda?: number
  ) => {
    const minWage = GUJARAT_MINIMUM_WAGES[zone][skillLevel];
    const basic = (customBasic || minWage.basic) * WORKING_DAYS;
    const vda = (customVda || minWage.vda) * WORKING_DAYS;
    const hra = Math.round(basic * 0.05);
    const conveyance = 300;
    const medical = 250;
    const grossTarget = (customBasic && customVda 
      ? customBasic + customVda 
      : minWage.total) * WORKING_DAYS;
    const specialAllowance = Math.max(0, grossTarget - basic - vda - hra - conveyance - medical);

    return {
      basic: Math.round(basic),
      vda: Math.round(vda),
      hra,
      conveyance,
      medical,
      specialAllowance: Math.round(specialAllowance),
      grossEarnings: Math.round(basic + vda + hra + conveyance + medical + specialAllowance),
    };
  };

  // Calculate Employer Cost
  const calculateEmployerCost = (structure: SalaryStructure, settings: ComplianceSettings) => {
    const { basic, vda, grossEarnings } = structure;
    let employerPF = 0;
    let employerESI = 0;
    let employerLWF = 0;
    let bonus = 0;
    let gratuity = 0;

    // PF Calculation - On GROSS (configurable)
    if (structure.pfApplicable) {
      const pfWages = settings.pf.calculateOn === 'gross' 
        ? Math.min(grossEarnings, settings.pf.wageCeiling)
        : Math.min(basic + vda, settings.pf.wageCeiling);
      employerPF = Math.round(pfWages * (settings.pf.employerRate + settings.pf.edliRate + settings.pf.adminChargeRate) / 100);
    }

    // ESI Calculation
    if (structure.esiApplicable && grossEarnings <= settings.esi.wageCeiling) {
      employerESI = Math.round(grossEarnings * settings.esi.employerRate / 100);
    }

    // LWF
    if (structure.lwfApplicable) {
      employerLWF = Math.round(settings.lwf.employer / 6);
    }

    // Bonus
    if (structure.bonusApplicable) {
      const bonusWages = Math.min(basic + vda, settings.bonus.wageCeiling);
      bonus = Math.round(bonusWages * settings.bonus.minRate / 100);
    }

    // Gratuity
    if (structure.gratuityApplicable) {
      gratuity = Math.round(basic * settings.gratuity.rate / 100);
    }

    return {
      employerPF,
      employerESI,
      employerLWF,
      bonus,
      gratuity,
      totalEmployerCost: grossEarnings + employerPF + employerESI + employerLWF + bonus + gratuity,
    };
  };

  // Calculate Employee Deductions
  const calculateDeductions = (structure: SalaryStructure, settings: ComplianceSettings) => {
    const { basic, vda, grossEarnings } = structure;
    let employeePF = 0;
    let employeeESI = 0;
    let pt = 0;
    let employeeLWF = 0;

    // PF Employee - On GROSS (configurable)
    if (structure.pfApplicable) {
      const pfWages = settings.pf.calculateOn === 'gross' 
        ? Math.min(grossEarnings, settings.pf.wageCeiling)
        : Math.min(basic + vda, settings.pf.wageCeiling);
      employeePF = Math.round(pfWages * settings.pf.employeeRate / 100);
    }

    // ESI Employee
    if (structure.esiApplicable && grossEarnings <= settings.esi.wageCeiling) {
      employeeESI = Math.round(grossEarnings * settings.esi.employeeRate / 100);
    }

    // PT - State-wise
    if (structure.ptApplicable) {
      pt = calculatePT(grossEarnings, structure.ptState);
    }

    // LWF Employee
    if (structure.lwfApplicable) {
      employeeLWF = Math.round(settings.lwf.employee / 6);
    }

    return {
      employeePF,
      employeeESI,
      pt,
      employeeLWF,
      totalDeductions: employeePF + employeeESI + pt + employeeLWF,
    };
  };

  // Auto-calculate breakup
  useEffect(() => {
    const breakup = calculateSalaryBreakup(
      formData.zone,
      formData.skillLevel,
      formData.customBasic ? parseFloat(formData.customBasic) : undefined,
      formData.customVda ? parseFloat(formData.customVda) : undefined
    );
    setFormData(prev => ({
      ...prev,
      hra: breakup.hra.toString(),
      conveyance: breakup.conveyance.toString(),
      medical: breakup.medical.toString(),
      specialAllowance: breakup.specialAllowance.toString(),
    }));
  }, [formData.zone, formData.skillLevel, formData.customBasic, formData.customVda]);

  // Open dialog for new/edit
  const openDialog = (structure?: SalaryStructure) => {
    if (structure) {
      setEditingStructure(structure);
      setFormData({
        name: structure.name,
        zone: structure.zone,
        skillLevel: structure.skillLevel,
        effectiveFrom: structure.effectiveFrom,
        customBasic: (structure.basic / WORKING_DAYS).toFixed(2),
        customVda: (structure.vda / WORKING_DAYS).toFixed(2),
        hra: structure.hra.toString(),
        conveyance: structure.conveyance.toString(),
        medical: structure.medical.toString(),
        specialAllowance: structure.specialAllowance.toString(),
        otherAllowance: structure.otherAllowance.toString(),
        pfApplicable: structure.pfApplicable,
        esiApplicable: structure.esiApplicable,
        ptApplicable: structure.ptApplicable,
        lwfApplicable: structure.lwfApplicable,
        bonusApplicable: structure.bonusApplicable,
        gratuityApplicable: structure.gratuityApplicable,
        ptState: structure.ptState || 'GJ',
      });
    } else {
      setEditingStructure(null);
      setFormData({
        name: '',
        zone: 'A',
        skillLevel: 'unskilled',
        effectiveFrom: new Date().toISOString().split('T')[0],
        customBasic: '',
        customVda: '',
        hra: '',
        conveyance: '300',
        medical: '250',
        specialAllowance: '',
        otherAllowance: '0',
        pfApplicable: true,
        esiApplicable: true,
        ptApplicable: true,
        lwfApplicable: true,
        bonusApplicable: true,
        gratuityApplicable: true,
        ptState: complianceSettings.ptState,
      });
    }
    setShowDialog(true);
  };

  // Save structure
  const saveStructure = () => {
    const basic = Math.round(parseFloat(formData.customBasic || '0') * WORKING_DAYS);
    const vda = Math.round(parseFloat(formData.customVda || '0') * WORKING_DAYS);
    const hra = parseFloat(formData.hra || '0');
    const conveyance = parseFloat(formData.conveyance || '0');
    const medical = parseFloat(formData.medical || '0');
    const specialAllowance = parseFloat(formData.specialAllowance || '0');
    const otherAllowance = parseFloat(formData.otherAllowance || '0');
    const grossEarnings = basic + vda + hra + conveyance + medical + specialAllowance + otherAllowance;

    const newStructure: SalaryStructure = {
      id: editingStructure?.id || generateId(),
      name: formData.name || `Zone ${formData.zone} - ${formData.skillLevel}`,
      zone: formData.zone,
      skillLevel: formData.skillLevel,
      effectiveFrom: formData.effectiveFrom,
      basic,
      vda,
      hra,
      conveyance,
      medical,
      specialAllowance,
      otherAllowance,
      pfApplicable: formData.pfApplicable,
      esiApplicable: formData.esiApplicable,
      ptApplicable: formData.ptApplicable,
      lwfApplicable: formData.lwfApplicable,
      bonusApplicable: formData.bonusApplicable,
      gratuityApplicable: formData.gratuityApplicable,
      grossEarnings,
      totalDeductions: 0,
      netPay: grossEarnings,
      employerCost: 0,
      ptState: formData.ptState,
      createdAt: editingStructure?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const deductions = calculateDeductions(newStructure, complianceSettings);
    const employerCosts = calculateEmployerCost(newStructure, complianceSettings);
    newStructure.totalDeductions = deductions.totalDeductions;
    newStructure.netPay = grossEarnings - deductions.totalDeductions;
    newStructure.employerCost = employerCosts.totalEmployerCost;

    let newStructures: SalaryStructure[];
    if (editingStructure) {
      newStructures = structures.map(s => s.id === editingStructure.id ? newStructure : s);
    } else {
      newStructures = [...structures, newStructure];
    }

    saveStructures(newStructures);
    setShowDialog(false);
    toast({ title: 'Success', description: editingStructure ? 'Structure updated' : 'Structure created' });
  };

  // Delete structure
  const deleteStructure = (id: string) => {
    if (confirm('Are you sure you want to delete this salary structure?')) {
      saveStructures(structures.filter(s => s.id !== id));
    }
  };

  // Update PT slabs for a state
  const updatePtSlabs = () => {
    if (!ptForm.state || ptForm.slabs.length === 0) return;
    
    const updated = {
      ...ptSlabs,
      [ptForm.state]: {
        ...ptSlabs[ptForm.state],
        slabs: ptForm.slabs,
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };
    savePtSlabs(updated);
    toast({ title: 'Success', description: `PT slabs updated for ${ptSlabs[ptForm.state]?.stateName}` });
  };

  // Open PT editor for a state
  const openPtEditor = (state: string) => {
    const stateData = ptSlabs[state] || ptSlabs['DEFAULT'];
    setPtForm({
      state,
      slabs: [...stateData.slabs],
    });
  };

  // Get preview calculations
  const getPreviewCalculations = () => {
    const basic = Math.round(parseFloat(formData.customBasic || GUJARAT_MINIMUM_WAGES[formData.zone][formData.skillLevel].basic.toString()) * WORKING_DAYS);
    const vda = Math.round(parseFloat(formData.customVda || GUJARAT_MINIMUM_WAGES[formData.zone][formData.skillLevel].vda.toString()) * WORKING_DAYS);
    const hra = parseFloat(formData.hra || '0');
    const conveyance = parseFloat(formData.conveyance || '0');
    const medical = parseFloat(formData.medical || '0');
    const specialAllowance = parseFloat(formData.specialAllowance || '0');
    const otherAllowance = parseFloat(formData.otherAllowance || '0');
    const grossEarnings = basic + vda + hra + conveyance + medical + specialAllowance + otherAllowance;

    const tempStructure: SalaryStructure = {
      id: '',
      name: '',
      zone: formData.zone,
      skillLevel: formData.skillLevel,
      effectiveFrom: '',
      basic,
      vda,
      hra,
      conveyance,
      medical,
      specialAllowance,
      otherAllowance,
      pfApplicable: formData.pfApplicable,
      esiApplicable: formData.esiApplicable,
      ptApplicable: formData.ptApplicable,
      lwfApplicable: formData.lwfApplicable,
      bonusApplicable: formData.bonusApplicable,
      gratuityApplicable: formData.gratuityApplicable,
      grossEarnings,
      totalDeductions: 0,
      netPay: 0,
      employerCost: 0,
      ptState: formData.ptState,
      createdAt: '',
      updatedAt: '',
    };

    const deductions = calculateDeductions(tempStructure, complianceSettings);
    const employerCosts = calculateEmployerCost(tempStructure, complianceSettings);

    return {
      ...tempStructure,
      totalDeductions: deductions.totalDeductions,
      netPay: grossEarnings - deductions.totalDeductions,
      employerCost: employerCosts.totalEmployerCost,
      deductions,
      employerCosts,
    };
  };

  const preview = getPreviewCalculations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Salary Structure & Compliance</h1>
          <p className="text-muted-foreground">Manage salary structures with configurable PF, PT & compliance settings</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Compliance Settings
          </Button>
          <Button onClick={() => openDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            New Structure
          </Button>
        </div>
      </div>

      {/* Compliance Info Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PF Rate (Employee)</p>
                <p className="text-2xl font-bold">{complianceSettings.pf.employeeRate}%</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {complianceSettings.pf.calculateOn === 'gross' ? 'On GROSS' : 'On Basic+DA'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ESI Rate (Employer)</p>
                <p className="text-2xl font-bold">{complianceSettings.esi.employerRate}%</p>
              </div>
              <p className="text-xs text-muted-foreground">Ceiling: ₹{complianceSettings.esi.wageCeiling}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PT State</p>
                <p className="text-2xl font-bold">{ptSlabs[complianceSettings.ptState]?.stateName || 'Default'}</p>
              </div>
              <p className="text-xs text-muted-foreground">Max: ₹{ptSlabs[complianceSettings.ptState]?.maxPT || 200}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonus Rate</p>
                <p className="text-2xl font-bold">{complianceSettings.bonus.minRate}%</p>
              </div>
              <p className="text-xs text-muted-foreground">Min: 8.33% | Max: 20%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gujarat Minimum Wages Info */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-600" />
            Gujarat Minimum Wages (Effective: April 2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead className="text-center">Unskilled</TableHead>
                  <TableHead className="text-center">Semi-Skilled</TableHead>
                  <TableHead className="text-center">Skilled</TableHead>
                  <TableHead className="text-center">Highly Skilled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(['A', 'B', 'C'] as const).map((zone) => (
                  <TableRow key={zone}>
                    <TableCell className="font-medium">
                      Zone {zone}
                      <div className="text-xs text-muted-foreground">{GUJARAT_MINIMUM_WAGES[zone].name.split('(')[1]?.replace(')', '')}</div>
                    </TableCell>
                    {(['unskilled', 'semiSkilled', 'skilled', 'highlySkilled'] as const).map((skill) => (
                      <TableCell key={skill} className="text-center">
                        <div className="font-semibold">₹{GUJARAT_MINIMUM_WAGES[zone][skill].total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">Per Day</div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="assignments">Employee Assignment</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {structures.map((structure) => (
              <Card key={structure.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 text-xs rounded-bl-lg">
                  Zone {structure.zone}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg pr-16">{structure.name}</CardTitle>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline">{structure.skillLevel}</Badge>
                    {structure.pfApplicable && <Badge variant="secondary" className="text-xs">PF</Badge>}
                    {structure.esiApplicable && <Badge variant="secondary" className="text-xs">ESI</Badge>}
                    {structure.ptApplicable && <Badge variant="secondary" className="text-xs">PT</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic</span>
                      <span>₹{structure.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VDA</span>
                      <span>₹{structure.vda.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Gross</span>
                      <span className="text-emerald-600">₹{structure.grossEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm border-t pt-2">
                    <div className="flex justify-between text-red-600">
                      <span>Deductions</span>
                      <span>-₹{structure.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Net Pay</span>
                      <span className="text-emerald-600">₹{structure.netPay.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm border-t pt-2 bg-blue-50 dark:bg-blue-950/20 -mx-6 px-6 pb-2">
                    <div className="flex justify-between font-semibold text-blue-700">
                      <span>Employer Cost</span>
                      <span>₹{structure.employerCost.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      PT: {ptSlabs[structure.ptState]?.stateName || 'Default'}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openDialog(structure)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteStructure(structure.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Salary Structure Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>Assigned Structure</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No employees found. Add employees first.
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell>
                            <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                            <div className="text-xs text-muted-foreground">{emp.employeeCode}</div>
                          </TableCell>
                          <TableCell>{emp.designation || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{emp.skillLevel || 'Not Set'}</Badge>
                          </TableCell>
                          <TableCell>
                            {emp.salaryStructureName ? (
                              <Badge className="bg-emerald-100 text-emerald-800">{emp.salaryStructureName}</Badge>
                            ) : (
                              <span className="text-muted-foreground">Not Assigned</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={emp.salaryStructureId || ''}
                              onValueChange={(value) => {
                                const structure = structures.find(s => s.id === value);
                                const updatedEmployees = employees.map(e =>
                                  e.id === emp.id
                                    ? { ...e, salaryStructureId: value || undefined, salaryStructureName: structure?.name }
                                    : e
                                );
                                setEmployees(updatedEmployees);
                                localStorage.setItem('employees', JSON.stringify(updatedEmployees));
                              }}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Assign Structure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Remove Assignment</SelectItem>
                                {structures.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Salary Breakup Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zone</Label>
                    <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v as 'A' | 'B' | 'C' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Zone A</SelectItem>
                        <SelectItem value="B">Zone B</SelectItem>
                        <SelectItem value="C">Zone C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Level</Label>
                    <Select value={formData.skillLevel} onValueChange={(v) => setFormData({ ...formData, skillLevel: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unskilled">Unskilled</SelectItem>
                        <SelectItem value="semiSkilled">Semi-Skilled</SelectItem>
                        <SelectItem value="skilled">Skilled</SelectItem>
                        <SelectItem value="highlySkilled">Highly Skilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Custom Basic (Per Day)</Label>
                    <Input type="number" placeholder="Auto" value={formData.customBasic} onChange={(e) => setFormData({ ...formData, customBasic: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom VDA (Per Day)</Label>
                    <Input type="number" placeholder="Auto" value={formData.customVda} onChange={(e) => setFormData({ ...formData, customVda: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>PT State</Label>
                  <Select value={formData.ptState} onValueChange={(v) => setFormData({ ...formData, ptState: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ptSlabs).map(([code, data]) => (
                        <SelectItem key={code} value={code}>{data.stateName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base">Compliance Toggles</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">PF</div>
                        <div className="text-xs text-muted-foreground">{complianceSettings.pf.employeeRate}% on {complianceSettings.pf.calculateOn === 'gross' ? 'GROSS' : 'Basic+DA'}</div>
                      </div>
                      <Switch checked={formData.pfApplicable} onCheckedChange={(v) => setFormData({ ...formData, pfApplicable: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">ESI</div>
                        <div className="text-xs text-muted-foreground">{complianceSettings.esi.employeeRate}% + {complianceSettings.esi.employerRate}%</div>
                      </div>
                      <Switch checked={formData.esiApplicable} onCheckedChange={(v) => setFormData({ ...formData, esiApplicable: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">PT</div>
                        <div className="text-xs text-muted-foreground">State-wise slabs</div>
                      </div>
                      <Switch checked={formData.ptApplicable} onCheckedChange={(v) => setFormData({ ...formData, ptApplicable: v })} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">LWF</div>
                        <div className="text-xs text-muted-foreground">₹{complianceSettings.lwf.employee} + ₹{complianceSettings.lwf.employer}</div>
                      </div>
                      <Switch checked={formData.lwfApplicable} onCheckedChange={(v) => setFormData({ ...formData, lwfApplicable: v })} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculated Salary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Basic</span><span>₹{preview.basic.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">VDA</span><span>₹{preview.vda.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">HRA</span><span>₹{preview.hra.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Other Allowances</span><span>₹{(preview.conveyance + preview.medical + preview.specialAllowance).toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold border-t pt-2"><span>Gross Earnings</span><span className="text-emerald-600">₹{preview.grossEarnings.toLocaleString()}</span></div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-red-600"><span>PF (Employee)</span><span>-₹{preview.deductions?.employeePF.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-600"><span>ESI (Employee)</span><span>-₹{preview.deductions?.employeeESI.toLocaleString()}</span></div>
                  <div className="flex justify-between text-red-600"><span>PT ({ptSlabs[formData.ptState]?.stateName})</span><span>-₹{preview.deductions?.pt.toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold border-t pt-2"><span>Net Pay</span><span className="text-emerald-600 text-lg">₹{preview.netPay.toLocaleString()}</span></div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-700 mb-2">Employer Cost Breakup</div>
                  <div className="flex justify-between"><span>PF (Employer)</span><span>₹{preview.employerCosts?.employerPF.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>ESI (Employer)</span><span>₹{preview.employerCosts?.employerESI.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Bonus</span><span>₹{preview.employerCosts?.bonus.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Gratuity</span><span>₹{preview.employerCosts?.gratuity.toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold border-t pt-2 text-blue-700"><span>Total Employer Cost</span><span>₹{preview.employerCost.toLocaleString()}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Compliance Settings</SheetTitle>
            <SheetDescription>Configure PF rates, ESI rates, and state-wise PT slabs</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            {/* PF Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Percent className="h-4 w-4" />
                PF (Provident Fund) Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={complianceSettings.pf.employeeRate}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      pf: { ...prev.pf, employeeRate: parseFloat(e.target.value) || 12 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employer Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={complianceSettings.pf.employerRate}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      pf: { ...prev.pf, employerRate: parseFloat(e.target.value) || 12 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wage Ceiling (₹)</Label>
                  <Input 
                    type="number"
                    value={complianceSettings.pf.wageCeiling}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      pf: { ...prev.pf, wageCeiling: parseInt(e.target.value) || 15000 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Calculate On</Label>
                  <Select 
                    value={complianceSettings.pf.calculateOn}
                    onValueChange={(v) => setComplianceSettings(prev => ({
                      ...prev,
                      pf: { ...prev.pf, calculateOn: v as 'gross' | 'basic_da' }
                    }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gross">GROSS Salary</SelectItem>
                      <SelectItem value="basic_da">Basic + DA Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* ESI Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Percent className="h-4 w-4" />
                ESI Settings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={complianceSettings.esi.employeeRate}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      esi: { ...prev.esi, employeeRate: parseFloat(e.target.value) || 0.75 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employer Rate (%)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={complianceSettings.esi.employerRate}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      esi: { ...prev.esi, employerRate: parseFloat(e.target.value) || 3.25 }
                    }))}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Wage Ceiling (₹)</Label>
                  <Input 
                    type="number"
                    value={complianceSettings.esi.wageCeiling}
                    onChange={(e) => setComplianceSettings(prev => ({
                      ...prev,
                      esi: { ...prev.esi, wageCeiling: parseInt(e.target.value) || 21000 }
                    }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Default PT State */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Default PT State
              </h4>
              <Select 
                value={complianceSettings.ptState}
                onValueChange={(v) => setComplianceSettings(prev => ({ ...prev, ptState: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ptSlabs).map(([code, data]) => (
                    <SelectItem key={code} value={code}>{data.stateName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* PT Slabs by State */}
            <div className="space-y-4">
              <h4 className="font-medium">State-wise PT Slabs</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-4">
                  {Object.entries(ptSlabs).slice(0, 8).map(([code, data]) => (
                    <div 
                      key={code} 
                      className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/30 cursor-pointer"
                      onClick={() => openPtEditor(code)}
                    >
                      <div>
                        <p className="font-medium">{data.stateName}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.slabs.length} slabs | Max PT: ₹{data.maxPT}
                        </p>
                      </div>
                      <Badge variant="outline">{code}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
              <Button onClick={() => { saveComplianceSettings(complianceSettings); setIsSettingsOpen(false); toast({ title: 'Settings Saved' }); }}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add/Edit Structure Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStructure ? 'Edit Salary Structure' : 'New Salary Structure'}</DialogTitle>
            <DialogDescription>Configure salary breakup and compliance settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Structure Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Auto-generated if empty" />
              </div>
              <div className="space-y-2">
                <Label>Effective From</Label>
                <Input type="date" value={formData.effectiveFrom} onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Zone</Label>
                <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v as 'A' | 'B' | 'C' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Zone A</SelectItem>
                    <SelectItem value="B">Zone B</SelectItem>
                    <SelectItem value="C">Zone C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Skill Level</Label>
                <Select value={formData.skillLevel} onValueChange={(v) => setFormData({ ...formData, skillLevel: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unskilled">Unskilled</SelectItem>
                    <SelectItem value="semiSkilled">Semi-Skilled</SelectItem>
                    <SelectItem value="skilled">Skilled</SelectItem>
                    <SelectItem value="highlySkilled">Highly Skilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PT State</Label>
                <Select value={formData.ptState} onValueChange={(v) => setFormData({ ...formData, ptState: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ptSlabs).map(([code, data]) => (
                      <SelectItem key={code} value={code}>{data.stateName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Basic (Per Day)</Label>
                <Input type="number" value={formData.customBasic} onChange={(e) => setFormData({ ...formData, customBasic: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>VDA (Per Day)</Label>
                <Input type="number" value={formData.customVda} onChange={(e) => setFormData({ ...formData, customVda: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>HRA (Monthly)</Label>
                <Input type="number" value={formData.hra} onChange={(e) => setFormData({ ...formData, hra: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Special Allowance</Label>
                <Input type="number" value={formData.specialAllowance} onChange={(e) => setFormData({ ...formData, specialAllowance: e.target.value })} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>PF Applicable</span>
                <Switch checked={formData.pfApplicable} onCheckedChange={(v) => setFormData({ ...formData, pfApplicable: v })} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>ESI Applicable</span>
                <Switch checked={formData.esiApplicable} onCheckedChange={(v) => setFormData({ ...formData, esiApplicable: v })} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>PT Applicable</span>
                <Switch checked={formData.ptApplicable} onCheckedChange={(v) => setFormData({ ...formData, ptApplicable: v })} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>LWF Applicable</span>
                <Switch checked={formData.lwfApplicable} onCheckedChange={(v) => setFormData({ ...formData, lwfApplicable: v })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={saveStructure}>
                {editingStructure ? 'Update Structure' : 'Create Structure'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
