'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  FileText, 
  Download, 
  Printer,
  Users,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Loader2
} from 'lucide-react';
import { MONTHS } from '@/lib/constants';
import { formatIndianCurrency } from '@/lib/indian-payroll';
import { useToast } from '@/hooks/use-toast';

const reportCategories = [
  { id: 'payroll', name: 'Payroll Reports', icon: IndianRupee, count: 5 },
  { id: 'compliance', name: 'Compliance Reports', icon: ShieldCheck, count: 4 },
  { id: 'attendance', name: 'Attendance Reports', icon: Calendar, count: 3 },
  { id: 'employee', name: 'Employee Reports', icon: Users, count: 4 },
];

const payrollReports = [
  { id: 'salary-register', name: 'Salary Register', description: 'Complete salary details for all employees', format: 'Excel, PDF', type: 'payroll' },
  { id: 'payslip-summary', name: 'Payslip Summary', description: 'Monthly payslip summary for distribution', format: 'PDF', type: 'payroll' },
  { id: 'bank-transfer', name: 'Bank Transfer File', description: 'Bank format file for salary transfer', format: 'Excel, CSV', type: 'payroll' },
  { id: 'statutory-summary', name: 'Statutory Summary', description: 'EPF, ESI, PT, LWF summary', format: 'Excel, PDF', type: 'payroll' },
  { id: 'department-summary', name: 'Department-wise Summary', description: 'Payroll breakdown by department', format: 'Excel, PDF', type: 'payroll' },
];

const complianceReports = [
  { id: 'epf-ecr', name: 'EPF ECR File', description: 'Electronic Challan-cum-Return for EPF filing', format: 'CSV', type: 'compliance' },
  { id: 'esi-return', name: 'ESI Return File', description: 'ESI monthly contribution return', format: 'Excel, CSV', type: 'compliance' },
  { id: 'pt-return', name: 'PT Return', description: 'Professional Tax monthly return', format: 'Excel, PDF', type: 'compliance' },
  { id: 'form-10', name: 'Form 10', description: 'EPF member details and contributions', format: 'PDF', type: 'compliance' },
];

const attendanceReports = [
  { id: 'monthly-attendance', name: 'Monthly Attendance', description: 'Day-wise attendance for all employees', format: 'Excel, PDF', type: 'attendance' },
  { id: 'late-coming', name: 'Late Coming Report', description: 'Employees with late arrivals', format: 'Excel, PDF', type: 'attendance' },
  { id: 'overtime-summary', name: 'Overtime Summary', description: 'Overtime hours and amounts', format: 'Excel, PDF', type: 'attendance' },
];

const employeeReports = [
  { id: 'employee-master', name: 'Employee Master', description: 'Complete employee details', format: 'Excel, PDF', type: 'employee' },
  { id: 'deployment-report', name: 'Deployment Report', description: 'Client-wise employee deployment', format: 'Excel, PDF', type: 'employee' },
  { id: 'document-status', name: 'Document Status', description: 'Pending document submissions', format: 'Excel, PDF', type: 'employee' },
  { id: 'exit-report', name: 'Exit Report', description: 'Employees resigned/terminated', format: 'Excel, PDF', type: 'employee' },
];

// Sample data for preview
const samplePayrollData = [
  { empCode: 'EMP00001', name: 'Rajesh Kumar', department: 'Security', gross: 18000, pf: 1440, esi: 135, pt: 200, net: 16225 },
  { empCode: 'EMP00002', name: 'Priya Sharma', department: 'Housekeeping', gross: 15000, pf: 1200, esi: 113, pt: 200, net: 13487 },
  { empCode: 'EMP00003', name: 'Amit Singh', department: 'Production', gross: 22000, pf: 1800, esi: 0, pt: 200, net: 20000 },
  { empCode: 'EMP00004', name: 'Sunita Devi', department: 'Production', gross: 12000, pf: 960, esi: 90, pt: 200, net: 10750 },
  { empCode: 'EMP00005', name: 'Rahul Verma', department: 'Admin', gross: 28000, pf: 1800, esi: 0, pt: 200, net: 26000 },
];

export function ReportsModule() {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [exportingReport, setExportingReport] = useState<string | null>(null);
  const { toast } = useToast();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const getMonthName = (month: number) => {
    return MONTHS.find(m => m.value === month)?.label || '';
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // Simplified Excel export (actually CSV with .xlsx extension for demo)
    // In production, you'd use a library like xlsx
    exportToCSV(data, filename);
  };

  const handleExportReport = async (report: any) => {
    setExportingReport(report.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let data: any[] = [];
      let filename = '';
      
      switch (report.id) {
        case 'salary-register':
        case 'payslip-summary':
        case 'statutory-summary':
        case 'department-summary':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Department': p.department,
            'Gross': p.gross,
            'PF': p.pf,
            'ESI': p.esi,
            'PT': p.pt,
            'Net Pay': p.net
          }));
          filename = `${report.id}_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'bank-transfer':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Bank Account': 'XXXXXXXXXX',
            'IFSC': 'HDFCXXXXXXX',
            'Amount': p.net
          }));
          filename = `bank_transfer_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'epf-ecr':
          data = samplePayrollData.map(p => ({
            'UAN': 'XXXXXXXXXX',
            'Name': p.name,
            'Gross Wages': p.gross,
            'EPF Wages': Math.min(p.gross, 15000),
            'EE Share': p.pf,
            'ER Share': Math.round(p.pf * 0.367),
            'EPS': Math.round(Math.min(p.gross, 15000) * 0.0833)
          }));
          filename = `EPF_ECR_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'esi-return':
          data = samplePayrollData.filter(p => p.esi > 0).map(p => ({
            'IP Number': 'XXXXXXXXXX',
            'Name': p.name,
            'Gross Wages': p.gross,
            'EE Share': p.esi,
            'ER Share': Math.round(p.esi * 4.33)
          }));
          filename = `ESI_Return_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'pt-return':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Gross': p.gross,
            'PT': p.pt
          }));
          filename = `PT_Return_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'monthly-attendance':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Present Days': 24,
            'Absent Days': 2,
            'Half Days': 0,
            'Overtime Hours': 8
          }));
          filename = `Attendance_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        case 'employee-master':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Department': p.department,
            'Status': 'Active',
            'DOJ': '2024-01-01'
          }));
          filename = `Employee_Master_${selectedYear}`;
          break;
          
        case 'deployment-report':
          data = samplePayrollData.map(p => ({
            'Employee Code': p.empCode,
            'Name': p.name,
            'Client': 'ABC Manufacturing',
            'Location': 'Mumbai',
            'Billing Rate': p.gross
          }));
          filename = `Deployment_Report_${getMonthName(selectedMonth)}_${selectedYear}`;
          break;
          
        default:
          data = samplePayrollData;
          filename = `${report.id}_${getMonthName(selectedMonth)}_${selectedYear}`;
      }
      
      exportToCSV(data, filename);
      
      toast({
        title: 'Export Complete',
        description: `${report.name} has been exported successfully`,
      });
    } finally {
      setExportingReport(null);
    }
  };

  const handlePrintPreview = () => {
    window.print();
  };

  const renderReportList = (reports: any[], colorClass: string, Icon: any) => (
    <div className="grid gap-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{report.format}</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport(report)}
                  disabled={exportingReport === report.id}
                >
                  {exportingReport === report.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export various reports</p>
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

      {/* Report Categories */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {reportCategories.map((cat) => (
          <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <cat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">{cat.count} reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="payroll">
        <TabsList>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="mt-4">
          {renderReportList(payrollReports, 'bg-emerald-500/10', FileText)}
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          {renderReportList(complianceReports, 'bg-sky-500/10', ShieldCheck)}
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          {renderReportList(attendanceReports, 'bg-amber-500/10', Calendar)}
        </TabsContent>

        <TabsContent value="employee" className="mt-4">
          {renderReportList(employeeReports, 'bg-purple-500/10', Users)}
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Salary Register - {getMonthName(selectedMonth)} {selectedYear}</CardTitle>
                <CardDescription>Preview of salary register report</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrintPreview}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleExportReport({ id: 'salary-register', name: 'Salary Register' })}
                  disabled={exportingReport === 'salary-register'}
                >
                  {exportingReport === 'salary-register' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Emp Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">PF</TableHead>
                      <TableHead className="text-right">ESI</TableHead>
                      <TableHead className="text-right">PT</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePayrollData.map((row) => (
                      <TableRow key={row.empCode}>
                        <TableCell className="font-medium">{row.empCode}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell className="text-right">{formatIndianCurrency(row.gross)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatIndianCurrency(row.pf)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatIndianCurrency(row.esi)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatIndianCurrency(row.pt)}</TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">{formatIndianCurrency(row.net)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={3}>Total (5 employees)</TableCell>
                      <TableCell className="text-right">{formatIndianCurrency(95000)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatIndianCurrency(7200)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatIndianCurrency(338)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatIndianCurrency(1000)}</TableCell>
                      <TableCell className="text-right text-emerald-600">{formatIndianCurrency(86462)}</TableCell>
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
