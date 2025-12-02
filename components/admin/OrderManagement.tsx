
import * as React from 'react';
import type { Order, OrderStatus } from '../../types';

interface OrderManagementProps {
    orders: Order[];
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ orders, updateOrderStatus }) => {
    
    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-indigo-100 text-indigo-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Manage Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Order ID</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Total</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b dark:border-gray-700">
                                <td className="p-4 font-mono text-sm">{o.id}</td>
                                <td className="p-4 font-semibold">{o.customerName}</td>
                                <td className="p-4">{new Date(o.date).toLocaleDateString()}</td>
                                <td className="p-4 font-number">₹{o.total.toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <select 
                                        value={o.status} 
                                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                                        className="p-1 border rounded bg-white dark:bg-dark-bg dark:border-gray-600 text-sm"
                                    >
                                        <option>Pending</option>
                                        <option>Processing</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};