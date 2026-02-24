'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { 
  Building2, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Users,
  FileText,
  MapPin,
  Loader2,
  Upload,
  Download,
  Factory,
  X,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Building,
  MapPinned,
  User,
  Copy,
  MoreVertical
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { INDIAN_STATES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClientUnit {
  id: string;
  unitCode: string;
  unitName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'inactive';
  deployedCount: number;
}

interface Client {
  id: string;
  clientCode: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  state: string;
  activeDeployments: number;
  status: string;
  contractValue: number;
  units: ClientUnit[];
  gstin?: string;
  pan?: string;
  pfCode?: string;
  esiCode?: string;
  billingAddress?: string;
  pincode?: string;
}

// Sample client data
const sampleClients: Client[] = [
  { 
    id: '1', 
    clientCode: 'CLI001', 
    companyName: 'ABC Manufacturing Pvt Ltd', 
    contactPerson: 'Mr. Ramesh Patel', 
    contactPhone: '9876543210', 
    contactEmail: 'ramesh@abcmfg.com', 
    city: 'Mumbai', 
    state: 'Maharashtra', 
    activeDeployments: 45, 
    status: 'active', 
    contractValue: 1500000,
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    pfCode: 'MH/12345',
    esiCode: 'MH-12345',
    units: [
      { id: 'u1', unitCode: 'CLI001-UNI001', unitName: 'Factory Unit - Andheri', address: 'Plot 45, MIDC Industrial Area', city: 'Mumbai', state: 'MH', pincode: '400093', contactPerson: 'Mr. Sharma', contactPhone: '9876543220', status: 'active', deployedCount: 25 },
      { id: 'u2', unitCode: 'CLI001-UNI002', unitName: 'Warehouse - Bhiwandi', address: 'Sector 12, Industrial Zone', city: 'Bhiwandi', state: 'MH', pincode: '421302', contactPerson: 'Mr. Patil', contactPhone: '9876543221', status: 'active', deployedCount: 20 },
    ]
  },
  { 
    id: '2', 
    clientCode: 'CLI002', 
    companyName: 'XYZ Corporation', 
    contactPerson: 'Ms. Sunita Sharma', 
    contactPhone: '9876543211', 
    contactEmail: 'sunita@xyzcorp.com', 
    city: 'Pune', 
    state: 'Maharashtra', 
    activeDeployments: 38, 
    status: 'active', 
    contractValue: 1200000,
    units: [
      { id: 'u3', unitCode: 'CLI002-UNI001', unitName: 'Main Office - Hinjewadi', address: 'IT Park, Phase 2', city: 'Pune', state: 'MH', pincode: '411057', contactPerson: 'Ms. Kulkarni', contactPhone: '9876543230', status: 'active', deployedCount: 38 },
    ]
  },
  { 
    id: '3', 
    clientCode: 'CLI003', 
    companyName: 'Tech Industries Ltd', 
    contactPerson: 'Mr. Amit Kumar', 
    contactPhone: '9876543212', 
    contactEmail: 'amit@techind.com', 
    city: 'Bangalore', 
    state: 'Karnataka', 
    activeDeployments: 25, 
    status: 'active', 
    contractValue: 800000,
    units: [
      { id: 'u4', unitCode: 'CLI003-UNI001', unitName: 'Production Unit - Electronic City', address: 'Plot 78, Tech Park', city: 'Bangalore', state: 'KA', pincode: '560100', contactPerson: 'Mr. Reddy', contactPhone: '9876543240', status: 'active', deployedCount: 15 },
      { id: 'u5', unitCode: 'CLI003-UNI002', unitName: 'R&D Center - Whitefield', address: 'ITPL Main Road', city: 'Bangalore', state: 'KA', pincode: '560066', contactPerson: 'Ms. Nair', contactPhone: '9876543241', status: 'active', deployedCount: 10 },
    ]
  },
  { 
    id: '4', 
    clientCode: 'CLI004', 
    companyName: 'Global Services Inc', 
    contactPerson: "Mr. John D'Souza", 
    contactPhone: '9876543213', 
    contactEmail: 'john@globalserv.com', 
    city: 'Chennai', 
    state: 'Tamil Nadu', 
    activeDeployments: 12, 
    status: 'inactive', 
    contractValue: 450000,
    units: []
  },
];

export function ClientsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingUnit, setEditingUnit] = useState<ClientUnit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Client Form State
  const [clientForm, setClientForm] = useState({
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    city: '',
    state: '',
    pincode: '',
    billingAddress: '',
    gstin: '',
    pan: '',
    pfCode: '',
    esiCode: '',
    contractValue: '',
  });

  // Unit Form State
  const [unitForm, setUnitForm] = useState({
    unitName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    contactPhone: '',
  });

  const filteredClients = clients.filter((client) => {
    return (
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalDeployments = clients.reduce((acc, c) => acc + c.activeDeployments, 0);
  const totalUnits = clients.reduce((acc, c) => acc + c.units.length, 0);

  const resetClientForm = () => {
    setClientForm({
      companyName: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      city: '',
      state: '',
      pincode: '',
      billingAddress: '',
      gstin: '',
      pan: '',
      pfCode: '',
      esiCode: '',
      contractValue: '',
    });
    setEditingClient(null);
  };

  const resetUnitForm = () => {
    setUnitForm({
      unitName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      contactPerson: '',
      contactPhone: '',
    });
    setEditingUnit(null);
  };

  const handleSaveClient = async () => {
    if (!clientForm.companyName || !clientForm.contactPerson) {
      toast({ variant: 'destructive', title: 'Error', description: 'Company name and contact person are required' });
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (editingClient) {
      // Update existing client
      setClients(prev => prev.map(c => 
        c.id === editingClient.id 
          ? { ...c, ...clientForm, contractValue: Number(clientForm.contractValue) || 0 }
          : c
      ));
      toast({ title: 'Success', description: 'Client updated successfully' });
    } else {
      // Add new client
      const newClient: Client = {
        id: `c${Date.now()}`,
        clientCode: `CLI${String(clients.length + 1).padStart(3, '0')}`,
        ...clientForm,
        contractValue: Number(clientForm.contractValue) || 0,
        activeDeployments: 0,
        status: 'active',
        units: [],
      };
      setClients(prev => [...prev, newClient]);
      toast({ title: 'Success', description: `Client ${newClient.clientCode} created successfully` });
    }

    setIsAddClientOpen(false);
    resetClientForm();
    setIsLoading(false);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    if (selectedClient?.id === clientId) {
      setSelectedClient(null);
    }
    toast({ title: 'Success', description: 'Client deleted successfully' });
  };

  const handleSaveUnit = async () => {
    if (!selectedClient) return;
    if (!unitForm.unitName || !unitForm.city) {
      toast({ variant: 'destructive', title: 'Error', description: 'Unit name and city are required' });
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (editingUnit) {
      // Update existing unit
      setClients(prev => prev.map(c => 
        c.id === selectedClient.id 
          ? { ...c, units: c.units.map(u => u.id === editingUnit.id ? { ...u, ...unitForm } : u) }
          : c
      ));
      setSelectedClient(prev => prev ? { 
        ...prev, 
        units: prev.units.map(u => u.id === editingUnit.id ? { ...u, ...unitForm } : u) 
      } : null);
      toast({ title: 'Success', description: 'Unit updated successfully' });
    } else {
      // Add new unit
      const newUnit: ClientUnit = {
        id: `u${Date.now()}`,
        unitCode: `${selectedClient.clientCode}-UNI${String(selectedClient.units.length + 1).padStart(3, '0')}`,
        ...unitForm,
        status: 'active',
        deployedCount: 0,
      };
      
      setClients(prev => prev.map(c => 
        c.id === selectedClient.id 
          ? { ...c, units: [...c.units, newUnit] }
          : c
      ));
      setSelectedClient(prev => prev ? { ...prev, units: [...prev.units, newUnit] } : null);
      toast({ title: 'Success', description: `Unit ${newUnit.unitCode} added successfully` });
    }

    setIsAddUnitOpen(false);
    resetUnitForm();
    setIsLoading(false);
  };

  const handleDeleteUnit = (unitId: string) => {
    if (!selectedClient) return;
    
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id 
        ? { ...c, units: c.units.filter(u => u.id !== unitId) }
        : c
    ));
    setSelectedClient(prev => prev ? { ...prev, units: prev.units.filter(u => u.id !== unitId) } : null);
    toast({ title: 'Success', description: 'Unit deleted successfully' });
  };

  const openEditClient = (client: Client) => {
    setEditingClient(client);
    setClientForm({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      contactPhone: client.contactPhone,
      contactEmail: client.contactEmail,
      city: client.city,
      state: client.state,
      pincode: client.pincode || '',
      billingAddress: client.billingAddress || '',
      gstin: client.gstin || '',
      pan: client.pan || '',
      pfCode: client.pfCode || '',
      esiCode: client.esiCode || '',
      contractValue: String(client.contractValue),
    });
    setIsAddClientOpen(true);
  };

  const openAddUnit = () => {
    resetUnitForm();
    setIsAddUnitOpen(true);
  };

  const openEditUnit = (unit: ClientUnit) => {
    setEditingUnit(unit);
    setUnitForm({
      unitName: unit.unitName,
      address: unit.address,
      city: unit.city,
      state: unit.state,
      pincode: unit.pincode,
      contactPerson: unit.contactPerson,
      contactPhone: unit.contactPhone,
    });
    setIsAddUnitOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client & Unit Management</h1>
          <p className="text-muted-foreground">Manage principal employers and their work locations</p>
        </div>
        <Button onClick={() => { resetClientForm(); setIsAddClientOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
              <div className="p-3 rounded-full bg-sky-500/10">
                <Building2 className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalUnits}</p>
                <p className="text-sm text-muted-foreground">Total Units</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <Factory className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalDeployments}</p>
                <p className="text-sm text-muted-foreground">Deployed Staff</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">₹{(clients.reduce((a, c) => a + c.contractValue, 0) / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground">Annual Billing</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <IndianRupee className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Client List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="px-4 pb-4 space-y-2">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No clients found</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all",
                          "hover:border-primary/50 hover:bg-muted/50",
                          selectedClient?.id === client.id && "border-primary bg-primary/5"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{client.companyName}</p>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  client.status === 'active' 
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-600/20" 
                                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                )}
                              >
                                {client.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{client.clientCode}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Factory className="h-3 w-3" />
                                {client.units.length} units
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {client.activeDeployments}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Client Details & Units */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <Card className="h-full">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedClient.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{selectedClient.companyName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedClient.clientCode}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditClient(selectedClient)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteClient(selectedClient.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px]">
                  <div className="p-6 space-y-6">
                    {/* Client Info Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact Person</p>
                          <p className="font-medium">{selectedClient.contactPerson}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedClient.contactPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedClient.contactEmail || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium">{selectedClient.city}, {selectedClient.state}</p>
                        </div>
                      </div>
                    </div>

                    {/* Statutory Info */}
                    {(selectedClient.gstin || selectedClient.pan || selectedClient.pfCode || selectedClient.esiCode) && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Statutory Details</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {selectedClient.gstin && (
                            <div className="p-2 rounded-lg border text-center">
                              <p className="text-xs text-muted-foreground">GSTIN</p>
                              <p className="text-sm font-medium truncate">{selectedClient.gstin}</p>
                            </div>
                          )}
                          {selectedClient.pan && (
                            <div className="p-2 rounded-lg border text-center">
                              <p className="text-xs text-muted-foreground">PAN</p>
                              <p className="text-sm font-medium">{selectedClient.pan}</p>
                            </div>
                          )}
                          {selectedClient.pfCode && (
                            <div className="p-2 rounded-lg border text-center">
                              <p className="text-xs text-muted-foreground">PF Code</p>
                              <p className="text-sm font-medium">{selectedClient.pfCode}</p>
                            </div>
                          )}
                          {selectedClient.esiCode && (
                            <div className="p-2 rounded-lg border text-center">
                              <p className="text-xs text-muted-foreground">ESI Code</p>
                              <p className="text-sm font-medium">{selectedClient.esiCode}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Units Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Factory className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-medium">Work Units/Locations</h4>
                          <Badge variant="secondary">{selectedClient.units.length}</Badge>
                        </div>
                        <Button size="sm" onClick={openAddUnit}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Unit
                        </Button>
                      </div>

                      {selectedClient.units.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                          <Factory className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No units added yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Add work locations where staff is deployed</p>
                          <Button variant="outline" size="sm" className="mt-3" onClick={openAddUnit}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add First Unit
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {selectedClient.units.map((unit) => (
                            <div 
                              key={unit.id} 
                              className="flex items-start justify-between p-4 rounded-lg border hover:border-primary/30 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <MapPinned className="h-4 w-4 text-muted-foreground" />
                                  <p className="font-medium">{unit.unitName}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs",
                                      unit.status === 'active' 
                                        ? "bg-emerald-500/10 text-emerald-600" 
                                        : "bg-gray-500/10 text-gray-500"
                                    )}
                                  >
                                    {unit.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{unit.unitCode}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>{unit.city}, {unit.state}</span>
                                  {unit.pincode && <span>• {unit.pincode}</span>}
                                  {unit.contactPhone && <span>• {unit.contactPhone}</span>}
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    {unit.deployedCount} deployed
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => openEditUnit(unit)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteUnit(unit.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium text-muted-foreground">Select a Client</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose a client from the list to view details and manage units</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Client Sheet */}
      <Sheet open={isAddClientOpen} onOpenChange={(open) => { setIsAddClientOpen(open); if (!open) resetClientForm(); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</SheetTitle>
            <SheetDescription>
              {editingClient ? 'Update client information' : 'Enter client details to add a new principal employer'}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input 
                    id="companyName" 
                    placeholder="Legal company name" 
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input 
                      id="contactPerson" 
                      placeholder="Name" 
                      value={clientForm.contactPerson}
                      onChange={(e) => setClientForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone *</Label>
                    <Input 
                      id="contactPhone" 
                      placeholder="Phone number" 
                      value={clientForm.contactPhone}
                      onChange={(e) => setClientForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    placeholder="Email address" 
                    value={clientForm.contactEmail}
                    onChange={(e) => setClientForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea 
                    id="billingAddress" 
                    placeholder="Complete address" 
                    value={clientForm.billingAddress}
                    onChange={(e) => setClientForm(prev => ({ ...prev, billingAddress: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="City" 
                      value={clientForm.city}
                      onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select 
                      value={clientForm.state} 
                      onValueChange={(v) => setClientForm(prev => ({ ...prev, state: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input 
                      id="pincode" 
                      placeholder="Pincode" 
                      value={clientForm.pincode}
                      onChange={(e) => setClientForm(prev => ({ ...prev, pincode: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Statutory Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Statutory Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input 
                    id="gstin" 
                    placeholder="GST Number" 
                    value={clientForm.gstin}
                    onChange={(e) => setClientForm(prev => ({ ...prev, gstin: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input 
                    id="pan" 
                    placeholder="PAN Number" 
                    value={clientForm.pan}
                    onChange={(e) => setClientForm(prev => ({ ...prev, pan: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pfCode">PF Establishment Code</Label>
                  <Input 
                    id="pfCode" 
                    placeholder="PF Code" 
                    value={clientForm.pfCode}
                    onChange={(e) => setClientForm(prev => ({ ...prev, pfCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esiCode">ESI Code</Label>
                  <Input 
                    id="esiCode" 
                    placeholder="ESI Code" 
                    value={clientForm.esiCode}
                    onChange={(e) => setClientForm(prev => ({ ...prev, esiCode: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contract */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Contract Details
              </h4>
              <div className="space-y-2">
                <Label htmlFor="contractValue">Contract Value (Annual) ₹</Label>
                <Input 
                  id="contractValue" 
                  type="number"
                  placeholder="Annual contract value" 
                  value={clientForm.contractValue}
                  onChange={(e) => setClientForm(prev => ({ ...prev, contractValue: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => { setIsAddClientOpen(false); resetClientForm(); }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveClient}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingClient ? 'Update Client' : 'Add Client'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add/Edit Unit Sheet */}
      <Sheet open={isAddUnitOpen} onOpenChange={(open) => { setIsAddUnitOpen(open); if (!open) resetUnitForm(); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</SheetTitle>
            <SheetDescription>
              {editingUnit 
                ? 'Update unit/location information' 
                : `Add a work location for ${selectedClient?.companyName}`
              }
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="unitName">Unit/Location Name *</Label>
                <Input 
                  id="unitName" 
                  placeholder="e.g., Factory Unit - Andheri" 
                  value={unitForm.unitName}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, unitName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitAddress">Address</Label>
                <Textarea 
                  id="unitAddress" 
                  placeholder="Complete address" 
                  value={unitForm.address}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="unitCity">City *</Label>
                  <Input 
                    id="unitCity" 
                    placeholder="City" 
                    value={unitForm.city}
                    onChange={(e) => setUnitForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitState">State</Label>
                  <Select 
                    value={unitForm.state} 
                    onValueChange={(v) => setUnitForm(prev => ({ ...prev, state: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="unitPincode">Pincode</Label>
                  <Input 
                    id="unitPincode" 
                    placeholder="Pincode" 
                    value={unitForm.pincode}
                    onChange={(e) => setUnitForm(prev => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPhone">Contact Phone</Label>
                  <Input 
                    id="unitPhone" 
                    placeholder="Phone" 
                    value={unitForm.contactPhone}
                    onChange={(e) => setUnitForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitContactPerson">Contact Person</Label>
                <Input 
                  id="unitContactPerson" 
                  placeholder="Contact person name" 
                  value={unitForm.contactPerson}
                  onChange={(e) => setUnitForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => { setIsAddUnitOpen(false); resetUnitForm(); }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveUnit}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingUnit ? 'Update Unit' : 'Add Unit'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
