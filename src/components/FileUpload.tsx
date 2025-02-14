
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const FileUpload = ({ onFileAccepted }: { onFileAccepted: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        onFileAccepted(file);
        toast.success('File uploaded successfully');
      } else {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Drop your Excel file here
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            or click to browse
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <File className="w-4 h-4" />
          <span>Accepts .xlsx and .xls files</span>
        </div>
      </div>
    </div>
  );
};
