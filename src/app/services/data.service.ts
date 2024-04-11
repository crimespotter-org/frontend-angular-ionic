import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from "rxjs";
import {QueryLocationResponse} from "../shared/interfaces/query-location-response";
import { Location } from '../shared/interfaces/location.interface';

@Injectable({providedIn: 'root'})
export class DataService {
  constructor(private http: HttpClient) {
  }

  getLocationsNominatim(query: string, country: string = 'de'): Observable<QueryLocationResponse[]> {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${query}&polygon_geojson=1&dedupe=0&countrycodes=${country}&addressdetails=1&limit=10&format=jsonv2`;
    return this.http.get<any[]>(url).pipe(
      map(results => results
        //.filter(result => result.address.postcode)
        .filter(result => result.addressType !== 'railway')
        .map(result => ({
          postalCode: parseInt(result.address.postcode, 10),
          sub: result.address.hamlet || result.address.suburb,
          city: result.address.village || result.address.town || result.address.city,
          county: result.address.county || result.address.state,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon)
        } as QueryLocationResponse))
        .filter(result => result.city)
        .filter((result, index, self) => {
          const firstIndex = self.findIndex(t => t.city === result.city && t.county === result.county);
          return firstIndex === index || (self[firstIndex].postalCode === undefined && result.postalCode !== undefined);
        })
      )
    );
  }

  getLocationFromCoordinatesNominatim(location: Location): Observable<QueryLocationResponse[]> {
    const url= `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=jsonv2&addressdetails=1%zoom=10`;
    return this.http.get<any[]>(url).pipe(
      map(results => results
        .filter(result => result.address.postcode)
        .map(result => ({
          postalCode: parseInt(result.address.postcode, 10),
          city: result.address.city || result.address.town || result.address.village,
          latitude: location.latitude,
          longitude: location.longitude
        } as QueryLocationResponse))
      )
    );
  }
}
