
import React, { useState, useCallback } from 'react';
import { CaseType } from '../types';
import { ConverterCard } from './ConverterCard';
import { transformText } from '../utils/textUtils';
import { TextIcon, CopyIcon, CheckIcon } from './Icons';

export const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<CaseType>(CaseType.Lowercase);
  const [copied, setCopied] = useState<boolean>(false);

  const handleConvert = useCallback(() => {
    setOutputText(transformText(inputText, selectedCase));
  }, [inputText, selectedCase]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again.');
    }
  }, [outputText]);

  return (
    <ConverterCard 
        title="Text Case Converter" 
        description="Easily convert text between uppercase, lowercase, title case, and sentence case."
        icon={<TextIcon className="h-8 w-8" />}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input-text" className="block text-sm font-medium text-neutral">Input Text</label>
          <textarea
            id="input-text"
            rows={5}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
          />
        </div>

        <div>
          <label htmlFor="case-type" className="block text-sm font-medium text-neutral">Select Case Type</label>
          <select
            id="case-type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm"
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value as CaseType)}
          >
            <option value={CaseType.Uppercase}>UPPERCASE</option>
            <option value={CaseType.Lowercase}>lowercase</option>
            <option value={CaseType.TitleCase}>Title Case</option>
            <option value={CaseType.SentenceCase}>Sentence case</option>
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={!inputText}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300"
        >
          Convert Text
        </button>

        {outputText && (
          <div>
            <label htmlFor="output-text" className="block text-sm font-medium text-neutral">Output Text</label>
            <div className="relative">
                <textarea
                id="output-text"
                rows={5}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-primary focus:border-primary"
                value={outputText}
                readOnly
                />
                <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className="absolute top-2 right-2 p-1.5 bg-gray-200 hover:bg-gray-300 rounded text-neutral"
                >
                    {copied ? <CheckIcon className="h-5 w-5 text-success" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            </div>

          </div>
        )}
      </div>
    </ConverterCard>
  );
};
    