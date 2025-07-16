export interface User {
  id: string;
  role: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Donor {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobileNumber: string;
  area: 'Masjid Chawl' | 'Phugewadi' | 'Wakhare Chawl' | 'Sanjay Nagar' | 'Outside';
  totalDonations: number;
  lastDonationDate: string | null;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonorData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  area: Donor['area'];
  notes?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  donor: Donor;
  amount: number;
  currency: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  paymentMethod?: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  paymentDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  donorId: string;
  amount: number;
  description?: string;
  dueDate: string;
  notes?: string;
}

export interface Receipt {
  _id: string;
  receiptNumber: string;
  donor: Donor;
  invoice?: Invoice;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  paymentDate: string;
  chequeNumber?: string;
  bankName?: string;
  transactionId?: string;
  notes?: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptData {
  donorId: string;
  invoiceId?: string;
  amount: number;
  description?: string;
  paymentMethod: Receipt['paymentMethod'];
  paymentDate: string;
  chequeNumber?: string;
  bankName?: string;
  transactionId?: string;
  notes?: string;
}

export interface Expense {
  _id: string;
  expenseNumber: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  category: 'Maintenance' | 'Utilities' | 'Religious Events' | 'Staff Salary' | 'Cleaning' | 'Security' | 'Repairs' | 'Office Supplies' | 'Food & Refreshments' | 'Transportation' | 'Medical' | 'Education' | 'Charity' | 'Others';
  expenseDate: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'bank_transfer';
  vendor?: string;
  billNumber?: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  title: string;
  description: string;
  amount: number;
  category: Expense['category'];
  expenseDate: string;
  paymentMethod: Expense['paymentMethod'];
  vendor?: string;
  billNumber?: string;
  notes?: string;
}

export interface DashboardStats {
  totalDonors: number;
  totalDonationCollection: number;
  totalExpenses: number;
  pendingInvoices: number;
  thisMonthDonations: number;
  thisMonthExpenses: number;
  netBalance: number;
}

export interface DashboardAnalytics {
  donors: {
    total: number;
    newThisMonth: number;
  };
  donations: {
    total: number;
    thisMonth: number;
  };
  invoices: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
  };
  recentDonations: Receipt[];
  topDonors: Donor[];
  donationsByArea: {
    _id: string;
    total: number;
    count: number;
  }[];
  monthlyDonations: {
    _id: {
      year: number;
      month: number;
    };
    total: number;
    count: number;
  }[];
  paymentMethodStats: {
    _id: string;
    total: number;
    count: number;
  }[];
  monthlyExpenses: {
    _id: {
      year: number;
      month: number;
    };
    total: number;
    count: number;
  }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMeta;
}

export interface SearchFilters {
  search?: string;
  area?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  page?: number;
  limit?: number;
}

export interface GoogleSheetsData {
  [key: string]: string;
}

export interface ImportResult {
  message: string;
  imported: number;
  skipped: number;
  errors?: string[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface TabItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: any;
  color: string;
}

export interface ChartProps {
  data: ChartData;
  title: string;
  height?: number;
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: any;
  action?: {
    label: string;
    onClick: () => void;
  };
}