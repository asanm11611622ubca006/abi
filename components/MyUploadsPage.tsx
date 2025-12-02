
import * as React from 'react';
import type { User, Page } from '../types';

interface MyUploadsPageProps {
    currentUser: User | null;
    onAddUpload: (imageData: string) => void;
    onDeleteUpload: (index: number) => void;
    navigateTo: (page: Page) => void;
}

export const MyUploadsPage: React.FC<MyUploadsPageProps> = ({ currentUser, onAddUpload, onDeleteUpload, navigateTo }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG, etc.).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File is too large. Please upload an image under 5MB.');
            return;
        }

        setError('');
        setIsUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            onAddUpload(reader.result as string);
            setIsUploading(false);
        };
        reader.onerror = () => {
            setError('Something went wrong while uploading the image.');
            setIsUploading(false);
        };
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold font-heading mb-4 text-light-text dark:text-dark-text">My Uploads</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Please log in to manage your personal gallery.</p>
                <button onClick={() => navigateTo('login')} className="px-8 py-3 bg-primary-gold text-black font-bold rounded-full hover:bg-dark-gold transition-all duration-300 transform hover:scale-105">
                    Go to Login
                </button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-4xl font-bold font-heading mb-8 text-center text-light-text dark:text-dark-text">My Personal Gallery</h1>
            
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-900/50 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 mb-12">
                <h2 className="text-xl font-bold font-heading mb-4">Upload a New Photo</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your photos are saved locally in your browser and are only visible to you. Max file size: 5MB.</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-gold/20 file:text-dark-gold dark:file:text-primary-gold hover:file:bg-primary-gold/30 cursor-pointer"
                />
                {isUploading && <p className="text-sm text-blue-500 mt-2 animate-pulse">Uploading...</p>}
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(currentUser.uploads || []).map((imageData, index) => (
                    <div key={index} className="group relative bg-white dark:bg-gray-900/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 dark:border-gray-800">
                        <img 
                            src={imageData} 
                            alt={`Uploaded by ${currentUser.name} - ${index}`} 
                            className="w-full h-64 object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                             <button 
                                onClick={() => onDeleteUpload(index)} 
                                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100"
                                aria-label="Delete image"
                             >
                                {/* FIX: Replaced 'class' with 'className' to conform to JSX standards. */}
                                <ion-icon name="trash-outline" className="text-2xl"></ion-icon>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(currentUser.uploads || []).length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    {/* FIX: Replaced 'class' with 'className' to conform to JSX standards. */}
                    <ion-icon name="images-outline" className="text-6xl text-gray-400 dark:text-gray-600 mx-auto"></ion-icon>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Your gallery is empty.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Upload your first photo to see it here!</p>
                </div>
            )}
        </div>
    );
};
