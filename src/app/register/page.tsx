'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  UserPlus, 
  Loader2,
  CheckCircle2,
  Upload,
  Shield,
  Building2
} from 'lucide-react';
import { GENDER_OPTIONS, INDIAN_STATES, BLOOD_GROUPS, EMPLOYMENT_TYPES } from '@/lib/constants';
import Link from 'next/link';
import { useRegistrationsStore, type Registration } from '@/stores/registrations-store';
import { useClientsStore } from '@/stores/clients-store';
import { PrintableApplicationForm } from '@/components/registrations/printable-application-form';

export default function EmployeeRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<Registration | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  
  const { addRegistration, getRegistrationByCode } = useRegistrationsStore();
  const { clients } = useClientsStore();
  
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    // Employment Details
    designation: '',
    department: '',
    employmentType: 'contract',
    expectedSalary: '',
    experience: '',
    skills: '',
    education: '',
    // Client & Unit Selection
    clientId: '',
    unitId: '',
    // Identity Documents
    aadhaarNumber: '',
    panNumber: '',
    // Bank Details
    bankName: '',
    bankAccountNo: '',
    bankIfsc: '',
    bankBranch: '',
    // Declarations
    declaration: false,
    termsAccepted: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploadedDocs(prev => ({
          ...prev,
          [field]: file.name
        }));
      }
    };
    
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.declaration || !formData.termsAccepted) {
      alert('Please accept the declarations to proceed');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add registration to store
      const registrationCode = addRegistration({
        firstName: formData.firstName,
        lastName: formData.lastName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        permanentAddress: formData.permanentAddress,
        permanentCity: formData.permanentCity,
        permanentState: formData.permanentState,
        permanentPincode: formData.permanentPincode,
        designation: formData.designation,
        department: formData.department,
        employmentType: formData.employmentType,
        expectedSalary: formData.expectedSalary,
        experience: formData.experience,
        skills: formData.skills,
        education: formData.education,
        clientId: formData.clientId,
        clientName: clients.find(c => c.id === formData.clientId)?.companyName,
        unitId: formData.unitId,
        unitName: formData.unitId ? clients.find(c => c.id === formData.clientId)?.units.find(u => u.id === formData.unitId)?.unitName : undefined,
        unitCode: formData.unitId ? clients.find(c => c.id === formData.clientId)?.units.find(u => u.id === formData.unitId)?.unitCode : undefined,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        bankName: formData.bankName,
        bankAccountNo: formData.bankAccountNo,
        bankIfsc: formData.bankIfsc,
        bankBranch: formData.bankBranch,
        documents: {
          aadhaarCard: uploadedDocs.aadhaarCard,
          panCard: uploadedDocs.panCard,
          photo: uploadedDocs.photo,
          bankPassbook: uploadedDocs.bankPassbook,
          education: uploadedDocs.education,
        },
      });
      
      // Get the full registration
      const registration = getRegistrationByCode(registrationCode);
      if (registration) {
        setSubmittedRegistration(registration);
      }
      
      setIsSuccess(true);
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSuccess && submittedRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm print:hidden">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Employee Self-Registration</h1>
                <p className="text-sm text-muted-foreground">Application Submitted</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Login
              </Button>
            </Link>
          </div>
        </header>

        {/* Success Banner */}
        <div className="bg-emerald-600 text-white py-4 print:hidden">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Registration Successful!</h2>
            <p className="text-emerald-100">Your application has been submitted successfully</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-6 print:shadow-none">
            <CardContent className="pt-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-center print:hidden">
                <p className="text-emerald-800 font-medium">Your Registration ID</p>
                <p className="text-3xl font-bold text-emerald-600">{submittedRegistration.registrationCode}</p>
                <p className="text-sm text-emerald-700 mt-2">
                  Please save this ID for future reference. Our HR team will contact you within 2-3 business days.
                </p>
              </div>
              
              <PrintableApplicationForm registration={submittedRegistration} />
              
              <div className="flex justify-center gap-4 mt-6 print:hidden">
                <Link href="/">
                  <Button variant="outline">
                    Back to Home
                  </Button>
                </Link>
                <Button onClick={() => window.print()}>
                  Print Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t py-4 mt-auto print:hidden">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2025 HRMS - Employee Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Employee Self-Registration</h1>
              <p className="text-sm text-muted-foreground">Join our workforce</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              Back to Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                ${currentStep >= step 
                  ? 'bg-sky-600 text-white' 
                  : 'bg-white text-muted-foreground border-2'
                }
              `}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-1 ${currentStep > step ? 'bg-sky-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 4: {
              currentStep === 1 ? 'Personal Details' :
              currentStep === 2 ? 'Employment Preferences' :
              currentStep === 3 ? 'Documents & Bank Details' :
              'Review & Submit'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-semibold">Personal Details</h2>
                  </div>

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
                      <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                      <Input 
                        id="fatherName" 
                        placeholder="Enter father's name"
                        value={formData.fatherName}
                        onChange={(e) => handleChange('fatherName', e.target.value)}
                        required
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
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">Permanent Address *</Label>
                    <Textarea 
                      id="permanentAddress" 
                      placeholder="Enter complete address"
                      value={formData.permanentAddress}
                      onChange={(e) => handleChange('permanentAddress', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentState">State *</Label>
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
                      <Label htmlFor="permanentCity">City *</Label>
                      <Input 
                        id="permanentCity" 
                        placeholder="City"
                        value={formData.permanentCity}
                        onChange={(e) => handleChange('permanentCity', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanentPincode">Pincode *</Label>
                      <Input 
                        id="permanentPincode" 
                        placeholder="6 digit pincode"
                        value={formData.permanentPincode}
                        onChange={(e) => handleChange('permanentPincode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Employment Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-semibold">Employment Preferences</h2>
                  </div>

                  {/* Client & Unit Selection */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-4">
                    <h3 className="font-medium text-emerald-800 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Select Work Location
                    </h3>
                    <p className="text-sm text-emerald-700">
                      Choose the client company and unit where you want to work. This helps us process your application faster.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientId">Select Client Company</Label>
                        <Select 
                          value={formData.clientId} 
                          onValueChange={(v) => {
                            handleChange('clientId', v);
                            handleChange('unitId', '');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.filter(c => c.status === 'active').map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unitId">Select Unit/Location</Label>
                        <Select 
                          value={formData.unitId} 
                          onValueChange={(v) => handleChange('unitId', v)}
                          disabled={!formData.clientId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={formData.clientId ? "Choose a unit" : "Select client first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.clientId && clients
                              .find(c => c.id === formData.clientId)
                              ?.units.filter(u => u.status === 'active')
                              .map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.unitName} - {unit.city}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.clientId && formData.unitId && (
                      <div className="text-sm text-emerald-700 bg-white p-3 rounded border">
                        <p className="font-medium">Selected Work Location:</p>
                        <p>{clients.find(c => c.id === formData.clientId)?.companyName}</p>
                        <p className="text-muted-foreground">
                          {clients.find(c => c.id === formData.clientId)?.units.find(u => u.id === formData.unitId)?.unitName}
                          {' - '}
                          {clients.find(c => c.id === formData.clientId)?.units.find(u => u.id === formData.unitId)?.city}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Preferred Designation *</Label>
                      <Input 
                        id="designation" 
                        placeholder="e.g., Security Guard, Helper"
                        value={formData.designation}
                        onChange={(e) => handleChange('designation', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Preferred Department</Label>
                      <Input 
                        id="department" 
                        placeholder="e.g., Security, Production"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select value={formData.employmentType} onValueChange={(v) => handleChange('employmentType', v)}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <div className="space-y-2">
                      <Label htmlFor="expectedSalary">Expected Salary (Monthly)</Label>
                      <Input 
                        id="expectedSalary" 
                        type="number"
                        placeholder="Amount in INR"
                        value={formData.expectedSalary}
                        onChange={(e) => handleChange('expectedSalary', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Work Experience</Label>
                      <Input 
                        id="experience" 
                        placeholder="e.g., 3 years in security"
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Educational Qualification</Label>
                      <Input 
                        id="education" 
                        placeholder="e.g., 10th Pass, ITI"
                        value={formData.education}
                        onChange={(e) => handleChange('education', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Certifications</Label>
                    <Textarea 
                      id="skills" 
                      placeholder="List your skills and any relevant certifications"
                      value={formData.skills}
                      onChange={(e) => handleChange('skills', e.target.value)}
                    />
                  </div>

                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                    <h3 className="font-medium text-sky-800 mb-2">Available Positions</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-sky-700">
                      <div>• Security Guard</div>
                      <div>• Housekeeping Staff</div>
                      <div>• Machine Operator</div>
                      <div>• Helper</div>
                      <div>• Supervisor</div>
                      <div>• Electrician</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Bank Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-semibold">Documents & Bank Details</h2>
                  </div>

                  {/* Identity Documents */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Identity Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                        <Input 
                          id="aadhaarNumber" 
                          placeholder="12 digit Aadhaar number"
                          value={formData.aadhaarNumber}
                          onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                          required
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

                  {/* Document Uploads */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Upload Documents</h3>
                    <div className="grid gap-3">
                      {[
                        { id: 'aadhaarCard', label: 'Aadhaar Card' },
                        { id: 'panCard', label: 'PAN Card' },
                        { id: 'photo', label: 'Passport Size Photo' },
                        { id: 'bankPassbook', label: 'Bank Passbook/Cancel Cheque' },
                        { id: 'education', label: 'Educational Certificates' },
                      ].map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <span className="text-sm">{doc.label}</span>
                              {uploadedDocs[doc.id] && (
                                <span className="ml-2 text-xs text-emerald-600">✓ {uploadedDocs[doc.id]}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            type="button"
                            onClick={() => handleFileUpload(doc.id)}
                          >
                            {uploadedDocs[doc.id] ? 'Change' : 'Choose File'}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, JPG, PNG. Max file size: 2MB each
                    </p>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Bank Details (for salary)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name *</Label>
                        <Input 
                          id="bankName" 
                          placeholder="Bank name"
                          value={formData.bankName}
                          onChange={(e) => handleChange('bankName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccountNo">Account Number *</Label>
                        <Input 
                          id="bankAccountNo" 
                          placeholder="Account number"
                          value={formData.bankAccountNo}
                          onChange={(e) => handleChange('bankAccountNo', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankIfsc">IFSC Code *</Label>
                        <Input 
                          id="bankIfsc" 
                          placeholder="IFSC code"
                          value={formData.bankIfsc}
                          onChange={(e) => handleChange('bankIfsc', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankBranch">Branch Name</Label>
                        <Input 
                          id="bankBranch" 
                          placeholder="Branch name"
                          value={formData.bankBranch}
                          onChange={(e) => handleChange('bankBranch', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-sky-600" />
                    <h2 className="text-lg font-semibold">Review & Submit</h2>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Personal Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}</div>
                        <div><span className="text-muted-foreground">Phone:</span> {formData.phone}</div>
                        <div><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                        <div><span className="text-muted-foreground">DOB:</span> {formData.dateOfBirth}</div>
                        <div><span className="text-muted-foreground">Gender:</span> {formData.gender}</div>
                        <div><span className="text-muted-foreground">Father's Name:</span> {formData.fatherName}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Employment Preferences</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Designation:</span> {formData.designation}</div>
                        <div><span className="text-muted-foreground">Department:</span> {formData.department || '-'}</div>
                        <div><span className="text-muted-foreground">Type:</span> {formData.employmentType}</div>
                        <div><span className="text-muted-foreground">Expected Salary:</span> ₹{formData.expectedSalary || '-'}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Documents & Bank Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Aadhaar:</span> {formData.aadhaarNumber}</div>
                        <div><span className="text-muted-foreground">PAN:</span> {formData.panNumber || '-'}</div>
                        <div><span className="text-muted-foreground">Bank:</span> {formData.bankName}</div>
                        <div><span className="text-muted-foreground">Account:</span> {formData.bankAccountNo}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Uploaded Documents</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.keys(uploadedDocs).length === 0 ? (
                          <span className="text-muted-foreground col-span-2">No documents uploaded</span>
                        ) : (
                          Object.entries(uploadedDocs).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-emerald-600">✓</span>
                              <span>{key.replace(/([A-Z])/g, ' $1').trim()}: {value}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Declarations */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium">Declarations</h3>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="declaration" 
                        checked={formData.declaration}
                        onCheckedChange={(checked) => handleChange('declaration', checked)}
                      />
                      <Label htmlFor="declaration" className="text-sm leading-relaxed">
                        I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
                        I understand that any false information may result in rejection of my application or termination of employment.
                      </Label>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="termsAccepted" 
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleChange('termsAccepted', checked)}
                      />
                      <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                        I agree to the Terms & Conditions and Privacy Policy. 
                        I understand that my personal data will be processed for employment purposes.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.declaration || !formData.termsAccepted}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 HRMS - Employee Management System. All rights reserved.</p>
          <p className="mt-1">
            Need help? Contact HR at <span className="text-sky-600">hr@company.com</span> or call <span className="text-sky-600">+91 9876543210</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
