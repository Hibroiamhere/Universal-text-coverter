
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral text-base-100 py-6 text-center">
      <p>&copy; {new Date().getFullYear()} Universal Converter. All conversions are done client-side.</p>
    </footer>
  );
};
    