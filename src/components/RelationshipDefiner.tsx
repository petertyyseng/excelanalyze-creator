
import { useState } from 'react';
import { FileData, Relationship } from '@/types/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RelationshipDefinerProps {
  files: FileData[];
  onRelationshipsDefined: (relationships: Relationship[]) => void;
}

export const RelationshipDefiner = ({
  files,
  onRelationshipsDefined
}: RelationshipDefinerProps) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [currentRelationship, setCurrentRelationship] = useState<Partial<Relationship>>({});

  const handleAddRelationship = () => {
    if (currentRelationship.sourceFileId && 
        currentRelationship.targetFileId && 
        currentRelationship.sourceKey && 
        currentRelationship.targetKey) {
      const newRelationship = currentRelationship as Relationship;
      setRelationships([...relationships, newRelationship]);
      setCurrentRelationship({});
    }
  };

  const handleSave = () => {
    onRelationshipsDefined(relationships);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Define Relationships</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Source File</label>
          <Select
            value={currentRelationship.sourceFileId}
            onValueChange={(value) => setCurrentRelationship({
              ...currentRelationship,
              sourceFileId: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source file" />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentRelationship.sourceFileId && (
            <>
              <label className="block text-sm font-medium text-gray-700">Source Key</label>
              <Select
                value={currentRelationship.sourceKey}
                onValueChange={(value) => setCurrentRelationship({
                  ...currentRelationship,
                  sourceKey: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select key field" />
                </SelectTrigger>
                <SelectContent>
                  {files
                    .find(f => f.id === currentRelationship.sourceFileId)
                    ?.columns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Target File</label>
          <Select
            value={currentRelationship.targetFileId}
            onValueChange={(value) => setCurrentRelationship({
              ...currentRelationship,
              targetFileId: value
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target file" />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentRelationship.targetFileId && (
            <>
              <label className="block text-sm font-medium text-gray-700">Target Key</label>
              <Select
                value={currentRelationship.targetKey}
                onValueChange={(value) => setCurrentRelationship({
                  ...currentRelationship,
                  targetKey: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select key field" />
                </SelectTrigger>
                <SelectContent>
                  {files
                    .find(f => f.id === currentRelationship.targetFileId)
                    ?.columns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          onClick={handleAddRelationship}
          disabled={!currentRelationship.sourceFileId || 
                    !currentRelationship.targetFileId || 
                    !currentRelationship.sourceKey || 
                    !currentRelationship.targetKey}
        >
          Add Relationship
        </Button>
        <Button onClick={handleSave} disabled={relationships.length === 0}>
          Save Relationships
        </Button>
      </div>

      {relationships.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Defined Relationships:</h3>
          <ul className="space-y-2">
            {relationships.map((rel, index) => {
              const sourceFile = files.find(f => f.id === rel.sourceFileId);
              const targetFile = files.find(f => f.id === rel.targetFileId);
              return (
                <li key={index} className="text-sm text-gray-600">
                  {sourceFile?.name} ({rel.sourceKey}) → {targetFile?.name} ({rel.targetKey})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
