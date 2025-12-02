
import * as React from 'react';

export const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg flex flex-col items-center justify-center z-[100]">
            <div className="relative">
                <div className="w-32 h-32 border-2 border-primary-gold rounded-full animate-ping absolute opacity-50"></div>
                <div className="w-32 h-32 flex items-center justify-center bg-light-bg dark:bg-dark-bg rounded-full shadow-2xl">
                    <h1 className="text-4xl font-heading font-bold text-dark-gold dark:text-primary-gold">AJ</h1>
                </div>
            </div>
            <p className="mt-8 text-lg text-light-text dark:text-dark-text font-body animate-pulse">Crafting Timeless Elegance...</p>
        </div>
    );
};