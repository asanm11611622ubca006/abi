
import * as React from 'react';
import type { Page, User } from '../types';

interface HeaderProps {
    navigateTo: (page: Page) => void;
    wishlistCount: number;
    compareCount: number;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    onSearch: (query: string) => void;
    currentUser: User | null;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ navigateTo, wishlistCount, compareCount, isDarkMode, toggleDarkMode, onSearch, currentUser, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinks = (
        <>
            <a onClick={() => navigateTo('home')} className="cursor-pointer hover:text-primary-gold transition-colors duration-300">Home</a>
            <a onClick={() => navigateTo('products')} className="cursor-pointer hover:text-primary-gold transition-colors duration-300">All Jewels</a>
            <a onClick={() => navigateTo('contact')} className="cursor-pointer hover:text-primary-gold transition-colors duration-300">Contact Us</a>
            <a onClick={() => navigateTo('admin')} className="cursor-pointer hover:text-primary-gold transition-colors duration-300">Admin</a>
        </>
    );

    return (
        <header className="bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50 shadow-md text-light-text dark:text-dark-text font-body">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a onClick={() => navigateTo('home')} className="cursor-pointer text-2xl font-heading font-bold text-dark-gold dark:text-primary-gold">
                            Abirami Jewellery
                        </a>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks}
                    </nav>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-32 lg:w-48 bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:border-primary-gold dark:focus:border-primary-gold focus:outline-none transition-all duration-300 py-1"
                            />
                        </div>

                        <button onClick={() => navigateTo('wishlist')} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            {/* @ts-ignore */}
                            <ion-icon name="heart-outline" className="text-2xl"></ion-icon>
                            {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{wishlistCount}</span>}
                        </button>

                        <button onClick={() => navigateTo('compare')} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            {/* @ts-ignore */}
                            <ion-icon name="git-compare-outline" className="text-2xl"></ion-icon>
                            {compareCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{compareCount}</span>}
                        </button>

                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            {/* @ts-ignore */}
                            <ion-icon name={isDarkMode ? 'sunny-outline' : 'moon-outline'} className="text-2xl"></ion-icon>
                        </button>

                        {currentUser ? (
                            <div className="relative group hidden md:block">
                                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    {/* @ts-ignore */}
                                    <ion-icon name="person-circle-outline" className="text-2xl"></ion-icon>
                                    <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    <a onClick={() => navigateTo('myUploads')} className="block px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer w-full text-left">My Uploads</a>
                                    <a onClick={onLogout} className="block px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer w-full text-left">Logout</a>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <a onClick={() => navigateTo('login')} className="cursor-pointer px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Login</a>
                                <a onClick={() => navigateTo('signup')} className="cursor-pointer px-4 py-2 rounded-md bg-primary-gold text-black font-bold hover:bg-dark-gold transition-colors">Sign Up</a>
                            </div>
                        )}

                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                {/* @ts-ignore */}
                                <ion-icon name={isMenuOpen ? 'close-outline' : 'menu-outline'} className="text-2xl"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden pt-2 pb-4 space-y-2 flex flex-col items-center border-t border-gray-200 dark:border-gray-700">
                        {navLinks}
                        <div className="relative mt-2 w-full px-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full bg-transparent border-b-2 border-gray-400 dark:border-gray-600 focus:border-primary-gold dark:focus:border-primary-gold focus:outline-none transition-all duration-300 py-1"
                            />
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 w-full flex flex-col items-center space-y-2 mt-2">
                            {currentUser ? (
                                <>
                                    <p className="font-semibold">Welcome, {currentUser.name}</p>
                                    <a onClick={() => { navigateTo('myUploads'); setIsMenuOpen(false); }} className="cursor-pointer hover:text-primary-gold transition-colors duration-300 w-full text-center">My Uploads</a>
                                    <a onClick={() => { onLogout(); setIsMenuOpen(false); }} className="cursor-pointer px-4 py-2 rounded-md bg-red-500 text-white w-full text-center">Logout</a>
                                </>
                            ) : (
                                <>
                                    <a onClick={() => navigateTo('login')} className="cursor-pointer px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-center">Login</a>
                                    <a onClick={() => navigateTo('signup')} className="cursor-pointer px-4 py-2 rounded-md bg-primary-gold text-black font-bold w-full text-center">Sign Up</a>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
