
import * as React from 'react';
import type { Order, Product } from '../../types';

interface DashboardProps {
    products: Product[];
    orders: Order[];
}

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            {/* @ts-ignore */}
            <ion-icon name={icon} className="text-3xl text-white"></ion-icon>
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{title}</p>
            <p className="text-3xl font-bold font-number">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ products, orders }) => {
    const activeProducts = products.filter(p => !p.deletedAt);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const lowStockProducts = activeProducts.filter(p => (p.stock || 0) < 5).length;

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon="cash-outline" color="bg-green-500" />
                <StatCard title="Total Orders" value={orders.length.toString()} icon="cart-outline" color="bg-blue-500" />
                <StatCard title="Total Products" value={activeProducts.length.toString()} icon="cube-outline" color="bg-purple-500" />
                <StatCard title="Low Stock Items" value={lowStockProducts.toString()} icon="warning-outline" color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">Sales Overview</h3>
                    <div className="h-80 flex items-center justify-center text-gray-400">
                        {/* Placeholder for a chart library like Recharts or Chart.js */}
                        <p>Sales chart would be displayed here.</p>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
                    <ul className="space-y-4">
                        {orders.slice(0, 5).map(order => (
                            <li key={order.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{order.customerName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <p className="font-bold text-dark-gold dark:text-primary-gold font-number">₹{order.total.toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};