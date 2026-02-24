import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Registration {
  id: string;
  registrationCode: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  // Personal Details
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPincode: string;
  // Employment Details
  designation: string;
  department: string;
  employmentType: string;
  expectedSalary: string;
  experience: string;
  skills: string;
  education: string;
  // Client & Unit Selection
  clientId?: string;
  clientName?: string;
  unitId?: string;
  unitName?: string;
  unitCode?: string;
  // Documents
  aadhaarNumber: string;
  panNumber: string;
  // Bank Details
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  // Documents uploaded (file names)
  documents: {
    aadhaarCard?: string;
    panCard?: string;
    photo?: string;
    bankPassbook?: string;
    education?: string;
  };
}

interface RegistrationsStore {
  registrations: Registration[];
  addRegistration: (registration: Omit<Registration, 'id' | 'registrationCode' | 'status' | 'submittedAt'>) => string;
  updateRegistration: (id: string, data: Partial<Registration>) => void;
  approveRegistration: (id: string, reviewedBy: string) => void;
  rejectRegistration: (id: string, reviewedBy: string, reason: string) => void;
  deleteRegistration: (id: string) => void;
  getRegistration: (id: string) => Registration | undefined;
  getRegistrationByCode: (code: string) => Registration | undefined;
}

// Sample registrations for demo
const sampleRegistrations: Registration[] = [
  {
    id: '1',
    registrationCode: 'REG00001',
    status: 'pending',
    submittedAt: '2025-01-15T10:30:00',
    firstName: 'Ramesh',
    lastName: 'Patel',
    fatherName: 'Suresh Patel',
    motherName: 'Lakshmi Patel',
    dateOfBirth: '1995-05-20',
    gender: 'male',
    bloodGroup: 'B+',
    phone: '9876543210',
    email: 'ramesh.patel@email.com',
    permanentAddress: '123, Shivaji Nagar, Near Bus Stand',
    permanentCity: 'Pune',
    permanentState: 'MH',
    permanentPincode: '411005',
    designation: 'Security Guard',
    department: 'Security',
    employmentType: 'contract',
    expectedSalary: '18000',
    experience: '3 years in security services',
    skills: 'Security training certified, First aid knowledge',
    education: '12th Pass',
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    bankName: 'State Bank of India',
    bankAccountNo: '12345678901234',
    bankIfsc: 'SBIN0001234',
    bankBranch: 'Shivaji Nagar Branch',
    documents: {
      aadhaarCard: 'aadhaar_card.pdf',
      panCard: 'pan_card.pdf',
      photo: 'photo.jpg',
      bankPassbook: 'passbook.pdf',
    },
  },
  {
    id: '2',
    registrationCode: 'REG00002',
    status: 'approved',
    submittedAt: '2025-01-14T14:20:00',
    reviewedAt: '2025-01-15T09:00:00',
    reviewedBy: 'Admin',
    firstName: 'Sunita',
    lastName: 'Devi',
    fatherName: 'Ram Kumar',
    motherName: 'Mohan Devi',
    dateOfBirth: '1998-08-15',
    gender: 'female',
    bloodGroup: 'O+',
    phone: '9876543211',
    email: 'sunita.devi@email.com',
    permanentAddress: '456, Industrial Area, Phase 2',
    permanentCity: 'Mumbai',
    permanentState: 'MH',
    permanentPincode: '400001',
    designation: 'Helper',
    department: 'Production',
    employmentType: 'contract',
    expectedSalary: '15000',
    experience: '2 years in manufacturing',
    skills: 'Machine operation, Quality checking',
    education: '10th Pass',
    aadhaarNumber: '234567890123',
    panNumber: 'BCDEF2345G',
    bankName: 'HDFC Bank',
    bankAccountNo: '23456789012345',
    bankIfsc: 'HDFC0002345',
    bankBranch: 'Andheri Branch',
    documents: {
      aadhaarCard: 'aadhaar.pdf',
      photo: 'photo.jpg',
      bankPassbook: 'passbook.pdf',
    },
  },
  {
    id: '3',
    registrationCode: 'REG00003',
    status: 'rejected',
    submittedAt: '2025-01-13T16:45:00',
    reviewedAt: '2025-01-14T11:30:00',
    reviewedBy: 'Admin',
    rejectionReason: 'Incomplete documents - Missing Aadhaar card and educational certificates',
    firstName: 'Vikram',
    lastName: 'Singh',
    fatherName: 'Dalip Singh',
    motherName: 'Harpreet Kaur',
    dateOfBirth: '1990-12-10',
    gender: 'male',
    bloodGroup: 'A+',
    phone: '9876543212',
    email: 'vikram.singh@email.com',
    permanentAddress: '789, Gurudwara Road',
    permanentCity: 'Nagpur',
    permanentState: 'MH',
    permanentPincode: '440001',
    designation: 'Machine Operator',
    department: 'Production',
    employmentType: 'contract',
    expectedSalary: '22000',
    experience: '5 years',
    skills: 'CNC machine operation',
    education: 'ITI Diploma',
    aadhaarNumber: '345678901234',
    panNumber: 'CDEFG3456H',
    bankName: 'ICICI Bank',
    bankAccountNo: '34567890123456',
    bankIfsc: 'ICIC0003456',
    bankBranch: 'Sadar Branch',
    documents: {
      photo: 'photo.jpg',
    },
  },
];

export const useRegistrationsStore = create<RegistrationsStore>()(
  persist(
    (set, get) => ({
      registrations: sampleRegistrations,
      
      addRegistration: (data) => {
        const id = String(Date.now());
        const count = get().registrations.length + 1;
        const registrationCode = `REG${String(count).padStart(5, '0')}`;
        
        const newRegistration: Registration = {
          ...data,
          id,
          registrationCode,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          registrations: [...state.registrations, newRegistration],
        }));
        
        return registrationCode;
      },
      
      updateRegistration: (id, data) => {
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        }));
      },
      
      approveRegistration: (id, reviewedBy) => {
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'approved' as const,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy,
                }
              : r
          ),
        }));
      },
      
      rejectRegistration: (id, reviewedBy, reason) => {
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'rejected' as const,
                  reviewedAt: new Date().toISOString(),
                  reviewedBy,
                  rejectionReason: reason,
                }
              : r
          ),
        }));
      },
      
      deleteRegistration: (id) => {
        set((state) => ({
          registrations: state.registrations.filter((r) => r.id !== id),
        }));
      },
      
      getRegistration: (id) => {
        return get().registrations.find((r) => r.id === id);
      },
      
      getRegistrationByCode: (code) => {
        return get().registrations.find((r) => r.registrationCode === code);
      },
    }),
    {
      name: 'hrms-registrations',
    }
  )
);
