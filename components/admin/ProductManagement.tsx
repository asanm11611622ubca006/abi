import * as React from 'react';
// FIX: Imported Category and Purity types to resolve type mismatch in initial form state.
import type { Product, GoldRates, Category, Purity, User } from '../../types';


// --- SECURE CONFIRMATION MODAL ---
interface ArchiveConfirmationModalProps {
    isOpen: boolean;
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
    // In a real app, you wouldn't pass the password like this, but for this simulation it's required.
    userPasswordForVerification: string;
}

const CONFIRMATION_TEXT = 'ARCHIVE';

const ArchiveConfirmationModal: React.FC<ArchiveConfirmationModalProps> = ({
    isOpen,
    productName,
    onClose,
    onConfirm,
    userPasswordForVerification
}) => {
    const [confirmationInput, setConfirmationInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            setConfirmationInput('');
            setPasswordInput('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirmClick = () => {
        if (confirmationInput.trim() !== CONFIRMATION_TEXT) {
            setError(`Please type "${CONFIRMATION_TEXT}" to confirm.`);
            return;
        }
        if (passwordInput !== userPasswordForVerification) {
            setError('Incorrect password. Please try again.');
            return;
        }
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[101] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 font-heading text-red-600">Archive Product</h2>
                <p className="mb-4">
                    You are about to archive the product: <strong className="font-bold">{productName}</strong>.
                    This will hide it from the public store but will not permanently delete it.
                </p>
                <p className="mb-6">
                    To confirm this action, please type "<strong className="font-mono">{CONFIRMATION_TEXT}</strong>" in the box below and enter your password.
                </p>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Confirmation Text</label>
                        <input
                            type="text"
                            value={confirmationInput}
                            onChange={(e) => setConfirmationInput(e.target.value)}
                            className="p-3 border rounded bg-transparent dark:border-gray-600 w-full"
                            placeholder={CONFIRMATION_TEXT}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Your Password</label>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="p-3 border rounded bg-transparent dark:border-gray-600 w-full"
                            aria-label="Your Password"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-md font-semibold">Cancel</button>
                    <button onClick={handleConfirmClick} className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700">Confirm Archive</button>
                </div>
            </div>
        </div>
    );
};


// Product Form Component
const ProductForm = ({ product, onSave, onCancel, goldRates, calculatePrice, categories, purities }: { product: Product | null, onSave: (product: Product) => void, onCancel: () => void, goldRates: GoldRates, calculatePrice: (product: Product, rates: GoldRates) => number, categories: string[], purities: string[] }) => {

    const initialFormData = React.useMemo(() => {
        return product || {
            id: '',
            name: '',
            category: (categories[0] || 'Gold') as Category,
            description: '',
            images: [],
            price: 0,
            purity: (purities[0] || '22K') as Purity,
            stock: 0,
            sku: '',
            video: undefined,
            makingCharges: 15,
            deletedAt: null
        };
    }, [product, categories, purities]);

    const [formData, setFormData] = React.useState<Product>(initialFormData);
    const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
    const dragItem = React.useRef<number | null>(null);
    const dragOverItem = React.useRef<number | null>(null);

    const generateVideoPreview = (videoSrc: string): Promise<string | null> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = videoSrc;
            video.crossOrigin = "anonymous";
            video.onloadeddata = () => {
                video.currentTime = 1; // Seek to 1s to get a representative frame
            };
            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg'));
                } else {
                    resolve(null);
                }
            };
            video.onerror = () => {
                resolve(null);
            };
        });
    };

    // Effect to reset form state when the product prop changes
    React.useEffect(() => {
        setFormData(initialFormData);
        if (initialFormData.video) {
            generateVideoPreview(initialFormData.video).then(setVideoPreview);
        } else {
            setVideoPreview(null);
        }
    }, [initialFormData]);

    // Effect to auto-calculate price for gold items
    React.useEffect(() => {
        if (formData.category === 'Gold') {
            const newPrice = calculatePrice(formData, goldRates);
            // Only update if calculation is valid to avoid resetting manual price to 0
            if (newPrice > 0) {
                setFormData(prev => ({ ...prev, price: Math.round(newPrice) }));
            }
        }
    }, [formData.category, formData.weight, formData.purity, formData.makingCharges, goldRates, calculatePrice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['price', 'weight', 'stock', 'makingCharges'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const base64Promises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            });
            try {
                const newImages = await Promise.all(base64Promises);
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
            } catch (error) {
                console.error("Error reading files:", error);
                alert("There was an error uploading images.");
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                // FIX: Ensure result is a string before proceeding to avoid potential type errors.
                const videoDataUrl = event.target?.result;
                if (typeof videoDataUrl === 'string') {
                    setFormData(prev => ({ ...prev, video: videoDataUrl }));
                    const previewUrl = await generateVideoPreview(videoDataUrl);
                    setVideoPreview(previewUrl);
                }
            };
            reader.onerror = error => {
                console.error("Error reading video file:", error);
                alert("There was an error uploading the video.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        let _images = [...formData.images];
        const draggedItemContent = _images.splice(dragItem.current, 1)[0];
        _images.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setFormData(prev => ({ ...prev, images: _images }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            alert("Please upload at least one image.");
            return;
        }
        onSave(formData);
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 font-heading">{product ? 'Edit' : 'Add'} Product</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Antique Gold Necklace" className="p-3 border rounded bg-transparent dark:border-gray-600 w-full" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">SKU</label>
                        <input name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="e.g., AJ-G-N-001" className="p-3 border rounded bg-transparent dark:border-gray-600 w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="p-3 border rounded bg-white dark:bg-dark-bg dark:border-gray-600 w-full" aria-label="Category">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Stock Quantity</label>
                        <input name="stock" type="number" value={formData.stock || 0} onChange={handleChange} placeholder="e.g., 10" className="p-3 border rounded bg-transparent dark:border-gray-600 w-full" />
                    </div>

                    {formData.category === 'Gold' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Making Charges (%)</label>
                                <input name="makingCharges" type="number" step="0.1" value={formData.makingCharges || ''} onChange={handleChange} placeholder="e.g., 15" className="p-3 border rounded w-full bg-transparent dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Weight (g)</label>
                                <input name="weight" type="number" step="0.01" value={formData.weight || ''} onChange={handleChange} placeholder="e.g., 25.5" className="p-3 border rounded bg-transparent dark:border-gray-600 w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Purity</label>
                                <select name="purity" value={formData.purity} onChange={handleChange} className="p-3 border rounded bg-white dark:bg-dark-bg dark:border-gray-600 w-full" aria-label="Purity">
                                    {purities.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    <div className={formData.category === 'Gold' ? 'md:col-span-2' : ''}>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            {formData.category === 'Gold' ? 'Final Price (₹)' : 'Price (₹)'}
                        </label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder={formData.category === 'Gold' ? 'Auto-calculated or override' : 'e.g., 2500'}
                            className="p-3 border rounded w-full bg-transparent dark:border-gray-600 font-number"
                            required
                        />
                        {formData.category === 'Gold' && (
                            <p className="text-xs text-gray-500 mt-1">This price is auto-calculated. You can manually override it.</p>
                        )}
                    </div>


                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Product Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-gold/20 file:text-dark-gold dark:file:text-primary-gold hover:file:bg-primary-gold/30" aria-label="Upload Product Images" />
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {formData.images.map((img, index) => (
                                <div
                                    key={img}
                                    className="relative group cursor-grab active:cursor-grabbing"
                                    draggable
                                    onDragStart={() => (dragItem.current = index)}
                                    onDragEnter={() => (dragOverItem.current = index)}
                                    onDragEnd={handleDragSort}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className="absolute top-0 left-0 p-1 bg-black/50 text-white text-xs font-bold rounded-br-md z-10 pointer-events-none group-active:hidden">{index + 1}</div>
                                    <img src={img} alt={`preview ${index}`} className="w-20 h-20 object-cover rounded-md border dark:border-gray-700 pointer-events-none" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* @ts-ignore */}
                                        <ion-icon name="close-outline"></ion-icon>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Product Video (optional)</label>
                        {!formData.video && (
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-gold/20 file:text-dark-gold dark:file:text-primary-gold hover:file:bg-primary-gold/30"
                                aria-label="Upload Product Video"
                            />
                        )}
                        {formData.video && (
                            <div className="mt-2 relative">
                                {videoPreview ? (
                                    <img src={videoPreview} alt="Video preview" className="w-full max-w-xs h-auto rounded-md border dark:border-gray-700" />
                                ) : (
                                    <div className="w-full max-w-xs h-40 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                        <p className="text-gray-500">Generating preview...</p>
                                    </div>
                                )}
                                <button type="button" onClick={() => { setFormData(prev => ({ ...prev, video: undefined })); setVideoPreview(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10">
                                    {/* @ts-ignore */}
                                    <ion-icon name="close-outline"></ion-icon>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-3 border rounded bg-transparent w-full h-24 dark:border-gray-600" required />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-md font-semibold">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary-gold text-black rounded-md font-semibold">Save Product</button>
                </div>
            </form>
        </div>
    )
};


// Main Product Management Component
interface ProductManagementProps {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void; // This is now softDelete
    restoreProduct: (productId: string) => void;
    permanentlyDeleteProduct: (productId: string) => void;
    goldRates: GoldRates;
    calculatePrice: (product: Product, rates: GoldRates) => number;
    categories: string[];
    purities: string[];
    currentUser: User | null;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ products, addProduct, updateProduct, deleteProduct, restoreProduct, permanentlyDeleteProduct, goldRates, calculatePrice, categories, purities, currentUser }) => {
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [showArchived, setShowArchived] = React.useState(false);
    const [productToArchive, setProductToArchive] = React.useState<Product | null>(null);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleSave = (product: Product) => {
        if (editingProduct) {
            updateProduct(product);
        } else {
            addProduct({ ...product, id: `prod_${Date.now()}` });
        }
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleArchiveClick = (product: Product) => {
        setProductToArchive(product);
        setIsArchiveModalOpen(true);
    };

    const handleConfirmArchive = () => {
        if (productToArchive) {
            deleteProduct(productToArchive.id); // Prop is soft-delete
        }
        setIsArchiveModalOpen(false);
        setProductToArchive(null);
    };

    const exportToJson = (data: Product[]) => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'products.json';
        link.click();
    };

    const exportToCsv = (data: Product[]) => {
        if (data.length === 0) return;
        const replacer = (key: any, value: any) => value === null ? '' : value; // Handle null values
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify((row as any)[fieldName], replacer)).join(','));
        csv.unshift(header.join(','));
        const csvString = csv.join('\r\n');

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold">Manage Products</h2>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => exportToJson(products)} className="px-3 py-2 text-sm bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2">
                        {/* @ts-ignore */}
                        <ion-icon name="code-download-outline"></ion-icon>
                        <span className="hidden sm:inline">Export JSON</span>
                    </button>
                    <button onClick={() => exportToCsv(products)} className="px-3 py-2 text-sm bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors flex items-center gap-2">
                        {/* @ts-ignore */}
                        <ion-icon name="grid-outline"></ion-icon>
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button onClick={handleAddNew} className="px-4 py-2 bg-royal-gold text-black font-bold rounded-md hover:bg-dark-gold transition-colors flex items-center gap-2">
                        {/* @ts-ignore */}
                        <ion-icon name="add-outline"></ion-icon>
                        Add New
                    </button>
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <div className="flex items-center">
                    <input type="checkbox" id="show-archived" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} className="h-4 w-4 rounded text-primary-gold focus:ring-primary-gold" />
                    <label htmlFor="show-archived" className="ml-2 text-sm font-medium">Show Archived</label>
                </div>
            </div>

            {isFormOpen && <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setIsFormOpen(false)} goldRates={goldRates} calculatePrice={calculatePrice} categories={categories} purities={purities} />}
            {isArchiveModalOpen && productToArchive && currentUser && (
                <ArchiveConfirmationModal
                    isOpen={isArchiveModalOpen}
                    productName={productToArchive.name}
                    onClose={() => setIsArchiveModalOpen(false)}
                    onConfirm={handleConfirmArchive}
                    userPasswordForVerification={currentUser.password}
                />
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Image</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Name</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Category</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Price (₹)</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Stock</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products
                            .filter(p => showArchived ? true : !p.deletedAt)
                            .map(p => (
                                <tr key={p.id} className={`border-b dark:border-gray-700 transition-colors ${p.deletedAt ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60' : ''}`}>
                                    <td className="p-2"><img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-md" /></td>
                                    <td className="p-4 font-semibold">{p.name}</td>
                                    <td className="p-4">{p.category}</td>
                                    <td className="p-4 font-number">{calculatePrice(p, goldRates).toLocaleString('en-IN')}</td>
                                    <td className="p-4 font-number"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.stock && p.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.stock || 0}</span></td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.deletedAt ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>{p.deletedAt ? 'Archived' : 'Active'}</span></td>
                                    <td className="p-4 flex gap-1">
                                        {p.deletedAt ? (
                                            <>
                                                <button onClick={() => restoreProduct(p.id)} title="Restore" className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    {/* @ts-ignore */}
                                                    <ion-icon name="refresh-outline"></ion-icon>
                                                </button>
                                                <button onClick={() => permanentlyDeleteProduct(p.id)} title="Delete Permanently" className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    {/* @ts-ignore */}
                                                    <ion-icon name="trash-bin-outline"></ion-icon>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(p)} title="Edit" className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    {/* @ts-ignore */}
                                                    <ion-icon name="create-outline"></ion-icon>
                                                </button>
                                                <button onClick={() => handleArchiveClick(p)} title="Archive" className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                    {/* @ts-ignore */}
                                                    <ion-icon name="trash-outline"></ion-icon>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
