
import * as React from 'react';
import { GoldRates, ShowcaseCategory } from '../../types';

interface SettingsProps {
    goldRates: GoldRates;
    onGoldRatesChange: (rates: GoldRates) => void;
    silverRate: number;
    onSilverRateChange: (rate: number) => void;
    heroImage: string;
    onHeroImageChange: (image: string) => void;
    categories: string[];
    onCategoriesChange: (categories: string[]) => void;
    purities: string[];
    onPuritiesChange: (purities: string[]) => void;
    showcaseCategories: ShowcaseCategory[];
    onShowcaseCategoriesChange: (categories: ShowcaseCategory[]) => void;
}

const ManageList: React.FC<{ title: string, items: string[], setItems: (items: string[]) => void }> = ({ title, items, setItems }) => {
    const [newItem, setNewItem] = React.useState('');

    const handleAdd = () => {
        if (newItem && !items.includes(newItem)) {
            setItems([...items, newItem]);
            setNewItem('');
        }
    };

    const handleRemove = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove));
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <ul className="space-y-2 mb-4">
                {items.map(item => (
                    <li key={item} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                        <span>{item}</span>
                        <button onClick={() => handleRemove(item)} className="text-red-500 hover:text-red-700">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newItem} 
                    onChange={(e) => setNewItem(e.target.value)} 
                    placeholder={`New ${title.slice(7, -1)}`} 
                    className="flex-grow p-2 border rounded-md bg-transparent dark:border-gray-600"
                />
                <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Add</button>
            </div>
        </div>
    );
}


export const Settings: React.FC<SettingsProps> = ({ goldRates, onGoldRatesChange, silverRate, onSilverRateChange, heroImage, onHeroImageChange, categories, onCategoriesChange, purities, onPuritiesChange, showcaseCategories, onShowcaseCategoriesChange }) => {
    const [storeInfo, setStoreInfo] = React.useState({
        name: 'Abirami Jewellery',
        address: '4F Padmanaban Street, Kumbakonam - 612002',
        phone: '+91 9003206991',
        email: 'abiramijewellery.mks@gmail.com'
    });
    const [rates, setRates] = React.useState<GoldRates>(goldRates);
    const [currentSilverRate, setCurrentSilverRate] = React.useState(silverRate);
    const [currentHeroImage, setCurrentHeroImage] = React.useState(heroImage);
    const [currentCategories, setCurrentCategories] = React.useState([...categories]);
    const [currentPurities, setCurrentPurities] = React.useState([...purities]);
    const [currentShowcaseCategories, setCurrentShowcaseCategories] = React.useState<ShowcaseCategory[]>(showcaseCategories);


    React.useEffect(() => { setRates(goldRates); }, [goldRates]);
    React.useEffect(() => { setCurrentSilverRate(silverRate); }, [silverRate]);
    React.useEffect(() => { setCurrentHeroImage(heroImage); }, [heroImage]);
    React.useEffect(() => { setCurrentCategories(categories); }, [categories]);
    React.useEffect(() => { setCurrentPurities(purities); }, [purities]);
    React.useEffect(() => { setCurrentShowcaseCategories(showcaseCategories); }, [showcaseCategories]);


    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRates(prev => ({...prev, [name]: Number(value) }));
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (image: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                callback(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleShowcaseImageChange = (index: number, newImage: string) => {
        const updatedCategories = [...currentShowcaseCategories];
        updatedCategories[index] = { ...updatedCategories[index], image: newImage };
        setCurrentShowcaseCategories(updatedCategories);
    };

    const handleSave = () => {
        onGoldRatesChange(rates);
        onSilverRateChange(currentSilverRate);
        onHeroImageChange(currentHeroImage);
        onCategoriesChange(currentCategories);
        onPuritiesChange(currentPurities);
        onShowcaseCategoriesChange(currentShowcaseCategories);
        alert('Settings saved!');
    };
    
    return (
        <div className="bg-white dark:bg-dark-bg p-8 rounded-lg shadow-md max-w-2xl mx-auto space-y-12">
            {/* Store Info */}
            <div>
                <h2 className="text-xl font-bold mb-6">Store Information</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                        <input type="text" name="name" value={storeInfo.name} onChange={handleInfoChange} className="mt-1 block w-full p-3 border rounded-md bg-transparent dark:border-gray-600" />
                    </div>
                </div>
            </div>

             {/* Homepage Customization */}
            <div>
                 <h2 className="text-xl font-bold mb-6">Homepage Customization</h2>
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Homepage Hero Image</label>
                        <img src={currentHeroImage} alt="Homepage Hero" className="w-full h-48 object-cover rounded-md mb-2 border dark:border-gray-700" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCurrentHeroImage)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-gold/20 file:text-dark-gold dark:file:text-primary-gold hover:file:bg-primary-gold/30"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Homepage Category Images</h3>
                        <div className="space-y-4">
                            {currentShowcaseCategories.map((cat, index) => (
                                <div key={cat.name}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{cat.name} Category Image</label>
                                    <div className="flex items-center gap-4">
                                        <img src={cat.image} alt={cat.name} className="w-24 h-24 object-cover rounded-full border-2 border-primary-gold" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageUpload(e, (newImg) => handleShowcaseImageChange(index, newImg))}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-gold/20 file:text-dark-gold dark:file:text-primary-gold hover:file:bg-primary-gold/30"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>

            {/* Live Rate Settings */}
            <div>
                 <h2 className="text-xl font-bold mb-6">Live Rate Settings</h2>
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">24K Gold Rate (per gram)</label>
                        <input type="number" name="24K" value={rates['24K']} onChange={handleRateChange} className="mt-1 block w-full p-3 border rounded-md bg-transparent dark:border-gray-600 font-number" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">22K Gold Rate (per gram)</label>
                        <input type="number" name="22K" value={rates['22K']} onChange={handleRateChange} className="mt-1 block w-full p-3 border rounded-md bg-transparent dark:border-gray-600 font-number" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Silver Rate (per gram)</label>
                        <input type="number" name="silverRate" value={currentSilverRate} onChange={(e) => setCurrentSilverRate(Number(e.target.value))} className="mt-1 block w-full p-3 border rounded-md bg-transparent dark:border-gray-600 font-number" />
                    </div>
                 </div>
            </div>

            {/* Filter Management */}
            <div>
                 <h2 className="text-xl font-bold mb-6">Filter Management</h2>
                 <div className="space-y-8">
                    <ManageList title="Manage Categories" items={currentCategories} setItems={setCurrentCategories} />
                    <ManageList title="Manage Purities" items={currentPurities} setItems={setCurrentPurities} />
                 </div>
            </div>


            <div className="flex justify-end mt-8 border-t dark:border-gray-700 pt-6">
                <button onClick={handleSave} className="px-8 py-3 bg-primary-gold text-black rounded-md font-bold text-lg hover:bg-dark-gold transition-colors">Save All Changes</button>
            </div>
        </div>
    );
};