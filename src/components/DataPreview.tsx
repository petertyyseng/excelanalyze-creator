
import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataPreviewProps {
  data: any[];
  columns: string[];
}

export const DataPreview = ({ data, columns }: DataPreviewProps) => {
  const previewData = useMemo(() => data.slice(0, 5), [data]);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Data Preview</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-medium">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {data.length > 5 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing 5 of {data.length} rows
        </p>
      )}
    </div>
  );
};
