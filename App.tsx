
import * as React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { ProductCard } from './components/ProductCard';
import { CompareBar } from './components/CompareBar';
import { GoldRateTicker } from './components/GoldRateTicker';
import type { Page, Product, Category, AdminPage, Customer, Order, OrderStatus, GoldRates, ShowcaseCategory, User, AuditLogEntry } from './types';
import { ADMIN_EMAILS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_SHOWCASE_CATEGORIES, INITIAL_USERS } from './constants';
import { api } from './api';

import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { ProductManagement } from './components/admin/ProductManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { Settings } from './components/admin/Settings';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { MyUploadsPage } from './components/MyUploadsPage';


const AuditLogPage: React.FC<{ log: AuditLogEntry[] }> = ({ log }) => {
    return (
        <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Audit Log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing the last {log.length} entries from local storage.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Timestamp</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">User</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Action</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Entity</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {log.map(entry => (
                            <tr key={entry.id} className="border-b dark:border-gray-700">
                                <td className="p-4 text-sm whitespace-nowrap">{new Date(entry.timestamp).toLocaleString()}</td>
                                <td className="p-4 text-sm">{entry.userEmail}</td>
                                <td className="p-4 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${entry.action.includes('DELETE') || entry.action.includes('ARCHIVE') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{entry.action}</span></td>
                                <td className="p-4 text-sm">{entry.entity} ({entry.entityId.slice(0, 10)}...)</td>
                                <td className="p-4 text-sm">{entry.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {log.length === 0 && <p className="text-center text-gray-500 py-8">No log entries yet.</p>}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    // STATE MANAGEMENT - Loaded from localStorage or initialized from constants
    const [isLoading, setIsLoading] = React.useState(true);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [orders, setOrders] = React.useState<Order[]>(() => JSON.parse(localStorage.getItem('abirami_orders') || 'null') || INITIAL_ORDERS);
    const [customers, setCustomers] = React.useState<Customer[]>(() => JSON.parse(localStorage.getItem('abirami_customers') || 'null') || INITIAL_CUSTOMERS);
    const [users, setUsers] = React.useState<User[]>(() => JSON.parse(localStorage.getItem('abirami_users') || 'null') || INITIAL_USERS);
    const [auditLog, setAuditLog] = React.useState<AuditLogEntry[]>(() => JSON.parse(localStorage.getItem('abirami_auditLog') || '[]'));

    // --- SETTINGS STATE ---
    const [settings, setSettings] = React.useState({
        goldRates: { '22K': 6650, '24K': 7255 },
        silverRate: 95,
        heroImage: 'https://picsum.photos/id/13/1920/1080',
        manageableCategories: ['Gold', 'Silver', 'Covering'],
        manageablePurities: ['24K', '22K', '92.5 Sterling'],
        showcaseCategories: INITIAL_SHOWCASE_CATEGORIES,
    });
    const { goldRates, silverRate, heroImage, manageableCategories, manageablePurities, showcaseCategories } = settings;

    // --- UI & AUTH STATE ---
    const [currentPage, setCurrentPage] = React.useState<Page>('home');
    const [adminPage, setAdminPage] = React.useState<AdminPage>('dashboard');
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [compareList, setCompareList] = React.useState<string[]>(() => JSON.parse(localStorage.getItem('abirami_compare') || '[]'));
    const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => localStorage.getItem('abirami_theme') === 'dark');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filters, setFilters] = React.useState({ category: 'All' as Category | 'All', purity: 'All' });
    const [currentUser, setCurrentUser] = React.useState<User | null>(() => JSON.parse(localStorage.getItem('abirami_currentUser') || 'null'));

    // FIX: Robust check for admin authentication (case-insensitive and trimmed)
    const isAdminAuthenticated = React.useMemo(() => {
        if (!currentUser) return false;
        return ADMIN_EMAILS.some(adminEmail => adminEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase());
    }, [currentUser]);


    // --- DATA PERSISTENCE EFFECTS ---
    React.useEffect(() => {
        api.getProducts()
            .then(setProducts)
            .catch(err => console.error("Failed to load products", err));

        api.getSettings()
            .then(fetchedSettings => {
                setSettings({
                    goldRates: fetchedSettings.gold_rates,
                    silverRate: fetchedSettings.silver_rate,
                    heroImage: fetchedSettings.hero_image,
                    manageableCategories: fetchedSettings.categories,
                    manageablePurities: fetchedSettings.purities,
                    showcaseCategories: fetchedSettings.showcase_categories
                });
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);
    // React.useEffect(() => { localStorage.setItem('abirami_products', JSON.stringify(products)); }, [products]);
    React.useEffect(() => { localStorage.setItem('abirami_orders', JSON.stringify(orders)); }, [orders]);
    React.useEffect(() => { localStorage.setItem('abirami_customers', JSON.stringify(customers)); }, [customers]);
    React.useEffect(() => { localStorage.setItem('abirami_users', JSON.stringify(users)); }, [users]);
    React.useEffect(() => { localStorage.setItem('abirami_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
    // React.useEffect(() => { localStorage.setItem('abirami_settings', JSON.stringify(settings)); }, [settings]);
    React.useEffect(() => { localStorage.setItem('abirami_auditLog', JSON.stringify(auditLog)); }, [auditLog]);
    React.useEffect(() => { localStorage.setItem('abirami_compare', JSON.stringify(compareList)); }, [compareList]);


    // --- UI EFFECTS ---
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        localStorage.setItem('abirami_theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    React.useEffect(() => {
        const handlePopState = (event: PopStateEvent) => setCurrentPage(event.state?.page || 'home');
        window.addEventListener('popstate', handlePopState);
        window.history.replaceState({ page: 'home' }, '');
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // --- AUDIT LOG HELPER ---
    const logAction = (action: AuditLogEntry['action'], entity: AuditLogEntry['entity'], entityId: string, details: string) => {
        if (!currentUser) return;
        const newLogEntry: AuditLogEntry = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userEmail: currentUser.email,
            action, entity, entityId, details,
        };
        setAuditLog(prev => [newLogEntry, ...prev].slice(0, 100));
    };

    // --- HELPER FUNCTIONS & CALLBACKS ---
    const calculatePrice = React.useCallback((product: Product): number => {
        if (product.category === 'Gold' && product.weight && product.purity && (product.purity === '22K' || product.purity === '24K')) {
            const rate = goldRates[product.purity as '22K' | '24K'];
            if (!rate || rate === 0) return product.price; // Fallback if rates aren't loaded
            const goldValue = product.weight * rate;
            const makingChargesPercent = product.makingCharges ?? 15;
            const makingCharges = goldValue * (makingChargesPercent / 100);
            const totalBeforeGst = goldValue + makingCharges;
            const gst = totalBeforeGst * 0.03; // 3% GST
            return Math.round(totalBeforeGst + gst);
        }
        return product.price;
    }, [goldRates]);

    const navigateTo = (page: Page) => {
        window.scrollTo(0, 0);
        if (page !== currentPage) {
            window.history.pushState({ page }, '');
        }
        setCurrentPage(page);
    };

    const navigateAdminTo = (page: AdminPage) => setAdminPage(page);
    const handleViewDetails = (product: Product) => { setSelectedProduct(product); navigateTo('productDetail'); };
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const handleSearch = (query: string) => { setSearchQuery(query); navigateTo('products'); };

    // --- LOCAL CRUD & SETTINGS HANDLERS ---
    const addProduct = async (product: Product) => {
        try {
            const newProduct = { ...product, id: product.id || `prod_${Date.now()}` };
            const savedProduct = await api.createProduct(newProduct);
            setProducts(prev => [...prev, savedProduct]);
            logAction('CREATE', 'Product', savedProduct.id, `Created: ${savedProduct.name}`);
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Failed to create product. Please try again.");
        }
    };
    const updateProduct = async (updatedProduct: Product) => {
        try {
            const savedProduct = await api.updateProduct(updatedProduct);
            setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
            logAction('UPDATE', 'Product', savedProduct.id, `Updated: ${savedProduct.name}`);
        } catch (error) {
            console.error("Failed to update product", error);
            alert("Failed to update product. Please try again.");
        }
    };
    const softDeleteProduct = async (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        try {
            const updatedProduct = { ...product, deletedAt: new Date().toISOString() };
            await api.updateProduct(updatedProduct);
            setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
            logAction('ARCHIVE', 'Product', productId, `Archived product`);
        } catch (error) {
            console.error("Failed to archive product", error);
            alert("Failed to archive product.");
        }
    };
    const restoreProduct = async (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        try {
            const updatedProduct = { ...product, deletedAt: null };
            await api.updateProduct(updatedProduct);
            setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
            logAction('RESTORE', 'Product', productId, `Restored product`);
        } catch (error) {
            console.error("Failed to restore product", error);
            alert("Failed to restore product.");
        }
    };
    const permanentlyDeleteProduct = async (productId: string) => {
        try {
            await api.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p.id !== productId));
            logAction('PERMANENT_DELETE', 'Product', productId, `Permanently deleted product`);
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product.");
        }
    };
    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        logAction('UPDATE', 'Order', orderId, `Set status to ${status}`);
    };
    const saveSettings = async (newSettings: Partial<typeof settings>) => {
        const previousSettings = { ...settings };
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);

        try {
            await api.updateSettings({
                gold_rates: updatedSettings.goldRates,
                silver_rate: updatedSettings.silverRate,
                hero_image: updatedSettings.heroImage,
                categories: updatedSettings.manageableCategories,
                purities: updatedSettings.manageablePurities,
                showcase_categories: updatedSettings.showcaseCategories
            });
            logAction('SETTINGS_UPDATE', 'Settings', 'app_settings', 'Updated application settings');
        } catch (error) {
            console.error("Failed to save settings", error);
            setSettings(previousSettings); // Revert on failure
            alert("Failed to save settings. Please check your connection or try a smaller image.");
        }
    };

    // --- AUTHENTICATION HANDLERS ---
    const handleLogin = async (emailInput: string, password: string): Promise<boolean> => {
        const email = emailInput.trim().toLowerCase(); // Normalize email (remove spaces, lowercase)

        // Special Admin Login Check (Robust against whitespace/casing)
        if (ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email) && password === 'candy27') {
            let adminUser = users.find(u => u.email.toLowerCase() === email);
            if (!adminUser) {
                // Create admin user if doesn't exist
                adminUser = {
                    id: `admin_${email.split('@')[0]}`,
                    name: 'Admin',
                    email: email, // Store normalized email
                    password: password,
                    wishlist: [],
                    uploads: []
                };
                setUsers(prev => [...prev, adminUser!]);
            }
            setCurrentUser(adminUser);
            navigateTo('admin'); // Direct to admin page as requested
            return true;
        }

        const user = users.find(u => u.email === emailInput && u.password === password);
        if (user) {
            setCurrentUser(user);
            navigateTo('home');
            return true;
        }
        return false;
    };

    const handleSignup = async (name: string, email: string, password: string): Promise<boolean> => {
        if (users.some(u => u.email === email)) return false;
        const newUser: User = { id: `user_${Date.now()}`, name, email, password, wishlist: [], uploads: [] };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        navigateTo('home');
        return true;
    };
    const handleLogout = () => { setCurrentUser(null); navigateTo('home'); };

    // --- USER-SPECIFIC HANDLERS ---
    const toggleWishlist = (product: Product) => {
        if (!currentUser) { navigateTo('login'); return; }
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return;

        const updatedUser = { ...users[userIndex] };
        const isInWishlist = updatedUser.wishlist.includes(product.id);
        updatedUser.wishlist = isInWishlist
            ? updatedUser.wishlist.filter(id => id !== product.id)
            : [...updatedUser.wishlist, product.id];

        const newUsers = [...users];
        newUsers[userIndex] = updatedUser;
        setUsers(newUsers);
        setCurrentUser(updatedUser);
    };

    const handleAddUpload = (imageData: string) => {
        if (!currentUser) return;
        const updatedUsers = users.map(user => {
            if (user.id === currentUser.id) {
                const newUploads = [...(user.uploads || []), imageData];
                const updatedUser = { ...user, uploads: newUploads };
                setCurrentUser(updatedUser);
                return updatedUser;
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    const handleDeleteUpload = (indexToDelete: number) => {
        if (!currentUser) return;
        const updatedUsers = users.map(user => {
            if (user.id === currentUser.id) {
                const newUploads = (user.uploads || []).filter((_, index) => index !== indexToDelete);
                const updatedUser = { ...user, uploads: newUploads };
                setCurrentUser(updatedUser);
                return updatedUser;
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    const toggleCompare = (product: Product) => { setCompareList(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : (prev.length < 4 ? [...prev, product.id] : prev)); };
    const clearCompareList = () => setCompareList([]);
    const removeFromCompareList = (productId: string) => setCompareList(prev => prev.filter(id => id !== productId));

    // --- MEMOIZED VALUES ---
    const wishlist = React.useMemo(() => currentUser?.wishlist || [], [currentUser]);
    const wishlistProducts = React.useMemo(() => products.filter(p => wishlist.includes(p.id) && !p.deletedAt), [products, wishlist]);
    const compareProducts = React.useMemo(() => products.filter(p => compareList.includes(p.id) && !p.deletedAt), [products, compareList]);

    const filteredProducts = React.useMemo(() => {
        return products.filter(product => {
            if (product.deletedAt) return false;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filters.category === 'All' || product.category === filters.category;
            const matchesPurity = filters.purity === 'All' || !product.purity || product.purity === filters.purity;
            return matchesSearch && matchesCategory && matchesPurity;
        });
    }, [products, searchQuery, filters]);

    // --- PAGE COMPONENTS ---
    const HomePage = () => (
        <div>
            <section className="relative h-[60vh] text-white flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-shadow-lg animate-fade-in-down">Timeless Elegance, Modern Grace</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up">Discover exquisite jewellery that tells a story of heritage and craftsmanship.</p>
                    <button onClick={() => navigateTo('products')} className="mt-8 px-8 py-3 bg-primary-gold text-black font-bold rounded-full hover:bg-dark-gold transition-all duration-300 transform hover:scale-105">
                        Explore Collections
                    </button>
                </div>
            </section>
            <GoldRateTicker rates={goldRates} silverRate={silverRate} />
            <div className="space-y-16 mt-16">
                <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-heading text-center mb-12 text-light-text dark:text-dark-text">Shop by Category</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                        {showcaseCategories.map(cat => (
                            <div key={cat.name} onClick={() => { setFilters(f => ({ ...f, category: cat.name as Category })); navigateTo('products'); }} className="relative group rounded-full w-56 h-56 sm:w-64 sm:h-64 overflow-hidden cursor-pointer shadow-lg transition-all duration-300">
                                <div style={{ backgroundImage: `url('${cat.image}')` }} className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 rounded-full"></div>
                                <h3 className="relative z-10 flex items-center justify-center h-full text-3xl font-bold font-heading text-white transition-all duration-300 group-hover:[text-shadow:0_0_15px_#fff,0_0_25px_#fff] [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">{cat.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-heading text-center mb-8 text-light-text dark:text-dark-text">Featured Jewellery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.filter(p => !p.deletedAt).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} price={calculatePrice(p)} onViewDetails={handleViewDetails} onToggleWishlist={toggleWishlist} onToggleCompare={toggleCompare} isInWishlist={wishlist.includes(p.id)} isInCompare={compareList.includes(p.id)} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );

    const ProductListPage = () => (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4 space-y-8">
                <div>
                    <h3 className="text-xl font-bold font-heading mb-4 text-gray-800 dark:text-gray-200">Category</h3>
                    <div className="flex flex-wrap gap-2">
                        {['All', ...manageableCategories].map(cat => (
                            <button key={cat} onClick={() => setFilters(f => ({ ...f, category: cat as Category | 'All' }))} className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors ${filters.category === cat ? 'bg-primary-gold text-black border-primary-gold' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-primary-gold'}`}>{cat}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold font-heading mb-4 text-gray-800 dark:text-gray-200">Purity</h3>
                    <div className="flex flex-wrap gap-2">
                        {['All', ...manageablePurities].map(purity => (
                            <button key={purity} onClick={() => setFilters(f => ({ ...f, purity }))} className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors ${filters.purity === purity ? 'bg-primary-gold text-black border-primary-gold' : 'bg-transparent border-gray-300 dark:border-gray-600 hover:border-primary-gold'}`}>{purity}</button>
                        ))}
                    </div>
                </div>
            </aside>
            <div className="flex-1">
                <h1 className="text-4xl font-bold font-heading mb-8 text-center lg:text-left text-light-text dark:text-dark-text">Our Collections</h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
                    {filteredProducts.map(p => (
                        <ProductCard key={p.id} product={p} price={calculatePrice(p)} onViewDetails={handleViewDetails} onToggleWishlist={toggleWishlist} onToggleCompare={toggleCompare} isInWishlist={wishlist.includes(p.id)} isInCompare={compareList.includes(p.id)} />
                    ))}
                </div>
                {filteredProducts.length === 0 && <p className="text-center col-span-full text-lg text-gray-500 mt-10">No products match your criteria.</p>}
            </div>
        </div>
    );

    const ProductDetailPage = () => {
        if (!selectedProduct) return <div className="text-center py-20">Product not found.</div>;
        const [mainImage, setMainImage] = React.useState(selectedProduct.images[0]);
        React.useEffect(() => { if (selectedProduct) setMainImage(selectedProduct.images[0]); }, [selectedProduct]);
        const price = calculatePrice(selectedProduct);
        const whatsappMessage = `Hello Abirami Jewellery, I'm interested in this product:\n\n*Name:* ${selectedProduct.name}\n*Price:* ₹${price.toLocaleString('en-IN')}\n\nCould you please provide more details?\n_Product ID: ${selectedProduct.id}_`;
        const relatedProducts = products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id && !p.deletedAt).slice(0, 4);
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <img src={mainImage} alt={selectedProduct.name} className="w-full rounded-lg shadow-lg mb-4 h-96 object-cover" />
                        <div className="flex gap-2 flex-wrap">
                            {selectedProduct.images.map((img, i) => <img key={i} src={img} onClick={() => setMainImage(img)} alt={`${selectedProduct.name} view ${i + 1}`} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-primary-gold' : 'border-transparent'}`} />)}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-heading text-light-text dark:text-dark-text">{selectedProduct.name}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{selectedProduct.category} {selectedProduct.purity ? `- ${selectedProduct.purity}` : ''}</p>
                        <p className="text-4xl font-extrabold text-primary-gold mt-6 font-number">₹{price.toLocaleString('en-IN')}</p>
                        {selectedProduct.category === 'Gold' && <p className="text-sm text-gray-500 dark:text-gray-400">(Price includes making charges & GST)</p>}
                        <p className="mt-6 text-base leading-relaxed text-light-text dark:text-dark-text">{selectedProduct.description}</p>
                        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                            {selectedProduct.weight && <p><strong>Weight:</strong> <span className="font-number">{selectedProduct.weight}g</span></p>}
                            {selectedProduct.stock != null && <p><strong>Stock:</strong> <span className="font-number">{selectedProduct.stock > 0 ? `${selectedProduct.stock} units` : 'Out of Stock'}</span></p>}
                            {selectedProduct.sku && <p><strong>SKU:</strong> <span className="font-number">{selectedProduct.sku}</span></p>}
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button onClick={() => toggleWishlist(selectedProduct)} className={`px-6 py-3 rounded-md font-bold flex items-center gap-2 border-2 transition-colors ${wishlist.includes(selectedProduct.id) ? 'bg-red-500 text-white border-red-500' : 'bg-transparent border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                {/* @ts-ignore */}
                                <ion-icon name={wishlist.includes(selectedProduct.id) ? "heart" : "heart-outline"}></ion-icon>
                                {wishlist.includes(selectedProduct.id) ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>

                        </div>
                        <a href={`https://wa.me/919003206991?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full bg-green-500 text-white font-bold py-4 rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                            {/* @ts-ignore */}
                            <ion-icon name="logo-whatsapp"></ion-icon>
                            Buy on WhatsApp
                        </a>
                    </div>
                </div>
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t pt-12 dark:border-gray-800">
                        <h2 className="text-3xl font-bold font-heading text-center mb-12 text-light-text dark:text-dark-text">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(p => <ProductCard key={p.id} product={p} price={calculatePrice(p)} onViewDetails={handleViewDetails} onToggleWishlist={toggleWishlist} onToggleCompare={toggleCompare} isInWishlist={wishlist.includes(p.id)} isInCompare={compareList.includes(p.id)} />)}
                        </div>
                    </div>
                )}
            </div>
        )
    };

    const WishlistPage = () => {
        if (!currentUser) return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold font-heading mb-4">My Wishlist</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Please log in to view and save your favorite items.</p>
                <button onClick={() => navigateTo('login')} className="px-8 py-3 bg-primary-gold text-black font-bold rounded-full hover:bg-dark-gold">Go to Login</button>
            </div>
        )
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold font-heading mb-8 text-center">My Wishlist</h1>
                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistProducts.map(p => <ProductCard key={p.id} product={p} price={calculatePrice(p)} onViewDetails={handleViewDetails} onToggleWishlist={toggleWishlist} onToggleCompare={toggleCompare} isInWishlist={wishlist.includes(p.id)} isInCompare={compareList.includes(p.id)} />)}
                    </div>
                ) : <p className="text-center text-lg text-gray-500">Your wishlist is empty.</p>}
            </div>
        )
    };

    const ComparePage = () => (<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"> <h1 className="text-4xl font-bold font-heading mb-8 text-center">Compare Products</h1> {compareProducts.length > 0 ? (<div className="overflow-x-auto"> <table className="w-full text-left border-collapse"> <thead> <tr className="bg-gray-100 dark:bg-gray-800"> <th className="p-4 font-bold">Feature</th> {compareProducts.map(p => <th key={p.id} className="p-4 font-bold text-center"><img src={p.images[0]} alt={p.name} className="w-24 h-24 mx-auto object-cover rounded-md" /></th>)} </tr> </thead> <tbody> {['name', 'category', 'purity', 'weight', 'price', 'stock'].map(feature => (<tr key={feature} className="border-b dark:border-gray-700"> <td className="p-4 font-semibold capitalize">{feature}</td> {compareProducts.map(p => (<td key={p.id} className="p-4 text-center font-number"> {feature === 'price' ? `₹${calculatePrice(p).toLocaleString()}` : p[feature as keyof Product] || '-'} </td>))} </tr>))} </tbody> </table> </div>) : <p className="text-center text-lg text-gray-500">Add products to compare.</p>} </div>);
    const ContactPage = () => (<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"> <h1 className="text-4xl font-bold font-heading mb-8 text-center">Contact Us</h1> <div className="grid grid-cols-1 md:grid-cols-2 gap-12"> <div> <h2 className="text-2xl font-bold font-heading mb-4">Get In Touch</h2> <p className="mb-4">We would love to hear from you. Visit our showroom or contact us with any inquiries.</p> <ul className="space-y-4 text-lg"> <li className="flex items-center gap-4">
        {/* @ts-ignore */}
        <ion-icon name="location" className="text-primary-gold text-2xl"></ion-icon>4F Padmanaban Street, Kumbakonam - 612002</li> <li className="flex items-center gap-4">
            {/* @ts-ignore */}
            <ion-icon name="call" className="text-primary-gold text-2xl"></ion-icon>+91 9003206991</li> <li className="flex items-center gap-4">
            {/* @ts-ignore */}
            <ion-icon name="mail" className="text-primary-gold text-2xl"></ion-icon>abiramijewellery.mks@gmail.com</li> <li className="flex items-center gap-4">
            {/* @ts-ignore */}
            <ion-icon name="time" className="text-primary-gold text-2xl"></ion-icon>Open: Mon - Sat, 10:00 AM - 9:00 PM</li> </ul> </div> <div> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.920584852901!2d79.37581597587636!3d10.96906805562762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a55333503254555%3A0xf6519156b26f3750!2sAbirami%20Jewellery!5e0!3m2!1sen!2sin!4v1719584457635!5m2!1sen!2sin" width="100%" height="450" className="rounded-lg shadow-lg border-0" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps Location"></iframe> </div> </div> </div>);

    const AdminPortalPage = () => {
        const renderAdminPage = () => {
            switch (adminPage) {
                case 'dashboard': return <Dashboard products={products} orders={orders} />;
                case 'products': return <ProductManagement products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={softDeleteProduct} restoreProduct={restoreProduct} permanentlyDeleteProduct={permanentlyDeleteProduct} goldRates={goldRates} calculatePrice={calculatePrice} categories={manageableCategories} purities={manageablePurities} currentUser={currentUser} />;
                case 'orders': return <OrderManagement orders={orders} updateOrderStatus={updateOrderStatus} />;
                case 'customers': return <CustomerManagement customers={customers} />;
                case 'settings': return <Settings goldRates={goldRates} silverRate={silverRate} heroImage={heroImage} categories={manageableCategories} purities={manageablePurities} showcaseCategories={showcaseCategories} onSave={(s) => saveSettings(s)} />;
                case 'auditLog': return <AuditLogPage log={auditLog} />;
                default: return <Dashboard products={products} orders={orders} />;
            }
        };

        if (!currentUser) {
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-3xl font-bold font-heading mb-4">Admin Access Required</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Please log in with an administrator account.</p>
                    <button onClick={() => navigateTo('login')} className="px-8 py-3 bg-primary-gold text-black font-bold rounded-full hover:bg-dark-gold">Go to Login</button>
                </div>
            );
        }

        if (!isAdminAuthenticated) {
            return (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-3xl font-bold font-heading mb-4 text-red-500">Access Denied</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">You do not have permission to view this page.</p>
                    <button onClick={() => navigateTo('home')} className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-black transition-colors">Go Home</button>
                </div>
            );
        }

        return (
            <AdminLayout activePage={adminPage} onNavigate={navigateAdminTo} onLogout={handleLogout}>
                {renderAdminPage()}
            </AdminLayout>
        );
    };


    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage />;
            case 'products': return <ProductListPage />;
            case 'productDetail': return <ProductDetailPage />;
            case 'wishlist': return <WishlistPage />;
            case 'compare': return <ComparePage />;
            case 'contact': return <ContactPage />;
            case 'admin': return <AdminPortalPage />;
            case 'login': return <LoginPage onLogin={handleLogin} navigateTo={navigateTo} />;
            case 'signup': return <SignupPage onSignup={handleSignup} navigateTo={navigateTo} />;
            case 'myUploads': return <MyUploadsPage currentUser={currentUser} onAddUpload={handleAddUpload} onDeleteUpload={handleDeleteUpload} navigateTo={navigateTo} />;
            default: return <HomePage />;
        }
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    // Admin page is handled differently to use its own layout
    if (currentPage === 'admin') {
        return <AdminPortalPage />;
    }

    return (
        <div className={`min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-body transition-colors duration-500`}>
            <Header
                navigateTo={navigateTo}
                wishlistCount={wishlist.length}
                compareCount={compareList.length}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                onSearch={handleSearch}
                currentUser={currentUser}
                onLogout={handleLogout}
            />
            <main className="pb-20">
                {renderPage()}
            </main>
            <Footer navigateTo={navigateTo} />
            <CompareBar compareList={compareProducts} onNavigate={navigateTo} onClear={clearCompareList} onRemove={removeFromCompareList} />
        </div>
    );
};

export default App;
