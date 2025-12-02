
import * as React from 'react';
import type { Page } from '../types';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    navigateTo: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigateTo }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await onLogin(email, password);
        if (!success) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg animate-fade-in">
                    <h2 className="text-3xl font-bold text-center font-heading mb-6 text-light-text dark:text-dark-text">Login</h2>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-3 border rounded-md bg-transparent dark:border-gray-600 focus:ring-primary-gold focus:border-primary-gold" 
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 border rounded-md bg-transparent dark:border-gray-600 focus:ring-primary-gold focus:border-primary-gold" 
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary-gold text-black font-bold py-3 rounded-md hover:bg-dark-gold transition-colors text-lg">
                        Login
                    </button>
                    <p className="text-center mt-6 text-sm">
                        Don't have an account?{' '}
                        <a onClick={() => navigateTo('signup')} className="font-semibold text-primary-gold hover:underline cursor-pointer">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};