
import * as React from 'react';
import type { AdminPage } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isSidebarOpen: boolean;
}> = ({ icon, label, isActive, onClick, isSidebarOpen }) => (
  <li
    onClick={onClick}
    className={`group relative flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out ${isActive
        ? 'bg-royal-gold/10 text-royal-gold dark:bg-royal-gold/20'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${!isSidebarOpen ? 'justify-center' : ''}`}
  >
    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-royal-gold rounded-r-full transition-transform duration-300 ease-in-out ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>

    {/* @ts-ignore */}
    <ion-icon name={icon} className="text-xl w-6 flex-shrink-0"></ion-icon>

    {isSidebarOpen && <span className="ml-4 font-semibold whitespace-nowrap">{label}</span>}

    {!isSidebarOpen && (
      <span className="absolute left-full ml-4 w-auto min-w-max px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out 
                       transform scale-95 group-hover:scale-100 pointer-events-none dark:bg-gray-700 z-10">
        {label}
      </span>
    )}
  </li>
);

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500); // Match animation duration
    return () => clearTimeout(timer);
  }, [activePage]);

  const navItems = [
    { page: 'dashboard' as AdminPage, icon: 'grid-outline', label: 'Dashboard' },
    { page: 'products' as AdminPage, icon: 'cube-outline', label: 'Products' },
    { page: 'orders' as AdminPage, icon: 'cart-outline', label: 'Orders' },
    { page: 'customers' as AdminPage, icon: 'people-outline', label: 'Customers' },
    { page: 'settings' as AdminPage, icon: 'settings-outline', label: 'Settings' },
    { page: 'auditLog' as AdminPage, icon: 'document-text-outline', label: 'Audit Log' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-light-text dark:text-dark-text font-body">
      <style>{`
        @keyframes admin-content-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-admin-content-fade-in {
          animation: admin-content-fade-in 0.5s ease-out forwards;
        }
      `}</style>
      {/* Sidebar */}
      <aside className={`relative bg-white dark:bg-dark-bg shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b dark:border-gray-700">
          <span className={`font-bold font-heading text-xl text-dark-gold dark:text-primary-gold transition-opacity duration-200 ${!isSidebarOpen && 'opacity-0'}`}>Admin</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            {/* @ts-ignore */}
            <ion-icon name={isSidebarOpen ? 'chevron-back-outline' : 'chevron-forward-outline'}></ion-icon>
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {navItems.map(item => (
              <NavItem
                key={item.page}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.page}
                onClick={() => onNavigate(item.page)}
                isSidebarOpen={isSidebarOpen}
              />
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
          <NavItem icon="log-out-outline" label="Logout" isActive={false} onClick={onLogout} isSidebarOpen={isSidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-dark-bg shadow-sm h-20 flex items-center px-8 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold font-heading capitalize">{activePage}</h1>
        </header>
        <main className={`flex-1 p-8 overflow-y-auto ${isAnimating ? 'animate-admin-content-fade-in' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};