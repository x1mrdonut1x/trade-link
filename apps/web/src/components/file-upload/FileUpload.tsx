import { AlertTriangle, Upload } from '@tradelink/ui/icons';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isLoading?: boolean;
  error?: string | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  isLoading = false,
  error,
  accept = '.csv',
  maxSize = 10,
  className = '',
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (accept && !file.name.toLowerCase().endsWith(accept.toLowerCase().replace('.', ''))) {
      return false;
    }

    // Check file size
    return !(maxSize && file.size > maxSize * 1024 * 1024);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm text-red-800">Upload Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 group ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <Upload
            className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
            }`}
          />
          {selectedFile ? (
            <div className="transition-all duration-300">
              <p className="text-lg font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
              <p className="text-xs text-muted-foreground mt-1">Click to change file</p>
            </div>
          ) : (
            <div className="transition-all duration-300">
              <p className={`text-lg font-medium ${isDragOver ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>
                {isDragOver
                  ? `Drop your ${accept.replace('.', '').toUpperCase()} file here`
                  : `Drop your ${accept.replace('.', '').toUpperCase()} file here or click to browse`}
              </p>
              <p
                className={`text-sm ${
                  isDragOver ? 'text-blue-600' : 'text-muted-foreground group-hover:text-blue-600'
                }`}
              >
                Only {accept.replace('.', '').toUpperCase()} files are supported (max {maxSize}MB)
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
