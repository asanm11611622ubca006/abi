
import * as React from 'react';
import type { GoldRates } from '../types';

interface GoldRateTickerProps {
  rates: GoldRates;
  silverRate: number;
}

export const GoldRateTicker: React.FC<GoldRateTickerProps> = ({ rates, silverRate }) => {
  const isDataReady = rates['22K'] > 0 && rates['24K'] > 0 && silverRate > 0;

  return (
    <div className={`bg-gray-900 dark:bg-black text-white text-center py-3 transition-opacity duration-500 ${isDataReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <h3 className="font-bold text-lg text-primary-gold flex items-center">
            <ion-icon name="flash-outline" className="mr-2"></ion-icon>
            Live Rates
        </h3>
        {isDataReady ? (
          <>
            <div className="font-semibold font-number">
                <span className="text-gray-400 text-sm">24K (per gram): </span>
                <span className="text-xl font-bold">₹{rates['24K'].toLocaleString('en-IN')}</span>
            </div>
            <div className="font-semibold font-number">
                <span className="text-gray-400 text-sm">22K (per gram): </span>
                <span className="text-xl font-bold">₹{rates['22K'].toLocaleString('en-IN')}</span>
            </div>
            <div className="font-semibold font-number">
                <span className="text-gray-400 text-sm">Silver (per gram): </span>
                <span className="text-xl font-bold">₹{silverRate.toLocaleString('en-IN')}</span>
            </div>
          </>
        ) : (
          <div className="h-7 animate-pulse">Loading rates...</div>
        )}
      </div>
    </div>
  );
};