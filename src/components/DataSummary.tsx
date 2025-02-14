
import { useMemo } from 'react';
import { BarChart2, Table as TableIcon, FileSpreadsheet } from 'lucide-react';

interface DataSummaryProps {
  data: any[];
  columns: string[];
}

export const DataSummary = ({ data, columns }: DataSummaryProps) => {
  const summary = useMemo(() => ({
    rowCount: data.length,
    columnCount: columns.length,
    numericColumns: columns.filter(col => 
      data.some(row => typeof row[col] === 'number')
    ).length,
  }), [data, columns]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gray-50">
            <TableIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Rows</p>
            <h3 className="text-2xl font-semibold">{summary.rowCount}</h3>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gray-50">
            <FileSpreadsheet className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Columns</p>
            <h3 className="text-2xl font-semibold">{summary.columnCount}</h3>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gray-50">
            <BarChart2 className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Numeric Columns</p>
            <h3 className="text-2xl font-semibold">{summary.numericColumns}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
