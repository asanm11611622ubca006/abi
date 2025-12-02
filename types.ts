// FIX: Use namespace import for React to ensure global JSX types are correctly resolved.
import * as React from "react";

export type Page = 'home' | 'products' | 'productDetail' | 'wishlist' | 'compare' | 'contact' | 'admin' | 'login' | 'signup' | 'myUploads';
export type AdminPage = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'auditLog';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be a hash
  wishlist: string[]; // Array of product IDs
  // FIX: Added optional uploads property for MyUploadsPage component
  uploads?: string[];
}

export type Category = 'Gold' | 'Silver' | 'Covering';

export type Purity = '24K' | '22K' | '92.5 Sterling';

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: Category;
  description:string;
  images: string[];
  video?: string;
  price: number;
  weight?: number; // in grams
  purity?: Purity;
  stock?: number;
  makingCharges?: number; // As a percentage
  deletedAt?: string | null; // For soft-delete
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: { productId: string, quantity: number, name: string }[];
    userId?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    phone: string;
    orderCount: number;
    totalSpent: number;
}

export interface GoldRates {
  '22K': number;
  '24K': number;
}

export interface ShowcaseCategory {
  name: string;
  image: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'RESTORE' | 'PERMANENT_DELETE' | 'SETTINGS_UPDATE';
  entity: 'Product' | 'Order' | 'Customer' | 'Settings';
  entityId: string;
  details: string;
}