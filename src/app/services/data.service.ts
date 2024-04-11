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
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=${country}&format=jsonv2&addressdetails=1`;
    return this.http.get<any[]>(url).pipe(
      map(results => results
        .filter(result => result.address.postcode)
        .map(result => ({
          postalCode: parseInt(result.address.postcode, 10),
          city: result.address.city || result.address.town || result.address.village,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon)
        } as QueryLocationResponse))
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
