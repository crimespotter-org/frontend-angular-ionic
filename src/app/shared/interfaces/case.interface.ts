import { Location } from "./location.interface";

export interface Case {
  id: string;
  title: string;
  summary: string;
  location: string;
  status: string;
  created_by: string;
  created_at: string;
  place_name: string;
  zip_code: number;
}