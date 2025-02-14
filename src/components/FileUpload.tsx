
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { toast } from 'sonner';
import { FileData } from '@/types/data';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesAccepted: (files: FileData[]) => void;
  maxFiles?: number;
}

export const FileUpload = ({ onFilesAccepted, maxFiles = 3 }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const processFile = async (file: File): Promise<FileData> => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result;
          const workbook = XLSX.read(buffer, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            throw new Error('File appears to be empty');
          }

          resolve({
            id: uuidv4(),
            name: file.name,
            data: jsonData,
            columns: Object.keys(jsonData[0])
          });
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(processFile)
      );
      
      const newFiles = [...uploadedFiles, ...processedFiles];
      setUploadedFiles(newFiles);
      onFilesAccepted(newFiles);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error('Failed to process one or more files');
    }
  }, [maxFiles, onFilesAccepted, uploadedFiles]);

  const removeFile = (fileId: string) => {
    const newFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(newFiles);
    onFilesAccepted(newFiles);
    toast.success('File removed successfully');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: true,
    maxFiles,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`drop-zone ${isDragging ? 'dragging' : ''} border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Drop your Excel files here
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              or click to browse (max {maxFiles} files)
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <File className="w-4 h-4" />
            <span>Accepts .xlsx and .xls files</span>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-3">Uploaded Files:</h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 mt-2">
            {uploadedFiles.length} of {maxFiles} files uploaded
          </p>
        </div>
      )}
    </div>
  );
};
