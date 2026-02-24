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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  FileText, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Send,
  Loader2
} from 'lucide-react';
import { MONTHS } from '@/lib/constants';
import { formatIndianCurrency } from '@/lib/indian-payroll';

// Compliance due dates and status
const complianceItems = [
  {
    type: 'EPF',
    month: 'January 2025',
    dueDate: '2025-02-15',
    employeeContribution: 245780,
    employerContribution: 167280,
    epsContribution: 78500,
    adminCharges: 12289,
    total: 503849,
    status: 'pending',
    challanNo: null,
  },
  {
    type: 'ESI',
    month: 'January 2025',
    dueDate: '2025-02-15',
    employeeContribution: 15340,
    employerContribution: 66470,
    total: 81810,
    status: 'pending',
    challanNo: null,
  },
  {
    type: 'PT',
    month: 'January 2025',
    dueDate: '2025-02-21',
    total: 49600,
    status: 'pending',
    challanNo: null,
  },
  {
    type: 'LWF',
    month: 'H2 2024',
    dueDate: '2025-01-15',
    employeeContribution: 2796,
    employerContribution: 8388,
    total: 11184,
    status: 'paid',
    challanNo: 'LWF/MH/2024/H2/001',
  },
];

const epfRecords = [
  { month: 'January 2025', wages: 2048167, employee: 245780, employer: 89780, eps: 78500, edli: 10241, admin: 12289, status: 'pending' },
  { month: 'December 2024', wages: 2015420, employee: 241850, employer: 88220, eps: 77230, edli: 10077, admin: 12077, status: 'paid' },
  { month: 'November 2024', wages: 1987200, employee: 238464, employer: 86804, eps: 76000, edli: 9936, admin: 11923, status: 'paid' },
];

const esiRecords = [
  { month: 'January 2025', wages: 2045200, employee: 15340, employer: 66470, total: 81810, status: 'pending' },
  { month: 'December 2024', wages: 2012400, employee: 15093, employer: 65405, total: 80498, status: 'paid' },
  { month: 'November 2024', wages: 1985000, employee: 14888, employer: 64513, total: 79401, status: 'paid' },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', badge: 'secondary' as const },
  paid: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', badge: 'default' as const },
  overdue: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', badge: 'destructive' as const },
};

export function ComplianceModule() {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isExportingEPF, setIsExportingEPF] = useState(false);
  const [isExportingESI, setIsExportingESI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Export EPF ECR File
  const handleExportEPF = async () => {
    setIsExportingEPF(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const csvContent = [
        'UAN,Name,Gross Wages,EPF Wages,EE Share,ER Share,EPS,EDLI,Admin Charges',
        ...epfRecords.map(r => 
          `XXXXXXXXXX,Employee Name,${r.wages},${Math.min(r.wages, 15000)},${r.employee},${r.employer},${r.eps},${r.edli},${r.admin}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EPF_ECR_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingEPF(false);
    }
  };

  // Export ESI Return File
  const handleExportESI = async () => {
    setIsExportingESI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const csvContent = [
        'IP Number,Name,Gross Wages,EE Share (0.75%),ER Share (3.25%),Total',
        ...esiRecords.map(r => 
          `XXXXXXXXXX,Employee Name,${r.wages},${r.employee},${r.employer},${r.total}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ESI_Return_${selectedMonth}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingESI(false);
    }
  };

  // Handle Challan Upload
  const handleUploadChallan = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.png';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);
        alert(`Challan "${file.name}" uploaded successfully!`);
      }
    };
    
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">EPF, ESI, PT, LWF compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUploadChallan} disabled={isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Upload Challan
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Returns
          </Button>
        </div>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">EPF Due</p>
                <p className="text-2xl font-bold">{formatIndianCurrency(503849)}</p>
                <p className="text-xs text-amber-600 mt-1">Due: 15 Feb 2025</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ESI Due</p>
                <p className="text-2xl font-bold">{formatIndianCurrency(81810)}</p>
                <p className="text-xs text-amber-600 mt-1">Due: 15 Feb 2025</p>
              </div>
              <div className="p-3 rounded-full bg-sky-500/10">
                <ShieldCheck className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">PT Due</p>
                <p className="text-2xl font-bold">{formatIndianCurrency(49600)}</p>
                <p className="text-xs text-amber-600 mt-1">Due: 21 Feb 2025</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">LWF Status</p>
                <p className="text-2xl font-bold text-emerald-600">Paid</p>
                <p className="text-xs text-muted-foreground mt-1">H2 2024 - MH</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="epf">EPF</TabsTrigger>
          <TabsTrigger value="esi">ESI</TabsTrigger>
          <TabsTrigger value="pt">Professional Tax</TabsTrigger>
          <TabsTrigger value="lwf">LWF</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Compliance Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Challan</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceItems.map((item, index) => {
                      const config = statusConfig[item.status as keyof typeof statusConfig];
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                item.type === 'EPF' ? 'text-emerald-600 border-emerald-600' :
                                item.type === 'ESI' ? 'text-sky-600 border-sky-600' :
                                item.type === 'PT' ? 'text-amber-600 border-amber-600' :
                                'text-purple-600 border-purple-600'
                              }
                            >
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(item.dueDate).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatIndianCurrency(item.total)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={config.badge} className={`${config.bg} ${config.color}`}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.challanNo || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {item.status === 'pending' && (
                                <Button size="sm">
                                  <Send className="h-4 w-4 mr-1" />
                                  Pay Now
                                </Button>
                              )}
                            </div>
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

        <TabsContent value="epf" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>EPF Contribution Records</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportEPF} disabled={isExportingEPF}>
                  {isExportingEPF ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Export ECR
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  File Return
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">EPF Wages</TableHead>
                      <TableHead className="text-right">EE Share (12%)</TableHead>
                      <TableHead className="text-right">ER Share (3.67%)</TableHead>
                      <TableHead className="text-right">EPS (8.33%)</TableHead>
                      <TableHead className="text-right">EDLI</TableHead>
                      <TableHead className="text-right">Admin</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {epfRecords.map((record, index) => {
                      const config = statusConfig[record.status as keyof typeof statusConfig];
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.month}</TableCell>
                          <TableCell className="text-right">₹{record.wages.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.employee.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.employer.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.eps.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.edli.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.admin.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <Badge variant={config.badge} className={`${config.bg} ${config.color}`}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">EPF Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Employee Contribution</p>
                  <p className="text-xl font-bold">12% of Wages</p>
                  <p className="text-xs text-muted-foreground mt-1">Max wage ceiling: ₹15,000</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Employer EPF Share</p>
                  <p className="text-xl font-bold">3.67% of Wages</p>
                  <p className="text-xs text-muted-foreground mt-1">After EPS allocation</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">EPS Contribution</p>
                  <p className="text-xl font-bold">8.33% of Wages</p>
                  <p className="text-xs text-muted-foreground mt-1">Max ₹1,250/month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="esi" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>ESI Contribution Records</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportESI} disabled={isExportingESI}>
                  {isExportingESI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Export
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  File Return
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">ESI Wages</TableHead>
                      <TableHead className="text-right">EE Share (0.75%)</TableHead>
                      <TableHead className="text-right">ER Share (3.25%)</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {esiRecords.map((record, index) => {
                      const config = statusConfig[record.status as keyof typeof statusConfig];
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.month}</TableCell>
                          <TableCell className="text-right">₹{record.wages.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.employee.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right">₹{record.employer.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right font-bold">₹{record.total.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <Badge variant={config.badge} className={`${config.bg} ${config.color}`}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ESI Calculation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Employee Contribution</p>
                  <p className="text-xl font-bold">0.75% of Wages</p>
                  <p className="text-xs text-muted-foreground mt-1">For wages up to ₹21,000</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Employer Contribution</p>
                  <p className="text-xl font-bold">3.25% of Wages</p>
                  <p className="text-xs text-muted-foreground mt-1">For wages up to ₹21,000</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Wage Ceiling</p>
                  <p className="text-xl font-bold">₹21,000/month</p>
                  <p className="text-xs text-muted-foreground mt-1">Above this ESI not applicable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pt" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Tax Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Employees</TableHead>
                      <TableHead className="text-right">PT per Employee</TableHead>
                      <TableHead className="text-right">Total PT</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">January 2025</TableCell>
                      <TableCell className="text-right">233</TableCell>
                      <TableCell className="text-right">₹200</TableCell>
                      <TableCell className="text-right font-bold">₹49,600</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                          pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Pay Now</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">December 2024</TableCell>
                      <TableCell className="text-right">230</TableCell>
                      <TableCell className="text-right">₹200</TableCell>
                      <TableCell className="text-right font-bold">₹46,000</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/10 text-emerald-600">
                          paid
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Receipt</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lwf" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Labour Welfare Fund Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">EE Share</TableHead>
                      <TableHead className="text-right">ER Share</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">H2 2024 (Jul-Dec)</TableCell>
                      <TableCell>Maharashtra</TableCell>
                      <TableCell className="text-right">₹2,796</TableCell>
                      <TableCell className="text-right">₹8,388</TableCell>
                      <TableCell className="text-right font-bold">₹11,184</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/10 text-emerald-600">
                          paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">H1 2024 (Jan-Jun)</TableCell>
                      <TableCell>Maharashtra</TableCell>
                      <TableCell className="text-right">₹2,796</TableCell>
                      <TableCell className="text-right">₹8,388</TableCell>
                      <TableCell className="text-right font-bold">₹11,184</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-500/10 text-emerald-600">
                          paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Maharashtra LWF Rates</p>
                <div className="flex gap-8 mt-2 text-sm text-muted-foreground">
                  <span>Employee: ₹12 (Half-yearly)</span>
                  <span>Employer: ₹36 (Half-yearly)</span>
                  <span>Due: 15th Jan & 15th July</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
