export interface Filter {
  type: 'caseType' | 'status' | 'dateRange' | 'location';
  value: string | { start: Date; end: Date };
}
