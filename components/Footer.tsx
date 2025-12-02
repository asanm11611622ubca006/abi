
import * as React from 'react';
import type { Page } from '../types';

interface FooterProps {
    navigateTo: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
    return (
        <footer className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border-t border-gray-200 dark:border-gray-800 mt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-heading font-bold text-dark-gold dark:text-primary-gold mb-4">Abirami Jewellery</h2>
                        <p className="max-w-md">
                            Crafting timeless elegance since 1985. Discover exquisite collections of gold, silver, and diamond jewellery in the heart of Kumbakonam.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            {/* FIX: Changed class to className */}
                            <a href="#" className="hover:text-primary-gold transition-colors"><ion-icon name="logo-instagram" className="text-2xl"></ion-icon></a>
                            {/* FIX: Changed class to className */}
                            <a href="#" className="hover:text-primary-gold transition-colors"><ion-icon name="logo-facebook" className="text-2xl"></ion-icon></a>
                            {/* FIX: Changed class to className */}
                            <a href="https://wa.me/919003206991" target="_blank" rel="noopener noreferrer" className="hover:text-primary-gold transition-colors"><ion-icon name="logo-whatsapp" className="text-2xl"></ion-icon></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 tracking-wider">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a onClick={() => navigateTo('home')} className="cursor-pointer hover:text-primary-gold transition-colors">Home</a></li>
                            <li><a onClick={() => navigateTo('products')} className="cursor-pointer hover:text-primary-gold transition-colors">Collections</a></li>
                            <li><a onClick={() => navigateTo('contact')} className="cursor-pointer hover:text-primary-gold transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 tracking-wider">Contact Us</h3>
                        <ul className="space-y-2">
                            {/* FIX: Changed class to className */}
                            <li className="flex items-center"><ion-icon name="location-outline" className="mr-2"></ion-icon> 4F Padmanaban Street, Kumbakonam - 612002</li>
                            {/* FIX: Changed class to className */}
                            <li className="flex items-center"><ion-icon name="call-outline" className="mr-2"></ion-icon> +91 9003206991</li>
                            {/* FIX: Changed class to className */}
                            <li className="flex items-center"><ion-icon name="mail-outline" className="mr-2"></ion-icon> abiramijewellery.mks@gmail.com</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-12 border-t border-gray-200 dark:border-gray-800 pt-6">
                    <p>&copy; {new Date().getFullYear()} Abirami Jewellery. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};