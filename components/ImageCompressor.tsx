
import React, { useState, useCallback } from 'react';
import { FileDropzone } from './FileDropzone';
import { ConverterCard } from './ConverterCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageIcon, DownloadIcon } from './Icons';

// Make sure FileSaver.js (saveAs) is available globally
declare var saveAs: any;

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [quality, setQuality] = useState<number>(0.7); // Default quality 0.7 (70%)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).');
      setOriginalFile(null);
      setOriginalPreview(null);
      setCompressedImage(null);
      return;
    }
    setError(null);
    setOriginalFile(file);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setCompressedImage(null); // Reset compressed image on new file
  }, []);

  const compressImage = useCallback(async () => {
    if (!originalFile || !originalPreview) return;

    setIsLoading(true);
    setError(null);
    setCompressedImage(null);

    const image = new Image();
    image.src = originalPreview;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsLoading(false);
        return;
      }
      ctx.drawImage(image, 0, 0);

      // Determine output type. Prefer JPEG for compression.
      const outputMimeType = 'image/jpeg';
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setCompressedImage(reader.result as string);
              setCompressedSize(blob.size);
              setIsLoading(false);
            };
            reader.readAsDataURL(blob);
          } else {
            setError('Failed to compress image.');
            setIsLoading(false);
          }
        },
        outputMimeType,
        quality
      );
    };
    image.onerror = () => {
        setError('Failed to load image for compression.');
        setIsLoading(false);
    }

  }, [originalFile, originalPreview, quality]);

  const handleDownload = useCallback(() => {
    if (compressedImage && originalFile) {
      // Extract extension and name
      const nameParts = originalFile.name.split('.');
      const extension = nameParts.pop();
      const name = nameParts.join('.');
      const newFileName = `${name}_compressed.jpeg`; // Always jpeg for output
      
      // Convert base64 to Blob
      fetch(compressedImage)
        .then(res => res.blob())
        .then(blob => {
          if (typeof saveAs !== 'undefined') {
            saveAs(blob, newFileName);
          } else {
            setError('FileSaver library is not available.');
          }
        })
        .catch(err => {
          console.error("Error fetching blob for download:", err);
          setError('Could not prepare image for download.');
        });
    }
  }, [compressedImage, originalFile]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <ConverterCard 
        title="Image Compressor" 
        description="Reduce the file size of your images (JPEG, PNG, WEBP) by adjusting quality."
        icon={<ImageIcon className="h-8 w-8" />}
    >
      <div className="space-y-6">
        <FileDropzone onFileDrop={handleFileDrop} acceptedFileTypes="image/jpeg, image/png, image/webp" />

        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

        {originalPreview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <h3 className="text-lg font-medium text-neutral mb-2">Original Image</h3>
              <img src={originalPreview} alt="Original" className="max-w-full h-auto rounded-md border" />
              {originalSize && <p className="text-sm text-gray-600 mt-1">Size: {formatBytes(originalSize)}</p>}
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral mb-2">Compression Settings</h3>
              <div className="mb-4">
                <label htmlFor="quality" className="block text-sm font-medium text-neutral">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  id="quality"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <button
                onClick={compressImage}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Compress Image'}
              </button>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner text="Compressing..." />}
        
        {compressedImage && !isLoading && (
          <div>
            <h3 className="text-lg font-medium text-neutral mb-2">Compressed Image</h3>
            <img src={compressedImage} alt="Compressed" className="max-w-full h-auto rounded-md border" />
            {compressedSize && <p className="text-sm text-gray-600 mt-1">New Size: {formatBytes(compressedSize)}</p>}
            {originalSize && compressedSize && (
              <p className="text-sm text-green-600">
                Reduction: {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%
              </p>
            )}
            <button
              onClick={handleDownload}
              className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DownloadIcon className="h-5 w-5 mr-2" />
              Download Compressed Image
            </button>
          </div>
        )}
      </div>
    </ConverterCard>
  );
};
    