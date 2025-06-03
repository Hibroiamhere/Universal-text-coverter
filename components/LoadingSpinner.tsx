
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-primary ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-2 text-sm text-neutral">{text}</p>}
    </div>
  );
};
    