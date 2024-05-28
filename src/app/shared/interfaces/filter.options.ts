export interface FilterOptions {
  crimefluencerIds?: string[];
  startDate?: Date;
  endDate?: Date;
  caseTypes?: string[];
  status?: string;
  radius?: number; // in Metern
  currentLat?: number;
  currentLong?: number;
}
