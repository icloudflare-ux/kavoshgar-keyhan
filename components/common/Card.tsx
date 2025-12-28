
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div 
        className={`backdrop-blur-md rounded-2xl shadow-cosmic p-5 md:p-8 overflow-hidden transition-all duration-300 hover:shadow-cosmic-hover ${className}`}
        style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            transition: 'var(--transition-colors), box-shadow 0.3s, border-color 0.3s',
        }}
    >
      {children}
    </div>
  );
};

export default Card;
