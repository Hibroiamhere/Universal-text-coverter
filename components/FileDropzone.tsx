
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface FileDropzoneProps {
  onFileDrop: (file: File) => void;
  acceptedFileTypes: string; // e.g., "image/jpeg, image/png, application/pdf"
  labelText?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileDrop, acceptedFileTypes, labelText = "Drag 'n' drop a file here, or click to select file" }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileDrop]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileDrop(e.target.files[0]);
    }
  }, [onFileDrop]);

  return (
    <div
      className={`flex justify-center items-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
                  ${isDragging ? 'border-primary bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
      />
      <div className="text-center">
        <UploadIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
        <p className={`mt-2 text-sm ${isDragging ? 'text-primary' : 'text-gray-600'}`}>
          {labelText}
        </p>
        <p className="text-xs text-gray-500">Accepted types: {acceptedFileTypes.split(',').join(', ')}</p>
      </div>
    </div>
  );
};
    