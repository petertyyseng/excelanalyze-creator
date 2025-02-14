
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { DataSummary } from '@/components/DataSummary';
import * as XLSX from 'xlsx';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        toast({
          title: "Error",
          description: "The Excel file appears to be empty",
          variant: "destructive",
        });
        return;
      }

      setData(jsonData);
      setColumns(Object.keys(jsonData[0]));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the Excel file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-12 px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Excel Analyzer</h1>
          <p className="text-gray-600">
            Upload your Excel file and get instant insights
          </p>
        </div>

        {!data.length ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileAccepted={handleFile} />
          </div>
        ) : (
          <div className="space-y-8">
            <DataSummary data={data} columns={columns} />
            <DataPreview data={data} columns={columns} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
