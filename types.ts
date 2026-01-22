
export enum ModuleType {
  DASHBOARD = 'dashboard',
  PRODUCT = 'product',
  RESOURCE = 'resource',
  REVIEW = 'review',
  ORDER = 'order',
  CUSTOM = 'custom',
  PRICE = 'price'
}

export interface StatItem {
  label: string;
  value: number;
  trend: number;
  unit?: string;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  tag: string;
  status: 'pending' | 'approved' | 'rejected';
  updatedAt: string;
}
