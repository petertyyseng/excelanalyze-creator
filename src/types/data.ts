
export interface FileData {
  id: string;
  name: string;
  columns: string[];
  data: any[];
}

export interface Relationship {
  sourceFileId: string;
  targetFileId: string;
  sourceKey: string;
  targetKey: string;
}

export interface SummaryConfig {
  field: string;
  fileId: string;
  type: 'sum' | 'count' | 'average';
  dateRange?: {
    start: Date;
    end: Date;
  };
}
