
import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  columns: string[];
}

export const DataPreview = ({ data, columns }: DataPreviewProps) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [summaryType, setSummaryType] = useState<'sum' | 'count' | 'average'>('count');
  const [date, setDate] = useState<DateRange | undefined>();

  const numericColumns = useMemo(() => 
    columns.filter(col => data.some(row => typeof row[col] === 'number')),
    [columns, data]
  );

  const dateColumns = useMemo(() => 
    columns.filter(col => 
      data.some(row => !isNaN(Date.parse(row[col])))
    ),
    [columns, data]
  );

  const filteredData = useMemo(() => {
    if (!selectedField) return data.slice(0, 5);
    
    let filtered = [...data];
    
    if (date?.from && date?.to && dateColumns.length > 0) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row[dateColumns[0]]);
        return rowDate >= date.from! && rowDate <= date.to!;
      });
    }
    
    return filtered;
  }, [data, selectedField, date, dateColumns]);

  const summaryData = useMemo(() => {
    if (!selectedField) return [];

    const grouped = filteredData.reduce((acc, row) => {
      const key = row[selectedField];
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(grouped).map(([key, values]) => {
      let value = 0;
      switch (summaryType) {
        case 'sum':
          value = values.reduce((sum, row) => sum + (Number(row[selectedField]) || 0), 0);
          break;
        case 'average':
          value = values.reduce((sum, row) => sum + (Number(row[selectedField]) || 0), 0) / values.length;
          break;
        case 'count':
        default:
          value = values.length;
          break;
      }
      return {
        name: key,
        value: Number(value.toFixed(2))
      };
    });
  }, [filteredData, selectedField, summaryType]);

  return (
    <div className="space-y-6 glass-card p-6 animate-fade-in">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select field to analyze" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedField && numericColumns.includes(selectedField) && (
          <Select value={summaryType} onValueChange={(value: 'sum' | 'count' | 'average') => setSummaryType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select summary type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="average">Average</SelectItem>
            </SelectContent>
          </Select>
        )}

        {dateColumns.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {selectedField && summaryData.length > 0 && (
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-md border mt-6">
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
            {filteredData.slice(0, 5).map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredData.length > 5 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing 5 of {filteredData.length} rows
        </p>
      )}
    </div>
  );
};
