
import * as React from 'react';
import type { Customer } from '../../types';

interface CustomerManagementProps {
    customers: Customer[];
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers }) => {
    return (
        <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Manage Customers</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Name</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Email</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Join Date</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Orders</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id} className="border-b dark:border-gray-700">
                                <td className="p-4 font-semibold">{c.name}</td>
                                <td className="p-4">{c.email}</td>
                                <td className="p-4">{new Date(c.joinDate).toLocaleDateString()}</td>
                                <td className="p-4 text-center font-number">{c.orderCount}</td>
                                <td className="p-4 font-number">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};