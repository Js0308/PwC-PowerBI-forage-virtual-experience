import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  AuthResponse, 
  Donor, 
  CreateDonorData, 
  Invoice, 
  CreateInvoiceData, 
  Receipt, 
  CreateReceiptData, 
  Expense, 
  CreateExpenseData, 
  DashboardStats, 
  DashboardAnalytics,
  PaginatedResponse,
  SearchFilters,
  ImportResult,
  GoogleSheetsData
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (id: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { id, password });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Donors API
export const donorsApi = {
  getAll: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Donor[]>> => {
    const response = await api.get('/donors', { params: filters });
    return {
      data: response.data.donors,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Donor> => {
    const response = await api.get(`/donors/${id}`);
    return response.data;
  },

  create: async (data: CreateDonorData): Promise<Donor> => {
    const response = await api.post('/donors', data);
    return response.data.donor;
  },

  update: async (id: string, data: Partial<CreateDonorData>): Promise<Donor> => {
    const response = await api.put(`/donors/${id}`, data);
    return response.data.donor;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/donors/${id}`);
  },

  searchByMobile: async (mobile: string): Promise<Donor> => {
    const response = await api.get(`/donors/search/mobile/${mobile}`);
    return response.data;
  },

  searchByName: async (name: string): Promise<Donor[]> => {
    const response = await api.get(`/donors/search/name/${name}`);
    return response.data;
  },
};

// Invoices API
export const invoicesApi = {
  getAll: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Invoice[]>> => {
    const response = await api.get('/invoices', { params: filters });
    return {
      data: response.data.invoices,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await api.post('/invoices', data);
    return response.data.invoice;
  },

  update: async (id: string, data: Partial<CreateInvoiceData>): Promise<Invoice> => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data.invoice;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },

  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Receipts API
export const receiptsApi = {
  getAll: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Receipt[]>> => {
    const response = await api.get('/receipts', { params: filters });
    return {
      data: response.data.receipts,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Receipt> => {
    const response = await api.get(`/receipts/${id}`);
    return response.data;
  },

  create: async (data: CreateReceiptData): Promise<Receipt> => {
    const response = await api.post('/receipts', data);
    return response.data.receipt;
  },

  update: async (id: string, data: Partial<CreateReceiptData>): Promise<Receipt> => {
    const response = await api.put(`/receipts/${id}`, data);
    return response.data.receipt;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/receipts/${id}`);
  },

  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/receipts/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Expenses API
export const expensesApi = {
  getAll: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Expense[]>> => {
    const response = await api.get('/expenses', { params: filters });
    return {
      data: response.data.expenses,
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (data: CreateExpenseData): Promise<Expense> => {
    const response = await api.post('/expenses', data);
    return response.data.expense;
  },

  update: async (id: string, data: Partial<CreateExpenseData>): Promise<Expense> => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data.expense;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getStats: async (filters: SearchFilters = {}) => {
    const response = await api.get('/expenses/stats/summary', { params: filters });
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getAnalytics: async (filters: SearchFilters = {}): Promise<DashboardAnalytics> => {
    const response = await api.get('/dashboard/analytics', { params: filters });
    return response.data;
  },

  getQuickStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/quick-stats');
    return response.data;
  },
};

// Google Sheets API
export const googleSheetsApi = {
  fetchData: async (): Promise<GoogleSheetsData[]> => {
    const response = await api.get('/google-sheets/fetch-data');
    return response.data.data;
  },

  importData: async (): Promise<ImportResult> => {
    const response = await api.post('/google-sheets/import-data');
    return response.data;
  },

  syncDonor: async (mobileNumber: string): Promise<Donor> => {
    const response = await api.post(`/google-sheets/sync-donor/${mobileNumber}`);
    return response.data.donor;
  },

  getStructure: async () => {
    const response = await api.get('/google-sheets/structure');
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Utility functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'paid':
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'overdue':
    case 'rejected':
    case 'cancelled':
      return 'error';
    default:
      return 'gray';
  }
};

export const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'cheque':
      return 'Cheque';
    case 'online':
      return 'Online';
    case 'bank_transfer':
      return 'Bank Transfer';
    default:
      return method;
  }
};

export const getAreaLabel = (area: string) => {
  return area;
};

export const getCategoryLabel = (category: string) => {
  return category;
};

export default api;