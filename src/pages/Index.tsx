
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { DataSummary } from '@/components/DataSummary';
import { RelationshipDefiner } from '@/components/RelationshipDefiner';
import { FileData, Relationship } from '@/types/data';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const { toast } = useToast();

  const handleFilesAccepted = (newFiles: FileData[]) => {
    setFiles(newFiles);
  };

  const handleRelationshipsDefined = (newRelationships: Relationship[]) => {
    setRelationships(newRelationships);
    toast({
      title: "Success",
      description: "Relationships have been defined successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-12 px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Excel Analyzer</h1>
          <p className="text-gray-600">
            Upload your Excel files and define relationships between them
          </p>
        </div>

        {files.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFilesAccepted={handleFilesAccepted} />
          </div>
        ) : (
          <div className="space-y-8">
            <RelationshipDefiner 
              files={files}
              onRelationshipsDefined={handleRelationshipsDefined}
            />
            {files.map((file) => (
              <div key={file.id} className="space-y-8">
                <h2 className="text-2xl font-semibold">{file.name}</h2>
                <DataSummary data={file.data} columns={file.columns} />
                <DataPreview data={file.data} columns={file.columns} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
