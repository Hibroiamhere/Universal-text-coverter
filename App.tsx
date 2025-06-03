
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CaseConverter } from './components/CaseConverter';
import { ImageCompressor } from './components/ImageCompressor';
import { PdfToTextConverter } from './components/PdfToTextConverter';
import { LoremIpsumGenerator } from './components/LoremIpsumGenerator';
import { ConverterType } from './types';
import { SelectIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedConverter, setSelectedConverter] = useState<ConverterType>(ConverterType.CaseConverter);

  const handleConverterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConverter(event.target.value as ConverterType);
  }, []);

  const renderConverter = () => {
    switch (selectedConverter) {
      case ConverterType.CaseConverter:
        return <CaseConverter />;
      case ConverterType.ImageCompressor:
        return <ImageCompressor />;
      case ConverterType.PdfToText:
        return <PdfToTextConverter />;
      case ConverterType.LoremIpsumGenerator:
        return <LoremIpsumGenerator />;
      default:
        return <p className="text-center text-neutral">Select a converter to get started.</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="mb-8">
            <label htmlFor="converter-select" className="block text-sm font-medium text-neutral mb-1">
              Choose a Tool
            </label>
            <div className="relative">
              <select
                id="converter-select"
                value={selectedConverter}
                onChange={handleConverterChange}
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md appearance-none shadow-sm"
              >
                <option value={ConverterType.CaseConverter}>Text Case Converter</option>
                <option value={ConverterType.ImageCompressor}>Image Compressor</option>
                <option value={ConverterType.PdfToText}>PDF to Text Extractor</option>
                <option value={ConverterType.LoremIpsumGenerator}>Lorem Ipsum Generator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <SelectIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
          {renderConverter()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
