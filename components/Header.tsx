
import React from 'react';
import { ToolsIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2">
          <ToolsIcon className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Universal Converter</h1>
        </div>
      </div>
    </header>
  );
};
    