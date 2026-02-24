// Indian Payroll Calculations as per Indian Wage Code
import { EPF_CONSTANTS, ESI_CONSTANTS, PT_SLABS_BY_STATE, LWF_RATES } from './constants';

// Type definitions
export interface PayrollInput {
  basicSalary: number;
  dearnessAllowance: number;
  houseRentAllowance: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  otherAllowances: number;
  overtimeAmount: number;
  paidDays: number;
  totalWorkingDays: number;
  overtimeHours: number;
  pfApplicable: boolean;
  esiApplicable: boolean;
  ptApplicable: boolean;
  lwfApplicable: boolean;
  state?: string;
}

export interface PayrollOutput {
  grossEarnings: number;
  pfEmployee: number;
  pfEmployer: number;
  epsContribution: number;
  edliContribution: number;
  pfAdminCharges: number;
  esiEmployee: number;
  esiEmployer: number;
  professionalTax: number;
  lwfEmployee: number;
  lwfEmployer: number;
  totalDeductions: number;
  netPay: number;
  employerCost: number;
  epfWages: number;
  esiWages: number;
}

// Calculate EPF Wages (Basic + DA + Retaining Allowance)
export function calculateEPFWages(basic: number, da: number, retainingAllowance: number = 0): number {
  return Math.min(basic + da + retainingAllowance, EPF_CONSTANTS.wageCeiling);
}

// Calculate ESI Wages (All earnings except overtime)
export function calculateESIWages(input: PayrollInput): number {
  const totalEarnings = 
    input.basicSalary + 
    input.dearnessAllowance + 
    input.houseRentAllowance + 
    input.conveyanceAllowance + 
    input.medicalAllowance + 
    input.specialAllowance + 
    input.otherAllowances;
  
  return Math.min(totalEarnings, ESI_CONSTANTS.wageCeiling);
}

// Calculate EPF Contributions
export function calculateEPF(epfWages: number): {
  employee: number;
  employer: number;
  eps: number;
  edli: number;
  adminCharges: number;
} {
  const employee = Math.round(epfWages * EPF_CONSTANTS.employeeRate / 100);
  
  // EPS contribution (8.33% of wages, max ₹1250)
  const eps = Math.round(Math.min(epfWages * EPF_CONSTANTS.epsRate / 100, 1250));
  
  // Employer EPF = 12% - EPS
  const employer = Math.round((epfWages * EPF_CONSTANTS.employerRate / 100) - eps);
  
  // EDLI and Admin charges
  const edli = Math.round(epfWages * EPF_CONSTANTS.edliRate / 100);
  const adminCharges = Math.round(epfWages * EPF_CONSTANTS.adminChargeRate / 100);
  
  return { employee, employer, eps, edli, adminCharges };
}

// Calculate ESI Contributions
export function calculateESI(esiWages: number): {
  employee: number;
  employer: number;
} {
  const employee = Math.round(esiWages * ESI_CONSTANTS.employeeRate / 100);
  const employer = Math.round(esiWages * ESI_CONSTANTS.employerRate / 100);
  
  return { employee, employer };
}

// Calculate Professional Tax based on state-wise slabs
export function calculatePT(grossSalary: number, state: string = 'DEFAULT'): number {
  const stateSlabs = PT_SLABS_BY_STATE[state] || PT_SLABS_BY_STATE['DEFAULT'];
  for (const slab of stateSlabs.slabs) {
    if (grossSalary >= slab.min && grossSalary <= slab.max) {
      return slab.amount;
    }
  }
  return stateSlabs.maxPT;
}

// Calculate LWF Contributions
export function calculateLWF(state: string): {
  employee: number;
  employer: number;
} {
  const rates = LWF_RATES[state] || { employee: 0, employer: 0 };
  return { employee: rates.employee, employer: rates.employer };
}

// Main Payroll Calculation Function
export function calculatePayroll(input: PayrollInput): PayrollOutput {
  // Calculate gross earnings
  const grossEarnings = 
    input.basicSalary + 
    input.dearnessAllowance + 
    input.houseRentAllowance + 
    input.conveyanceAllowance + 
    input.medicalAllowance + 
    input.specialAllowance + 
    input.otherAllowances + 
    input.overtimeAmount;

  // Prorate based on paid days
  const prorationFactor = input.totalWorkingDays > 0 ? input.paidDays / input.totalWorkingDays : 1;
  const proratedGross = grossEarnings * prorationFactor;

  // Calculate EPF Wages
  const epfWages = input.pfApplicable ? 
    calculateEPFWages(input.basicSalary, input.dearnessAllowance) * prorationFactor : 0;

  // Calculate ESI Wages
  const esiWages = input.esiApplicable ? 
    calculateESIWages(input) * prorationFactor : 0;

  // Calculate deductions
  let pfEmployee = 0;
  let pfEmployer = 0;
  let epsContribution = 0;
  let edliContribution = 0;
  let pfAdminCharges = 0;

  if (input.pfApplicable && epfWages > 0) {
    const epf = calculateEPF(epfWages);
    pfEmployee = epf.employee;
    pfEmployer = epf.employer;
    epsContribution = epf.eps;
    edliContribution = epf.edli;
    pfAdminCharges = epf.adminCharges;
  }

  let esiEmployee = 0;
  let esiEmployer = 0;

  if (input.esiApplicable && esiWages > 0) {
    const esi = calculateESI(esiWages);
    esiEmployee = esi.employee;
    esiEmployer = esi.employer;
  }

  let professionalTax = 0;
  if (input.ptApplicable) {
    professionalTax = calculatePT(proratedGross, input.state);
  }

  let lwfEmployee = 0;
  let lwfEmployer = 0;
  if (input.lwfApplicable && input.state) {
    const lwf = calculateLWF(input.state);
    lwfEmployee = lwf.employee;
    lwfEmployer = lwf.employer;
  }

  const totalDeductions = pfEmployee + esiEmployee + professionalTax + lwfEmployee;
  const netPay = proratedGross - totalDeductions;
  
  // Employer cost includes gross salary + employer contributions
  const employerCost = proratedGross + pfEmployer + epsContribution + edliContribution + 
    pfAdminCharges + esiEmployer + lwfEmployer;

  return {
    grossEarnings: Math.round(proratedGross),
    pfEmployee,
    pfEmployer,
    epsContribution,
    edliContribution,
    pfAdminCharges,
    esiEmployee,
    esiEmployer,
    professionalTax,
    lwfEmployee,
    lwfEmployer,
    totalDeductions,
    netPay: Math.round(netPay),
    employerCost: Math.round(employerCost),
    epfWages: Math.round(epfWages),
    esiWages: Math.round(esiWages),
  };
}

// Calculate Overtime Amount (Double rate as per Indian Law)
export function calculateOvertime(
  basicSalary: number,
  dearnessAllowance: number,
  overtimeHours: number,
  workingHoursPerDay: number = 8
): number {
  // Hourly rate = (Basic + DA) / 26 days / working hours per day
  const hourlyRate = (basicSalary + dearnessAllowance) / 26 / workingHoursPerDay;
  // Overtime is paid at double rate
  return Math.round(overtimeHours * hourlyRate * 2);
}

// Calculate Gratuity (4.81% of Basic + DA)
export function calculateGratuity(basicSalary: number, dearnessAllowance: number): number {
  return Math.round((basicSalary + dearnessAllowance) * 4.81 / 100);
}

// Calculate Bonus (Minimum 8.33% of wages, max ₹7000 or minimum wages)
export function calculateBonus(
  basicSalary: number,
  dearnessAllowance: number,
  eligible: boolean = true
): number {
  if (!eligible) return 0;
  const wages = Math.min(basicSalary + dearnessAllowance, 7000);
  return Math.round(wages * 8.33 / 100);
}

// Calculate Leave Encashment
export function calculateLeaveEncashment(
  basicSalary: number,
  dearnessAllowance: number,
  leaveDays: number
): number {
  const dailyRate = (basicSalary + dearnessAllowance) / 26;
  return Math.round(dailyRate * leaveDays);
}

// Format Indian Currency
export function formatIndianCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

// Format number with Indian separators
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Generate Employee Code
export function generateEmployeeCode(prefix: string = 'EMP', sequence: number): string {
  return `${prefix}${String(sequence).padStart(5, '0')}`;
}

// Generate Deployment Code
export function generateDeploymentCode(clientCode: string, sequence: number): string {
  return `${clientCode}-DEP${String(sequence).padStart(4, '0')}`;
}

// Generate Bill Number
export function generateBillNumber(prefix: string = 'INV', financialYear: string, sequence: number): string {
  return `${prefix}/${financialYear}/${String(sequence).padStart(4, '0')}`;
}

// Get Financial Year
export function getFinancialYear(date: Date = new Date()): string {
  const year = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  return `${year}-${(year + 1).toString().slice(-2)}`;
}

// Calculate Days in Month
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// Calculate Working Days in Month (excluding Sundays)
export function getWorkingDaysInMonth(month: number, year: number): number {
  let workingDays = 0;
  const daysInMonth = getDaysInMonth(month, year);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    // Count all days except Sunday (0)
    if (dayOfWeek !== 0) {
      workingDays++;
    }
  }
  
  return workingDays;
}

// Minimum Wage Check
export function checkMinimumWage(
  basicSalary: number,
  dearnessAllowance: number,
  minimumWage: number,
  skillLevel: 'unskilled' | 'semiSkilled' | 'skilled' | 'highlySkilled'
): { compliant: boolean; shortfall: number } {
  const totalWage = basicSalary + dearnessAllowance;
  const shortfall = minimumWage - totalWage;
  
  return {
    compliant: shortfall <= 0,
    shortfall: shortfall > 0 ? shortfall : 0,
  };
}
