export type ProductCategory = 'ROPA' | 'CALZADO' | 'ACCESORIOS';

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  sizes: string[];
  stockPerSize: Record<string, number>;
  totalStock: number;
  image: string;
  additionalImages?: string[];
  isFeatured: boolean;
  description: string;
  tags: string[];
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  maxAvailableStock: number;
}

export type PaymentMethod = 'mercadopago' | 'credit_card' | 'transfer' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  dniOrTaxId: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  couponCode?: string;
  trackingNumber?: string;
  notes?: string;
  whatsappNotified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minPurchase?: number;
  active: boolean;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
}

export type UserRole = 'admin' | 'seller' | 'customer';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  authProvider: 'google' | 'email' | 'guest';
  permissions: {
    canEditInventory: boolean;
    canManageOrders: boolean;
    canViewAnalytics: boolean;
    canManageCoupons: boolean;
    canManageUsers: boolean;
    canSendWhatsApp: boolean;
  };
  phone?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system' | 'whatsapp';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'order_confirmed' | 'order_shipped' | 'payment_reminder' | 'custom';
  content: string;
}
