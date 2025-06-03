
import React, { useState, useCallback } from 'react';
import { FileDropzone } from './FileDropzone';
import { ConverterCard } from './ConverterCard';
import { LoadingSpinner } from './LoadingSpinner';
import { FileTextIcon, DownloadIcon, CopyIcon, CheckIcon } from './Icons';

// Make sure pdfjsLib and FileSaver.js (saveAs) are available globally
declare var pdfjsLib: any;
declare var saveAs: any;

export const PdfToTextConverter: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileDrop = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      setPdfFile(null);
      setExtractedText('');
      setFileName('');
      return;
    }
    setError(null);
    setPdfFile(file);
    setFileName(file.name.replace(/\.pdf$/i, ''));
    setExtractedText(''); // Reset text on new file
  }, []);

  const extractText = useCallback(async () => {
    if (!pdfFile) return;
    if (typeof pdfjsLib === 'undefined') {
      setError('PDF processing library (pdf.js) is not available. Please check console for errors.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        setError('Failed to read PDF file.');
        setIsLoading(false);
        return;
      }
      try {
        const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setExtractedText(fullText.trim());
      } catch (err: any) {
        console.error('Error extracting text from PDF:', err);
        setError(`Failed to process PDF: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
      setIsLoading(false);
    };
    reader.readAsArrayBuffer(pdfFile);
  }, [pdfFile]);

  const handleDownloadText = useCallback(() => {
    if (!extractedText || !fileName) return;
    if (typeof saveAs === 'undefined') {
        setError('FileSaver library is not available.');
        return;
    }
    try {
        const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${fileName}_extracted.txt`);
    } catch (e) {
        console.error("Error saving file:", e);
        setError("Could not save the text file.");
    }
  }, [extractedText, fileName]);

  const handleCopyText = useCallback(async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy text to clipboard.');
    }
  }, [extractedText]);

  return (
    <ConverterCard 
        title="PDF to Text Extractor" 
        description="Extract text content from your PDF files quickly and easily."
        icon={<FileTextIcon className="h-8 w-8" />}
    >
      <div className="space-y-6">
        <FileDropzone onFileDrop={handleFileDrop} acceptedFileTypes="application/pdf" labelText="Drop PDF here, or click to select"/>
        
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

        {pdfFile && !isLoading && (
          <div className="text-center">
             <p className="text-sm text-gray-600">Selected file: {pdfFile.name}</p>
            <button
              onClick={extractText}
              disabled={isLoading}
              className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300"
            >
              Extract Text
            </button>
          </div>
        )}

        {isLoading && <LoadingSpinner text="Extracting text..." />}

        {extractedText && !isLoading && (
          <div>
            <h3 className="text-lg font-medium text-neutral mb-2">Extracted Text</h3>
            <div className="relative">
                <textarea
                rows={10}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:ring-primary focus:border-primary"
                value={extractedText}
                readOnly
                />
                <button
                    onClick={handleCopyText}
                    title="Copy to clipboard"
                    className="absolute top-2 right-2 p-1.5 bg-gray-200 hover:bg-gray-300 rounded text-neutral"
                >
                    {copied ? <CheckIcon className="h-5 w-5 text-success" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            </div>
            <button
              onClick={handleDownloadText}
              className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download as .txt
            </button>
          </div>
        )}
      </div>
    </ConverterCard>
  );
};
    