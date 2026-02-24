// Indian States and Union Territories
export const INDIAN_STATES = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TG', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UT', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
] as const;

// Employment Types
export const EMPLOYMENT_TYPES = [
  { value: 'permanent', label: 'Permanent' },
  { value: 'contract', label: 'Contract' },
  { value: 'casual', label: 'Casual' },
  { value: 'temporary', label: 'Temporary' },
] as const;

// Employee Status
export const EMPLOYEE_STATUS = [
  { value: 'active', label: 'Active', color: 'emerald' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'terminated', label: 'Terminated', color: 'red' },
  { value: 'resigned', label: 'Resigned', color: 'amber' },
] as const;

// Leave Types
export const LEAVE_TYPES = [
  { value: 'casual', label: 'Casual Leave', quota: 12 },
  { value: 'sick', label: 'Sick Leave', quota: 12 },
  { value: 'earned', label: 'Earned Leave', quota: 21 },
  { value: 'national', label: 'National Holiday', quota: 3 },
  { value: 'weekly_off', label: 'Weekly Off', quota: 0 },
  { value: 'unpaid', label: 'Unpaid Leave', quota: 0 },
] as const;

// Attendance Status - With Payment Calculation Rules
export const ATTENDANCE_STATUS = [
  { 
    value: 'P', 
    label: 'Present', 
    color: 'emerald',
    description: 'Full day present',
    dayCount: 1,
    paymentMultiplier: 1,
    calculateOn: 'gross'
  },
  { 
    value: 'A', 
    label: 'Absent', 
    color: 'red',
    description: 'Absent without pay',
    dayCount: 0,
    paymentMultiplier: 0,
    calculateOn: 'none'
  },
  { 
    value: 'PH', 
    label: 'Present + Holiday', 
    color: 'purple',
    description: 'Present on holiday - Double pay on Basic + DA',
    dayCount: 1,
    paymentMultiplier: 2,
    calculateOn: 'basic_da'
  },
  { 
    value: 'H', 
    label: 'Paid Holiday', 
    color: 'sky',
    description: 'Paid holiday (no work)',
    dayCount: 1,
    paymentMultiplier: 1,
    calculateOn: 'gross'
  },
  { 
    value: 'W', 
    label: 'Week Off', 
    color: 'slate',
    description: 'Weekly off - Paid',
    dayCount: 1,
    paymentMultiplier: 1,
    calculateOn: 'gross'
  },
  { 
    value: 'P/2', 
    label: 'Half Day', 
    color: 'amber',
    description: 'Half day present',
    dayCount: 0.5,
    paymentMultiplier: 0.5,
    calculateOn: 'gross'
  },
] as const;

// Document Types
export const DOCUMENT_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'photo', label: 'Photograph' },
  { value: 'resume', label: 'Resume/CV' },
  { value: 'experience', label: 'Experience Certificate' },
  { value: 'education', label: 'Education Certificate' },
  { value: 'bank', label: 'Bank Passbook/Cheque' },
  { value: 'voter', label: 'Voter ID' },
  { value: 'driving', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
] as const;

// Salary Components
export const EARNING_COMPONENTS = [
  { key: 'basicSalary', label: 'Basic Salary', statutory: true },
  { key: 'dearnessAllowance', label: 'Dearness Allowance (DA)', statutory: true },
  { key: 'houseRentAllowance', label: 'House Rent Allowance (HRA)', statutory: false },
  { key: 'conveyanceAllowance', label: 'Conveyance Allowance', statutory: false },
  { key: 'medicalAllowance', label: 'Medical Allowance', statutory: false },
  { key: 'specialAllowance', label: 'Special Allowance', statutory: false },
  { key: 'overtimeAllowance', label: 'Overtime Allowance', statutory: false },
  { key: 'otherAllowances', label: 'Other Allowances', statutory: false },
] as const;

export const DEDUCTION_COMPONENTS = [
  { key: 'pfEmployee', label: 'PF (Employee)', statutory: true },
  { key: 'esiEmployee', label: 'ESI (Employee)', statutory: true },
  { key: 'professionalTax', label: 'Professional Tax', statutory: true },
  { key: 'lwfEmployee', label: 'LWF (Employee)', statutory: true },
  { key: 'tds', label: 'TDS', statutory: true },
  { key: 'otherDeductions', label: 'Other Deductions', statutory: false },
] as const;

// EPF Compliance Constants - Configurable
export const EPF_CONSTANTS = {
  employeeRate: 12, // 12% of wages (configurable for future changes)
  employerRate: 12, // 12% of wages (configurable)
  epsRate: 8.33, // 8.33% goes to pension (max ₹1250)
  edliRate: 0.5, // EDLI charges
  adminChargeRate: 0.5, // Admin charges
  wageCeiling: 15000, // Maximum wage for EPF calculation
  calculateOn: 'gross', // 'gross' or 'basic_da' - PF calculated on GROSS
} as const;

// ESI Compliance Constants
export const ESI_CONSTANTS = {
  employeeRate: 0.75, // 0.75% of wages
  employerRate: 3.25, // 3.25% of wages
  wageCeiling: 21000, // Maximum wage for ESI
} as const;

// State-wise Professional Tax Slabs (Monthly)
// Each state has different slabs based on monthly gross salary
export const PT_SLABS_BY_STATE: Record<string, {
  stateName: string;
  slabs: Array<{ min: number; max: number; amount: number }>;
  maxPT: number;
  lastUpdated: string;
}> = {
  // Gujarat PT Slabs
  GJ: {
    stateName: 'Gujarat',
    slabs: [
      { min: 0, max: 5999, amount: 0 },
      { min: 6000, max: 8999, amount: 80 },
      { min: 9000, max: 11999, amount: 150 },
      { min: 12000, max: 14999, amount: 200 },
      { min: 15000, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Maharashtra PT Slabs
  MH: {
    stateName: 'Maharashtra',
    slabs: [
      { min: 0, max: 7499, amount: 0 },
      { min: 7500, max: 9999, amount: 175 },
      { min: 10000, max: 999999, amount: 200 }, // ₹200 for > 10,000 (₹3000 extra in Feb for >10k)
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Karnataka PT Slabs
  KA: {
    stateName: 'Karnataka',
    slabs: [
      { min: 0, max: 14999, amount: 0 },
      { min: 15000, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Tamil Nadu PT Slabs
  TN: {
    stateName: 'Tamil Nadu',
    slabs: [
      { min: 0, max: 20999, amount: 0 },
      { min: 21000, max: 29999, amount: 135 },
      { min: 30000, max: 44999, amount: 315 },
      { min: 45000, max: 59999, amount: 690 },
      { min: 60000, max: 74999, amount: 1025 },
      { min: 75000, max: 999999, amount: 1250 },
    ],
    maxPT: 1250,
    lastUpdated: '2024-01-01',
  },
  // Delhi PT Slabs
  DL: {
    stateName: 'Delhi',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // West Bengal PT Slabs
  WB: {
    stateName: 'West Bengal',
    slabs: [
      { min: 0, max: 10000, amount: 0 },
      { min: 10001, max: 15000, amount: 110 },
      { min: 15001, max: 25000, amount: 130 },
      { min: 25001, max: 40000, amount: 150 },
      { min: 40001, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Rajasthan PT Slabs
  RJ: {
    stateName: 'Rajasthan',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Uttar Pradesh PT Slabs
  UP: {
    stateName: 'Uttar Pradesh',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Madhya Pradesh PT Slabs
  MP: {
    stateName: 'Madhya Pradesh',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Haryana PT Slabs
  HR: {
    stateName: 'Haryana',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
  // Default for other states
  DEFAULT: {
    stateName: 'Other States',
    slabs: [
      { min: 0, max: 999999, amount: 200 },
    ],
    maxPT: 200,
    lastUpdated: '2024-01-01',
  },
};

// LWF Rates by State (simplified)
export const LWF_RATES: Record<string, { employee: number; employer: number; frequency: string }> = {
  MH: { employee: 12, employer: 36, frequency: 'half-yearly' },
  GJ: { employee: 6, employer: 24, frequency: 'yearly' },
  KA: { employee: 10, employer: 20, frequency: 'yearly' },
  TN: { employee: 5, employer: 10, frequency: 'yearly' },
  DL: { employee: 5, employer: 10, frequency: 'yearly' },
  WB: { employee: 10, employer: 20, frequency: 'yearly' },
};

// Compliance Due Dates
export const COMPLIANCE_DUE_DATES = {
  epf: { day: 15, description: 'EPF payment due by 15th of following month' },
  esi: { day: 15, description: 'ESI payment due by 15th of following month' },
  pt: { day: 21, description: 'PT payment due by 21st of following month' },
  lwf: { varies: true, description: 'LWF due dates vary by state' },
} as const;

// Billing Types
export const BILLING_TYPES = [
  { value: 'monthly', label: 'Monthly Fixed' },
  { value: 'daily', label: 'Per Day' },
  { value: 'hourly', label: 'Per Hour' },
] as const;

// Bill Status
export const BILL_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'sent', label: 'Sent', color: 'sky' },
  { value: 'paid', label: 'Paid', color: 'emerald' },
  { value: 'overdue', label: 'Overdue', color: 'red' },
] as const;

// Payroll Status
export const PAYROLL_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'processed', label: 'Processed', color: 'sky' },
  { value: 'paid', label: 'Paid', color: 'emerald' },
] as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

// Marital Status Options
export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
] as const;

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
] as const;

// Months
export const MONTHS = [
  { value: 1, label: 'January', days: 31 },
  { value: 2, label: 'February', days: 28 },
  { value: 3, label: 'March', days: 31 },
  { value: 4, label: 'April', days: 30 },
  { value: 5, label: 'May', days: 31 },
  { value: 6, label: 'June', days: 30 },
  { value: 7, label: 'July', days: 31 },
  { value: 8, label: 'August', days: 30 },
  { value: 9, label: 'September', days: 30 },
  { value: 10, label: 'October', days: 31 },
  { value: 11, label: 'November', days: 30 },
  { value: 12, label: 'December', days: 31 },
] as const;
