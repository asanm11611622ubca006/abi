
import * as React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  price: number;
  onViewDetails: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isInWishlist: boolean;
  isInCompare: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, price, onViewDetails, onToggleWishlist, onToggleCompare, isInWishlist, isInCompare }) => {
  return (
    <div className="group bg-white dark:bg-gray-900/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
            className={`p-2 rounded-full transition-colors duration-300 ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
            aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {/* @ts-ignore */}
            <ion-icon name={isInWishlist ? "heart" : "heart-outline"}></ion-icon>
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow text-light-text dark:text-dark-text">
        <h3 className="text-lg font-heading font-bold truncate group-hover:text-primary-gold transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{product.category} Jewellery</p>
        <div className="mt-auto pt-4">
          <p className="text-2xl font-extrabold text-dark-gold dark:text-primary-gold font-number">
            ₹{price.toLocaleString('en-IN')}
          </p>
          <button
            onClick={() => onViewDetails(product)}
            className="w-full mt-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-black py-2 rounded-md font-bold hover:bg-primary-gold dark:hover:bg-primary-gold dark:hover:text-white transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};