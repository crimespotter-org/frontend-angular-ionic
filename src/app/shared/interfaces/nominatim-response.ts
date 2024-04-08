export interface NominatimResponse {
  lat: string;
  lon: string;
  name: string;
  address: {
    postcode: string;
    city?: string;
    town?: string;
    village?: string;
  };
}
