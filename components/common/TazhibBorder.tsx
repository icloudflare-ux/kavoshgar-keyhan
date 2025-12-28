
import React from 'react';

interface TazhibBorderProps {
  children: React.ReactNode;
}

const TazhibBorder: React.FC<TazhibBorderProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tazhibGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
           <linearGradient id="tazhibBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        
        {/* Main Border Frame */}
        <rect width="100%" height="100%" fill="none" stroke="url(#tazhibGold)" strokeWidth="3" rx="8" ry="8" />
        <rect x="5" y="5" width="calc(100% - 10px)" height="calc(100% - 10px)" fill="none" stroke="url(#tazhibBlue)" strokeWidth="1.5" rx="6" ry="6" />

        {/* Corner Ornaments */}
        {[[0, 0, 0], [1, 0, 90], [1, 1, 180], [0, 1, 270]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x === 0 ? 15 : 'calc(100% - 15px)'}, ${y === 0 ? 15 : 'calc(100% - 15px)'}) rotate(${r}) translate(-15, -15)`}>
             <path d="M 15,0 A 15,15 0 0,0 0,15 L 5,15 A 10,10 0 0,1 15,5 Z" fill="url(#tazhibGold)" />
             <path d="M 15,0 L 15,3 A 12,12 0 0,1 3,15 L 0,15 A 15,15 0 0,0 15,0 Z" fill="url(#tazhibBlue)" opacity="0.7"/>
          </g>
        ))}
      </svg>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default TazhibBorder;
