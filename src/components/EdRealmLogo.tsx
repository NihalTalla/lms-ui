import React from 'react';

export function EdRealmLogo({ className = '', size = 'normal' }: { className?: string, size?: 'small' | 'normal' | 'large' }) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`bg-black text-white flex items-center justify-center font-black ${isSmall ? 'rounded-md px-2 py-1 text-sm' : isLarge ? 'rounded-2xl px-5 py-3 text-4xl' : 'rounded-xl px-3 py-1.5 text-xl'}`}
        style={{ fontFamily: 'sans-serif', letterSpacing: '0.05em' }}
      >
        ED
      </div>
      <div 
        className={`text-black font-black ${isSmall ? 'text-lg' : isLarge ? 'text-5xl' : 'text-2xl'}`}
        style={{ fontFamily: 'sans-serif', letterSpacing: '0.1em' }}
      >
        REALM
      </div>
    </div>
  );
}
