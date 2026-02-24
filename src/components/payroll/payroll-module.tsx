'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { 
  Calculator, 
  FileText, 
  Download,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  IndianRupee,
  Users,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MONTHS } from '@/lib/constants';
import { formatIndianCurrency } from '@/lib/indian-payroll';
import { useToast } from '@/hooks/use-toast';

// Sample payroll data
const initialPayrollSummary = {
  month: 1,
  year: 2025,
  totalEmployees: 5,
  processedEmployees: 2,
  totalGross: 93308,
  totalDeductions: 8690,
  totalNetPay: 84618,
  totalEmployerCost: 104500,
  status: 'draft',
};

const initialPayroll = [
  { id: '1', employeeCode: 'EMP00001', employeeName: 'Rajesh Kumar', designation: 'Security Guard', paidDays: 26, totalDays: 26, basic: 10000, da: 2000, hra: 3000, gross: 18000, pf: 1440, esi: 135, pt: 200, totalDeductions: 1775, netPay: 16225, employerCost: 20250, status: 'draft' },
  { id: '2', employeeCode: 'EMP00002', employeeName: 'Priya Sharma', designation: 'Housekeeping Staff', paidDays: 26, totalDays: 26, basic: 8500, da: 1500, hra: 2500, gross: 15000, pf: 1200, esi: 113, pt: 200, totalDeductions: 1513, netPay: 13487, employerCost: 16750, status: 'processed' },
  { id: '3', employeeCode: 'EMP00003', employeeName: 'Amit Singh', designation: 'Machine Operator', paidDays: 24, totalDays: 26, basic: 12000, da: 3000, hra: 4000, gross: 20308, pf: 1800, esi: 152, pt: 200, totalDeductions: 2152, netPay: 18156, employerCost: 22900, status: 'draft' },
  { id: '4', employeeCode: 'EMP00004', employeeName: 'Sunita Devi', designation: 'Helper', paidDays: 26, totalDays: 26, basic: 7000, da: 1000, hra: 2000, gross: 12000, pf: 960, esi: 90, pt: 200, totalDeductions: 1250, netPay: 10750, employerCost: 13400, status: 'paid' },
  { id: '5', employeeCode: 'EMP00005', employeeName: 'Rahul Verma', designation: 'Supervisor', paidDays: 26, totalDays: 26, basic: 15000, da: 5000, hra: 5000, gross: 28000, pf: 1800, esi: 0, pt: 200, totalDeductions: 2000, netPay: 26000, employerCost: 31200, status: 'processed' },
];

const statusConfig = {
  draft: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10', badge: 'secondary' as const },
  processed: { icon: CheckCircle2, color: 'text-sky-500', bg: 'bg-sky-500/10', badge: 'default' as const },
  paid: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', badge: 'default' as const },
};

export function PayrollModule() {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [payrollData, setPayrollData] = useState(initialPayroll);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPayslips, setIsGeneratingPayslips] = useState(false);
  const [isExportingBank, setIsExportingBank] = useState(false);
  const { toast } = useToast();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Calculate summary from current payroll data
  const payrollSummary = {
    ...initialPayrollSummary,
    totalEmployees: payrollData.length,
    processedEmployees: payrollData.filter(p => p.status !== 'draft').length,
    totalGross: payrollData.reduce((a, p) => a + p.gross, 0),
    totalDeductions: payrollData.reduce((a, p) => a + p.totalDeductions, 0),
    totalNetPay: payrollData.reduce((a, p) => a + p.netPay, 0),
    totalEmployerCost: payrollData.reduce((a, p) => a + p.employerCost, 0),
  };

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update all draft records to processed
      setPayrollData(prev => prev.map(p => 
        p.status === 'draft' ? { ...p, status: 'processed' } : p
      ));
      
      toast({
        title: 'Payroll Processed',
        description: `Successfully processed payroll for ${payrollData.filter(p => p.status === 'draft').length} employees`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process payroll',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePayslips = async () => {
    setIsGeneratingPayslips(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: 'Payslips Generated',
        description: 'All payslips have been generated successfully',
      });
    } finally {
      setIsGeneratingPayslips(false);
    }
  };

  const handleExportBankFile = async () => {
    setIsExportingBank(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate CSV content
      const csvContent = [
        'Employee Code,Employee Name,Bank Account,IFSC,Net Amount',
        ...payrollData.filter(p => p.status !== 'draft').map(p => 
          `${p.employeeCode},${p.employeeName},XXXXXXXXXX,HDFCXXXXXXX,${p.netPay}`
        )
      ].join('\n');
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bank_transfer_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Bank File Exported',
        description: 'Bank transfer file has been downloaded',
      });
    } finally {
      setIsExportingBank(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setPayrollData(prev => prev.map(p => 
      p.status === 'processed' ? { ...p, status: 'paid' } : p
    ));
    toast({
      title: 'Payment Recorded',
      description: 'All processed salaries marked as paid',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Process salaries with Indian Wage Code compliance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10">
                <Users className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payrollSummary.totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatIndianCurrency(payrollSummary.totalGross)}</p>
                <p className="text-sm text-muted-foreground">Gross Salary</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatIndianCurrency(payrollSummary.totalDeductions)}</p>
                <p className="text-sm text-muted-foreground">Deductions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <IndianRupee className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatIndianCurrency(payrollSummary.totalNetPay)}</p>
                <p className="text-sm text-muted-foreground">Net Pay</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <IndianRupee className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatIndianCurrency(payrollSummary.totalEmployerCost)}</p>
                <p className="text-sm text-muted-foreground">Employer Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleRunPayroll} disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Calculator className="h-4 w-4 mr-2" />
          )}
          Run Payroll
        </Button>
        <Button variant="outline" onClick={handleGeneratePayslips} disabled={isGeneratingPayslips}>
          {isGeneratingPayslips ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Generate Payslips
        </Button>
        <Button variant="outline" onClick={handleExportBankFile} disabled={isExportingBank}>
          {isExportingBank ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Bank File
        </Button>
        {payrollData.some(p => p.status === 'processed') && (
          <Button variant="secondary" onClick={handleMarkAsPaid}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payroll">
        <TabsList>
          <TabsTrigger value="payroll">Payroll Register</TabsTrigger>
          <TabsTrigger value="statutory">Statutory Summary</TabsTrigger>
          <TabsTrigger value="summary">Department Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead className="text-right">Basic</TableHead>
                      <TableHead className="text-right">DA</TableHead>
                      <TableHead className="text-right">HRA</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">PF</TableHead>
                      <TableHead className="text-right">ESI</TableHead>
                      <TableHead className="text-right">PT</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollData.map((row) => {
                      const config = statusConfig[row.status as keyof typeof statusConfig];
                      return (
                        <TableRow key={row.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{row.employeeName}</p>
                              <p className="text-xs text-muted-foreground">{row.employeeCode}</p>
                            </div>
                          </TableCell>
                          <TableCell>{row.paidDays}/{row.totalDays}</TableCell>
                          <TableCell className="text-right">₹{row.basic.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{row.da.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{row.hra.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right font-medium">₹{row.gross.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{row.pf.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{row.esi.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{row.pt.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right text-red-600">₹{row.totalDeductions.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">₹{row.netPay.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <Badge variant={config.badge} className={`${config.bg} ${config.color}`}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statutory" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* EPF Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600">EPF Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employee Share</span>
                    <span className="font-medium">₹{payrollData.reduce((a, p) => a + p.pf, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employer Share</span>
                    <span className="font-medium">₹{Math.round(payrollData.reduce((a, p) => a + p.pf, 0) * 0.367).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">EPS Contribution</span>
                    <span className="font-medium">₹{Math.round(payrollData.reduce((a, p) => a + p.pf, 0) * 0.0833).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₹{(payrollData.reduce((a, p) => a + p.pf, 0) * 2).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ESI Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-sky-600">ESI Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employee Share</span>
                    <span className="font-medium">₹{payrollData.reduce((a, p) => a + p.esi, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Employer Share</span>
                    <span className="font-medium">₹{Math.round(payrollData.reduce((a, p) => a + p.esi, 0) * 4.33).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₹{Math.round(payrollData.reduce((a, p) => a + p.esi, 0) * 5.33).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Employees with wages ≤ ₹21,000
                </p>
              </CardContent>
            </Card>

            {/* Professional Tax */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-600">Professional Tax</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Employees</span>
                    <span className="font-medium">{payrollData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PT per Employee</span>
                    <span className="font-medium">₹200</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-medium">Total PT</span>
                    <span className="font-bold">₹{payrollData.reduce((a, p) => a + p.pt, 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Due by 21st of following month
                </p>
              </CardContent>
            </Card>

            {/* Employer Cost Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-600">Total Employer Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Salary</span>
                    <span className="font-medium">{formatIndianCurrency(payrollSummary.totalGross)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PF + EPS + EDLI</span>
                    <span className="font-medium">{formatIndianCurrency(Math.round(payrollData.reduce((a, p) => a + p.pf, 0) * 1.31))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ESI</span>
                    <span className="font-medium">{formatIndianCurrency(Math.round(payrollData.reduce((a, p) => a + p.esi, 0) * 4.33))}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">{formatIndianCurrency(payrollSummary.totalEmployerCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead className="text-right">Employer Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Security</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">₹18,000</TableCell>
                      <TableCell className="text-right text-red-600">₹1,775</TableCell>
                      <TableCell className="text-right font-medium">₹16,225</TableCell>
                      <TableCell className="text-right">₹20,250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Housekeeping</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">₹15,000</TableCell>
                      <TableCell className="text-right text-red-600">₹1,513</TableCell>
                      <TableCell className="text-right font-medium">₹13,487</TableCell>
                      <TableCell className="text-right">₹16,750</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Production</TableCell>
                      <TableCell className="text-right">2</TableCell>
                      <TableCell className="text-right">₹32,308</TableCell>
                      <TableCell className="text-right text-red-600">₹3,402</TableCell>
                      <TableCell className="text-right font-medium">₹28,906</TableCell>
                      <TableCell className="text-right">₹36,300</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Admin</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">₹28,000</TableCell>
                      <TableCell className="text-right text-red-600">₹2,000</TableCell>
                      <TableCell className="text-right font-medium">₹26,000</TableCell>
                      <TableCell className="text-right">₹31,200</TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{payrollData.length}</TableCell>
                      <TableCell className="text-right">{formatIndianCurrency(payrollSummary.totalGross)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatIndianCurrency(payrollSummary.totalDeductions)}</TableCell>
                      <TableCell className="text-right">{formatIndianCurrency(payrollSummary.totalNetPay)}</TableCell>
                      <TableCell className="text-right">{formatIndianCurrency(payrollSummary.totalEmployerCost)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
