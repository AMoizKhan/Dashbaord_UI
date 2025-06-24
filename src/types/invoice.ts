export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceClient {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface InvoiceCompany {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  website?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  client: InvoiceClient;
  company: InvoiceCompany;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: InvoiceClient;
  company: InvoiceCompany;
  items: InvoiceItem[];
  taxRate: number;
  notes?: string;
}
