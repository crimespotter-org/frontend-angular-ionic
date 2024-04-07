export interface Filter {
  type: 'caseType' | 'status' | 'dateRange' | 'location';
  value: string | { start: Date; end: Date } | {
    postalCode: number,
    city: string,
    latitude: number;
    longitude: number;
    radius: number
  };
}
