import React from 'react';

export const EmptyWallet: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-700 mb-6 drop-shadow-sm">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      <path d="M14 4h-2" className="animate-pulse" />
      <path d="M8 4h-2" className="animate-pulse" />
    </svg>
    <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
    <p className="text-gray-500 mb-6 max-w-sm">Your wallet is looking a bit empty. Add an expense or income to get started!</p>
  </div>
);

export const EmptySearch: React.FC<{ query: string }> = ({ query }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-700 mb-4">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M9 9l4 4" className="text-gray-200 dark:text-gray-800" />
      <path d="M13 9l-4 4" className="text-gray-200 dark:text-gray-800" />
    </svg>
    <h3 className="text-lg font-bold mb-1">No results found</h3>
    <p className="text-gray-500 text-sm">We couldn't find anything matching "{query}"</p>
  </div>
);
