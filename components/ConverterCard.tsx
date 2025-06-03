
import React from 'react';

interface ConverterCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({ title, description, children, icon }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-primary">{icon}</div>}
        <div>
          <h2 className="text-xl font-semibold text-neutral">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
    