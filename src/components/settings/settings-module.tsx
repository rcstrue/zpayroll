'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Calculator,
  FileText,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { INDIAN_STATES, LEAVE_TYPES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

// Sample organization data
const sampleOrganization = {
  name: 'ABC Manpower Services Pvt Ltd',
  gstin: '27AABCU9603R1ZM',
  pan: 'AABCU9603R',
  cin: 'U74999MH2020PTC123456',
  registrationNumber: 'MH/CL/2020/12345',
  pfEstablishmentCode: 'MHBAN123456',
  esiEstablishmentCode: '123456',
  address: '123, Business Park, Andheri East',
  city: 'Mumbai',
  state: 'MH',
  pincode: '400069',
  phone: '022-12345678',
  email: 'info@abcmanpower.com',
  website: 'www.abcmanpower.com',
  bankName: 'HDFC Bank',
  bankAccountNo: '50100123456789',
  bankIfsc: 'HDFC0001234',
  bankBranch: 'Andheri East',
};

const sampleUsers = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', role: 'admin', status: 'active' },
  { id: '2', name: 'HR Manager', email: 'hr@company.com', role: 'hr', status: 'active' },
  { id: '3', name: 'Accountant', email: 'accounts@company.com', role: 'accountant', status: 'active' },
];

const sampleSalaryStructures = [
  { id: '1', name: 'Unskilled Worker', basic: 9000, da: 1000, hra: 1500, gross: 12500 },
  { id: '2', name: 'Semi-Skilled Worker', basic: 11000, da: 1500, hra: 2000, gross: 16000 },
  { id: '3', name: 'Skilled Worker', basic: 14000, da: 2000, hra: 3000, gross: 21000 },
  { id: '4', name: 'Supervisor', basic: 18000, da: 3000, hra: 4000, gross: 28000 },
];

export function SettingsModule() {
  const [orgData, setOrgData] = useState(sampleOrganization);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'Success',
      description: 'Settings saved successfully',
    });
  };

  const handleChange = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage organization and system settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="organization">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="salary">Salary Structures</TabsTrigger>
          <TabsTrigger value="leaves">Leave Types</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Basic company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input 
                    id="name" 
                    value={orgData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input 
                    id="gstin"
                    value={orgData.gstin}
                    onChange={(e) => handleChange('gstin', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input 
                    id="pan"
                    value={orgData.pan}
                    onChange={(e) => handleChange('pan', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN</Label>
                  <Input 
                    id="cin"
                    value={orgData.cin}
                    onChange={(e) => handleChange('cin', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Labour License Number</Label>
                  <Input 
                    id="registrationNumber"
                    value={orgData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    value={orgData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={orgData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    value={orgData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address"
                  value={orgData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={orgData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={orgData.state} onValueChange={(v) => handleChange('state', v)}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input 
                    id="pincode"
                    value={orgData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Bank account for salary payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName"
                    value={orgData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNo">Account Number</Label>
                  <Input 
                    id="bankAccountNo"
                    value={orgData.bankAccountNo}
                    onChange={(e) => handleChange('bankAccountNo', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankIfsc">IFSC Code</Label>
                  <Input 
                    id="bankIfsc"
                    value={orgData.bankIfsc}
                    onChange={(e) => handleChange('bankIfsc', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankBranch">Branch</Label>
                  <Input 
                    id="bankBranch"
                    value={orgData.bankBranch}
                    onChange={(e) => handleChange('bankBranch', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage users and their access permissions</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'admin' ? 'text-purple-600 border-purple-600' :
                            user.role === 'hr' ? 'text-emerald-600 border-emerald-600' :
                            'text-sky-600 border-sky-600'
                          }>
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Compliance Settings
              </CardTitle>
              <CardDescription>Configure statutory compliance parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* EPF Settings */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">EPF Settings</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pfCode">PF Establishment Code</Label>
                    <Input 
                      id="pfCode"
                      value={orgData.pfEstablishmentCode}
                      onChange={(e) => handleChange('pfEstablishmentCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pfRate">Employee Rate (%)</Label>
                    <Input id="pfRate" type="number" defaultValue={12} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pfEmployerRate">Employer Rate (%)</Label>
                    <Input id="pfEmployerRate" type="number" defaultValue={12} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pfCeiling">Wage Ceiling</Label>
                    <Input id="pfCeiling" type="number" defaultValue={15000} />
                  </div>
                </div>
              </div>

              {/* ESI Settings */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">ESI Settings</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="esiCode">ESI Establishment Code</Label>
                    <Input 
                      id="esiCode"
                      value={orgData.esiEstablishmentCode}
                      onChange={(e) => handleChange('esiEstablishmentCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esiEmployeeRate">Employee Rate (%)</Label>
                    <Input id="esiEmployeeRate" type="number" defaultValue={0.75} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esiEmployerRate">Employer Rate (%)</Label>
                    <Input id="esiEmployerRate" type="number" defaultValue={3.25} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="esiCeiling">Wage Ceiling</Label>
                    <Input id="esiCeiling" type="number" defaultValue={21000} />
                  </div>
                </div>
              </div>

              {/* PT Settings */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Professional Tax Settings</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ptAmount">Monthly PT Amount</Label>
                    <Input id="ptAmount" type="number" defaultValue={200} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ptState">State</Label>
                    <Select defaultValue="MH">
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Salary Structures
                </CardTitle>
                <CardDescription>Define salary structures for different employee categories</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Structure
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Structure Name</TableHead>
                      <TableHead className="text-right">Basic</TableHead>
                      <TableHead className="text-right">DA</TableHead>
                      <TableHead className="text-right">HRA</TableHead>
                      <TableHead className="text-right">Gross</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleSalaryStructures.map((ss) => (
                      <TableRow key={ss.id}>
                        <TableCell className="font-medium">{ss.name}</TableCell>
                        <TableCell className="text-right">₹{ss.basic.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">₹{ss.da.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">₹{ss.hra.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-bold">₹{ss.gross.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Leave Types
                </CardTitle>
                <CardDescription>Configure leave types and annual quotas</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Leave Type
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Annual Quota</TableHead>
                      <TableHead>Carry Forward</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LEAVE_TYPES.map((lt) => (
                      <TableRow key={lt.value}>
                        <TableCell className="font-medium">{lt.label}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lt.value.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{lt.quota} days</TableCell>
                        <TableCell>
                          {lt.value === 'earned' ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600">Yes (Max 10)</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600">Paid</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
