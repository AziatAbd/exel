export type ListType = {
  source: (string | null)[];
  column: string;
  types: string[];
  textType: string;
  targetColumnName: string;
  id: string;
};

export type ListRow = {
  selectedFiles: string;
  selectedColumns: string;
  selectedTypes: string;
  additionalText: string | number;
  targetColumnNames: string;
};

export type DataItem = {
  [key: string]: string | number;
};
