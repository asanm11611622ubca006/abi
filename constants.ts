import { Product, Customer, Order, ShowcaseCategory, User } from './types';

export const INITIAL_USERS: User[] = [];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'g1',
    name: 'Antique Gold Necklace',
    category: 'Gold',
    sku: 'AJ-G-N-001',
    stock: 5,
    description: 'A stunning antique necklace crafted with intricate details, perfect for weddings and special occasions. Made with pure 22K gold.',
    images: ['https://picsum.photos/id/1071/800/800', 'https://picsum.photos/id/1072/800/800', 'https://picsum.photos/id/1073/800/800'],
    weight: 40.5,
    purity: '22K',
    price: 294386,
    makingCharges: 15,
  },
  {
    id: 'g2',
    name: 'Royal Kemp Jhumkas',
    category: 'Gold',
    sku: 'AJ-G-E-002',
    stock: 12,
    description: 'Elegant 22K gold Jhumkas embedded with precious kemp stones, reflecting royal heritage.',
    images: ['https://picsum.photos/id/219/800/800', 'https://picsum.photos/id/220/800/800'],
    weight: 15.2,
    purity: '22K',
    price: 117291,
    makingCharges: 18,
  },
  {
    id: 'g3',
    name: '24K Pure Gold Bar',
    category: 'Gold',
    sku: 'AJ-G-B-003',
    stock: 50,
    description: 'A 10 gram bar of 24K pure gold, a perfect investment for the future.',
    images: ['https://picsum.photos/id/431/800/800'],
    weight: 10,
    purity: '24K',
    price: 60000,
    makingCharges: 5,
  },
  {
    id: 's1',
    name: 'Sterling Silver Anklet',
    category: 'Silver',
    sku: 'AJ-S-A-004',
    stock: 25,
    description: 'A beautiful pair of 92.5 Sterling Silver anklets with delicate charms.',
    images: ['https://picsum.photos/id/435/800/800'],
    weight: 25,
    purity: '92.5 Sterling',
    price: 2500,
  },
  {
    id: 's2',
    name: 'Silver Pooja Thali Set',
    category: 'Silver',
    sku: 'AJ-S-P-005',
    stock: 8,
    description: 'An auspicious pooja thali set made from pure silver, ideal for festive rituals.',
    images: ['https://picsum.photos/id/567/800/800'],
    weight: 250,
    purity: '92.5 Sterling',
    price: 28000,
  },
  {
    id: 'c1',
    name: 'Peacock Design Covering Haram',
    category: 'Covering',
    sku: 'AJ-C-H-006',
    stock: 15,
    description: 'A grand gold-plated haram with an exquisite peacock design, perfect for cultural events.',
    images: ['https://picsum.photos/id/659/800/800'],
    weight: 100,
    price: 5500,
  },
   {
    id: 'g4',
    name: 'Elegant Gold Bangle',
    category: 'Gold',
    sku: 'AJ-G-BG-007',
    stock: 0,
    description: 'A classic 22K gold bangle, designed for daily wear and timeless elegance.',
    images: ['https://picsum.photos/id/305/800/800'],
    weight: 8.5,
    purity: '22K',
    price: 59139,
    makingCharges: 12,
  },
  {
    id: 's3',
    name: 'Silver Toe Rings',
    category: 'Silver',
    sku: 'AJ-S-TR-008',
    stock: 40,
    description: 'A pair of adjustable silver toe rings with floral patterns.',
    images: ['https://picsum.photos/id/321/800/800'],
    weight: 5,
    purity: '92.5 Sterling',
    price: 800,
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Priya Patel', email: 'priya.patel@example.com', joinDate: '2023-05-12', phone: '9876543210', orderCount: 3, totalSpent: 150000 },
    { id: 'c2', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', joinDate: '2023-08-20', phone: '8765432109', orderCount: 1, totalSpent: 59139 },
    { id: 'c3', name: 'Anjali Gupta', email: 'anjali.gupta@example.com', joinDate: '2024-01-05', phone: '7654321098', orderCount: 5, totalSpent: 350000 },
    { id: 'c4', name: 'Vikram Singh', email: 'vikram.singh@example.com', joinDate: '2024-02-18', phone: '6543210987', orderCount: 2, totalSpent: 30500 },
];

export const INITIAL_ORDERS: Order[] = [
    { id: 'ord1001', customerName: 'Anjali Gupta', customerEmail: 'anjali.gupta@example.com', date: '2024-03-15T10:30:00Z', total: 294386, status: 'Delivered', items: [{productId: 'g1', quantity: 1, name: 'Antique Gold Necklace'}] },
    { id: 'ord1002', customerName: 'Priya Patel', customerEmail: 'priya.patel@example.com', date: '2024-04-01T14:00:00Z', total: 117291, status: 'Shipped', items: [{productId: 'g2', quantity: 1, name: 'Royal Kemp Jhumkas'}] },
    { id: 'ord1003', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@example.com', date: '2024-04-05T09:15:00Z', total: 28000, status: 'Processing', items: [{productId: 's2', quantity: 1, name: 'Silver Pooja Thali Set'}] },
    // FIX: Corrected property name from 'email' to 'customerEmail' to match the Order interface.
    { id: 'ord1004', customerName: 'Rohan Sharma', customerEmail: 'rohan.sharma@example.com', date: '2024-04-10T18:45:00Z', total: 59139, status: 'Pending', items: [{productId: 'g4', quantity: 1, name: 'Elegant Gold Bangle'}] },
    { id: 'ord1005', customerName: 'Anjali Gupta', customerEmail: 'anjali.gupta@example.com', date: '2024-04-11T11:00:00Z', total: 3300, status: 'Delivered', items: [{productId: 's1', quantity: 1, name: 'Sterling Silver Anklet'}, {productId: 's3', quantity: 1, name: 'Silver Toe Rings'}] },
];


export const INITIAL_SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  { name: 'Gold', image: 'https://picsum.photos/id/1071/500/500' },
  { name: 'Silver', image: 'https://picsum.photos/id/435/500/500' },
  { name: 'Covering', image: 'https://picsum.photos/id/659/500/500' },
];

export const ADMIN_EMAILS = ['chandruchandru9045@gmail.com', 'hariharan76265@gmail.com'];