// API utility functions for HRMS

const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'An error occurred' };
    }

    return { data: result };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Employee APIs
export const employeeAPI = {
  list: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    return fetchAPI<{ employees: any[]; pagination: any }>(`/employees?${query}`);
  },

  get: async (id: string) => {
    return fetchAPI<{ employee: any }>(`/employees/${id}`);
  },

  create: async (data: any) => {
    return fetchAPI<{ employee: any; message: string }>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI<{ employee: any; message: string }>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
};

// Client APIs
export const clientAPI = {
  list: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    return fetchAPI<{ clients: any[] }>(`/clients?${query}`);
  },

  get: async (id: string) => {
    return fetchAPI<{ client: any }>(`/clients/${id}`);
  },

  create: async (data: any) => {
    return fetchAPI<{ client: any; message: string }>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI<{ client: any; message: string }>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payroll APIs
export const payrollAPI = {
  list: async (month: number, year: number) => {
    return fetchAPI<{ salaryRecords: any[]; summary: any }>(
      `/payroll?month=${month}&year=${year}`
    );
  },

  process: async (month: number, year: number, employeeIds?: string[]) => {
    return fetchAPI<{ success: boolean; message: string }>('/payroll', {
      method: 'POST',
      body: JSON.stringify({ month, year, employeeIds }),
    });
  },
};

// Compliance APIs
export const complianceAPI = {
  getSummary: async (month: number, year: number) => {
    return fetchAPI<{ complianceItems: any[]; summaries: any }>(
      `/compliance?month=${month}&year=${year}`
    );
  },

  fileReturn: async (type: string, month: number, year: number, data: any) => {
    return fetchAPI<{ success: boolean; message: string }>('/compliance', {
      method: 'POST',
      body: JSON.stringify({ type, month, year, ...data }),
    });
  },
};

// Setup API
export const setupAPI = {
  checkStatus: async () => {
    return fetchAPI<{ isSetupComplete: boolean }>('/setup');
  },

  initialize: async (data: any) => {
    return fetchAPI<{ success: boolean; organization: any }>('/setup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
