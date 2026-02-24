'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  Loader2,
  Filter,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import { useRegistrationsStore, type Registration } from '@/stores/registrations-store';
import { PrintableApplicationForm } from './printable-application-form';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'text-amber-600', 
    bg: 'bg-amber-500/10', 
    badge: 'secondary' as const,
    label: 'Pending'
  },
  approved: { 
    icon: CheckCircle2, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-500/10', 
    badge: 'default' as const,
    label: 'Approved'
  },
  rejected: { 
    icon: XCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-500/10', 
    badge: 'destructive' as const,
    label: 'Rejected'
  },
};

export function RegistrationsModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const { 
    registrations, 
    approveRegistration, 
    rejectRegistration,
    deleteRegistration 
  } = useRegistrationsStore();

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      reg.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.registrationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone.includes(searchQuery) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsViewDialogOpen(true);
  };

  const handleApprove = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRegistration) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      approveRegistration(selectedRegistration.id, 'Admin');
      setIsApproveDialogOpen(false);
      setSelectedRegistration(null);
      toast({
        title: 'Application Approved',
        description: `Registration ${selectedRegistration.registrationCode} has been approved`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (registration: Registration) => {
    setSelectedRegistration(registration);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a reason for rejection',
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      rejectRegistration(selectedRegistration.id, 'Admin', rejectionReason);
      setIsRejectDialogOpen(false);
      setSelectedRegistration(null);
      setRejectionReason('');
      toast({
        title: 'Application Rejected',
        description: `Registration ${selectedRegistration.registrationCode} has been rejected`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (registration: Registration) => {
    if (confirm(`Are you sure you want to delete registration ${registration.registrationCode}?`)) {
      deleteRegistration(registration.id);
      toast({
        title: 'Deleted',
        description: 'Registration has been deleted',
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registration Management</h1>
          <p className="text-muted-foreground">Review and manage employee applications</p>
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
                <p className="text-2xl font-bold">{registrations.length}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
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
                placeholder="Search by name, code, phone, email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
                  <TableHead>Application No</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Applied For</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => {
                    const config = statusConfig[registration.status];
                    return (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          {registration.registrationCode}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{registration.firstName} {registration.lastName}</p>
                            <p className="text-xs text-muted-foreground">{registration.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{registration.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{registration.designation}</p>
                            <p className="text-xs text-muted-foreground">{registration.department || 'Any Department'}</p>
                            {registration.clientName && (
                              <p className="text-xs text-emerald-600 mt-1">
                                📍 {registration.clientName}
                                {registration.unitName && ` - ${registration.unitName}`}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(registration.submittedAt)}</TableCell>
                        <TableCell>
                          <Badge variant={config.badge} className={`${config.bg} ${config.color}`}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(registration)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {registration.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                                  onClick={() => handleApprove(registration)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(registration)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the complete application form
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <PrintableApplicationForm registration={selectedRegistration} />
              
              {selectedRegistration.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline"
                    className="text-red-600 border-red-600"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleReject(selectedRegistration);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleApprove(selectedRegistration);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this application?
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRegistration.registrationCode} • {selectedRegistration.designation}
                </p>
              </div>
              <Alert>
                <AlertDescription>
                  Upon approval, an employee record will be created and the applicant will be notified.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={confirmApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRegistration.registrationCode} • {selectedRegistration.designation}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={confirmReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject Application
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
