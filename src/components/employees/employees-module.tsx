'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  FileText,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EMPLOYEE_STATUS, EMPLOYMENT_TYPES, GENDER_OPTIONS, INDIAN_STATES, BLOOD_GROUPS, DOCUMENT_TYPES } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  designation?: string;
  department?: string;
  status: string;
  dateOfJoining?: string;
  salary?: number;
  clientName?: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  uanNumber?: string;
  esiNumber?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
  employmentType?: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-600',
  inactive: 'bg-gray-500/10 text-gray-600 border-gray-600',
  terminated: 'bg-red-500/10 text-red-600 border-red-600',
  resigned: 'bg-amber-500/10 text-amber-600 border-amber-600',
};

// Sample data for demo
const sampleEmployees: Employee[] = [
  { id: '1', employeeCode: 'EMP00001', firstName: 'Rajesh', lastName: 'Kumar', phone: '9876543210', email: 'rajesh@example.com', designation: 'Security Guard', department: 'Security', status: 'active', dateOfJoining: '2024-01-15', clientName: 'ABC Manufacturing', salary: 18000 },
  { id: '2', employeeCode: 'EMP00002', firstName: 'Priya', lastName: 'Sharma', phone: '9876543211', email: 'priya@example.com', designation: 'Housekeeping Staff', department: 'Housekeeping', status: 'active', dateOfJoining: '2024-02-01', clientName: 'XYZ Corp', salary: 15000 },
  { id: '3', employeeCode: 'EMP00003', firstName: 'Amit', lastName: 'Singh', phone: '9876543212', email: 'amit@example.com', designation: 'Machine Operator', department: 'Production', status: 'active', dateOfJoining: '2023-11-10', clientName: 'ABC Manufacturing', salary: 22000 },
  { id: '4', employeeCode: 'EMP00004', firstName: 'Sunita', lastName: 'Devi', phone: '9876543213', email: 'sunita@example.com', designation: 'Helper', department: 'Production', status: 'inactive', dateOfJoining: '2023-08-20', clientName: 'Tech Industries', salary: 12000 },
  { id: '5', employeeCode: 'EMP00005', firstName: 'Rahul', lastName: 'Verma', phone: '9876543214', email: 'rahul@example.com', designation: 'Supervisor', department: 'Admin', status: 'active', dateOfJoining: '2023-05-15', clientName: 'Global Services', salary: 28000 },
];

// Sample clients for deployment
const sampleClients = [
  { id: '1', name: 'ABC Manufacturing Pvt Ltd', location: 'Mumbai' },
  { id: '2', name: 'XYZ Corporation', location: 'Pune' },
  { id: '3', name: 'Tech Industries Ltd', location: 'Bangalore' },
  { id: '4', name: 'Global Services Inc', location: 'Chennai' },
];

export function EmployeesModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.designation?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeCount = employees.filter(e => e.status === 'active').length;
  const inactiveCount = employees.filter(e => e.status === 'inactive').length;

  // Export employees to CSV
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (filteredEmployees.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Data',
          description: 'No employees to export',
        });
        return;
      }
      
      const headers = ['Employee Code', 'First Name', 'Last Name', 'Phone', 'Email', 'Designation', 'Department', 'Status', 'Date of Joining', 'Client Name', 'Salary'];
      const csvContent = [
        headers.join(','),
        ...filteredEmployees.map(emp => [
          emp.employeeCode,
          emp.firstName,
          emp.lastName,
          emp.phone || '',
          emp.email || '',
          emp.designation || '',
          emp.department || '',
          emp.status,
          emp.dateOfJoining || '',
          emp.clientName || '',
          emp.salary || ''
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Complete',
        description: `Exported ${filteredEmployees.length} employees to CSV`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Failed to export employees',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Import employees from CSV
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsImporting(true);
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          toast({
            variant: 'destructive',
            title: 'Invalid File',
            description: 'CSV file must have headers and at least one data row',
          });
          return;
        }
        
        const importedEmployees: Employee[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 3) {
            importedEmployees.push({
              id: String(employees.length + i),
              employeeCode: values[0] || `EMP${String(employees.length + i).padStart(5, '0')}`,
              firstName: values[1] || '',
              lastName: values[2] || '',
              phone: values[3] || '',
              email: values[4] || '',
              designation: values[5] || '',
              department: values[6] || '',
              status: values[7] || 'active',
              dateOfJoining: values[8] || new Date().toISOString().split('T')[0],
              clientName: values[9] || '',
              salary: parseInt(values[10]) || 0,
            });
          }
        }
        
        setEmployees([...employees, ...importedEmployees]);
        toast({
          title: 'Import Complete',
          description: `Imported ${importedEmployees.length} employees from CSV`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Import Failed',
          description: 'Failed to parse CSV file. Please check the format.',
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    input.click();
  };

  const handleAddEmployee = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployee: Employee = {
        id: String(employees.length + 1),
        employeeCode: `EMP${String(employees.length + 1).padStart(5, '0')}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        designation: data.designation,
        department: data.department,
        status: data.status || 'active',
        dateOfJoining: data.dateOfJoining,
        salary: data.basicSalary,
      };
      
      setEmployees([...employees, newEmployee]);
      setIsAddDialogOpen(false);
      toast({
        title: 'Success',
        description: `Employee ${newEmployee.employeeCode} created successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create employee',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View employee details
  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  // Edit employee
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = async (data: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee?.id 
          ? { ...emp, ...data, salary: data.basicSalary }
          : emp
      ));
      
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: 'Success',
        description: 'Employee updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update employee',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Deploy employee to client
  const handleDeploy = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedClientId('');
    setIsDeployDialogOpen(true);
  };

  const confirmDeploy = async () => {
    if (!selectedClientId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a client',
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const client = sampleClients.find(c => c.id === selectedClientId);
      
      setEmployees(prev => prev.map(emp => 
        emp.id === selectedEmployee?.id 
          ? { ...emp, clientName: client?.name }
          : emp
      ));
      
      setIsDeployDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: 'Success',
        description: `Employee deployed to ${client?.name}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to deploy employee',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete employee
  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee?.id));
      
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete employee',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">Manage your workforce efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the employee details. All mandatory fields are marked with *
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <EmployeeForm 
                  onSubmit={handleAddEmployee} 
                  isLoading={isLoading}
                  onCancel={() => setIsAddDialogOpen(false)} 
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10">
                <Users className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <UserX className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactiveCount}</p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.filter(e => e.clientName).length}</p>
                <p className="text-sm text-muted-foreground">Deployed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {EMPLOYEE_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-muted-foreground">{employee.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.clientName || '-'}</TableCell>
                    <TableCell>₹{employee.salary?.toLocaleString('en-IN') || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[employee.status]}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(employee)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(employee)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeploy(employee)}>
                            <Briefcase className="h-4 w-4 mr-2" />
                            Deploy to Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(employee)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                  <p className="text-muted-foreground">{selectedEmployee.employeeCode}</p>
                  <Badge variant="outline" className={statusColors[selectedEmployee.status]}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.email || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Employment Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEmployee.designation} - {selectedEmployee.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>DOJ: {selectedEmployee.dateOfJoining || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Deployment</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEmployee.clientName || 'Not deployed'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Salary</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>₹{selectedEmployee.salary?.toLocaleString('en-IN') || '-'}/month</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(selectedEmployee);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee details
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <EmployeeForm 
              onSubmit={handleUpdateEmployee} 
              isLoading={isLoading}
              onCancel={() => setIsEditDialogOpen(false)} 
              initialData={selectedEmployee}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Deploy Employee Dialog */}
      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deploy Employee to Client</DialogTitle>
            <DialogDescription>
              Select a client to deploy {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Client</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {sampleClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDeployDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmDeploy} disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Deploy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              This action cannot be undone. This will permanently delete the employee record.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface EmployeeFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Employee | null;
}

function EmployeeForm({ onSubmit, onCancel, isLoading, initialData }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    fatherName: initialData?.fatherName || '',
    motherName: initialData?.motherName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
    bloodGroup: initialData?.bloodGroup || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    permanentAddress: initialData?.permanentAddress || '',
    permanentCity: initialData?.permanentCity || '',
    permanentState: initialData?.permanentState || '',
    permanentPincode: initialData?.permanentPincode || '',
    dateOfJoining: initialData?.dateOfJoining || '',
    designation: initialData?.designation || '',
    department: initialData?.department || '',
    employmentType: initialData?.employmentType || 'contract',
    status: initialData?.status || 'active',
    aadhaarNumber: initialData?.aadhaarNumber || '',
    panNumber: initialData?.panNumber || '',
    uanNumber: initialData?.uanNumber || '',
    esiNumber: initialData?.esiNumber || '',
    bankName: initialData?.bankName || '',
    bankAccountNo: initialData?.bankAccountNo || '',
    bankIfsc: initialData?.bankIfsc || '',
    bankBranch: initialData?.bankBranch || '',
    basicSalary: initialData?.salary || '',
    dearnessAllowance: '',
    houseRentAllowance: '',
    conveyanceAllowance: '',
    medicalAllowance: '',
    specialAllowance: '',
    workingDays: 26,
    pfApplicable: true,
    esiApplicable: true,
    ptApplicable: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father&apos;s Name</Label>
                <Input 
                  id="fatherName" 
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother&apos;s Name</Label>
                <Input 
                  id="motherName" 
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={(e) => handleChange('motherName', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(v) => handleChange('bloodGroup', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Textarea 
                id="permanentAddress" 
                placeholder="Enter complete address"
                value={formData.permanentAddress}
                onChange={(e) => handleChange('permanentAddress', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permanentState">State</Label>
                <Select value={formData.permanentState} onValueChange={(v) => handleChange('permanentState', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanentCity">City</Label>
                <Input 
                  id="permanentCity" 
                  placeholder="City"
                  value={formData.permanentCity}
                  onChange={(e) => handleChange('permanentCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanentPincode">Pincode</Label>
                <Input 
                  id="permanentPincode" 
                  placeholder="6 digit pincode"
                  value={formData.permanentPincode}
                  onChange={(e) => handleChange('permanentPincode', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                <Input 
                  id="dateOfJoining" 
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => handleChange('dateOfJoining', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select value={formData.employmentType} onValueChange={(v) => handleChange('employmentType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input 
                  id="designation" 
                  placeholder="e.g., Security Guard"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  placeholder="e.g., Security"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Identification Documents</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input 
                    id="aadhaarNumber" 
                    placeholder="12 digit Aadhaar"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input 
                    id="panNumber" 
                    placeholder="10 character PAN"
                    value={formData.panNumber}
                    onChange={(e) => handleChange('panNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Statutory Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uanNumber">UAN Number</Label>
                  <Input 
                    id="uanNumber" 
                    placeholder="EPF UAN"
                    value={formData.uanNumber}
                    onChange={(e) => handleChange('uanNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esiNumber">ESI Number</Label>
                  <Input 
                    id="esiNumber" 
                    placeholder="ESI IP Number"
                    value={formData.esiNumber}
                    onChange={(e) => handleChange('esiNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">Bank Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName" 
                    placeholder="Bank name"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNo">Account Number</Label>
                  <Input 
                    id="bankAccountNo" 
                    placeholder="Account number"
                    value={formData.bankAccountNo}
                    onChange={(e) => handleChange('bankAccountNo', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankIfsc">IFSC Code</Label>
                  <Input 
                    id="bankIfsc" 
                    placeholder="IFSC code"
                    value={formData.bankIfsc}
                    onChange={(e) => handleChange('bankIfsc', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankBranch">Branch</Label>
                  <Input 
                    id="bankBranch" 
                    placeholder="Branch name"
                    value={formData.bankBranch}
                    onChange={(e) => handleChange('bankBranch', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {DOCUMENT_TYPES.map((doc) => (
                <div key={doc.value} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Upload {doc.label.toLowerCase()} (PDF, JPG, PNG)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" type="button">
                    Upload
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Working Days/Month</Label>
                  <Input 
                    id="workingDays" 
                    type="number"
                    value={formData.workingDays}
                    onChange={(e) => handleChange('workingDays', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Earnings (Monthly)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary *</Label>
                    <Input 
                      id="basicSalary" 
                      type="number" 
                      placeholder="0"
                      value={formData.basicSalary}
                      onChange={(e) => handleChange('basicSalary', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dearnessAllowance">Dearness Allowance</Label>
                    <Input 
                      id="dearnessAllowance" 
                      type="number" 
                      placeholder="0"
                      value={formData.dearnessAllowance}
                      onChange={(e) => handleChange('dearnessAllowance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseRentAllowance">House Rent Allowance</Label>
                    <Input 
                      id="houseRentAllowance" 
                      type="number" 
                      placeholder="0"
                      value={formData.houseRentAllowance}
                      onChange={(e) => handleChange('houseRentAllowance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conveyanceAllowance">Conveyance</Label>
                    <Input 
                      id="conveyanceAllowance" 
                      type="number" 
                      placeholder="0"
                      value={formData.conveyanceAllowance}
                      onChange={(e) => handleChange('conveyanceAllowance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                    <Input 
                      id="medicalAllowance" 
                      type="number" 
                      placeholder="0"
                      value={formData.medicalAllowance}
                      onChange={(e) => handleChange('medicalAllowance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialAllowance">Special Allowance</Label>
                    <Input 
                      id="specialAllowance" 
                      type="number" 
                      placeholder="0"
                      value={formData.specialAllowance}
                      onChange={(e) => handleChange('specialAllowance', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Statutory Applicability</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="pfApplicable" 
                      checked={formData.pfApplicable}
                      onCheckedChange={(checked) => handleChange('pfApplicable', checked)}
                    />
                    <Label htmlFor="pfApplicable">PF Applicable</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="esiApplicable" 
                      checked={formData.esiApplicable}
                      onCheckedChange={(checked) => handleChange('esiApplicable', checked)}
                    />
                    <Label htmlFor="esiApplicable">ESI Applicable</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="ptApplicable" 
                      checked={formData.ptApplicable}
                      onCheckedChange={(checked) => handleChange('ptApplicable', checked)}
                    />
                    <Label htmlFor="ptApplicable">PT Applicable</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {initialData ? 'Update Employee' : 'Save Employee'}
          </Button>
        </div>
      </div>
    </form>
  );
}
