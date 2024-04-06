import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class DataService {
  constructor(private http: HttpClient) {
  }

  getLocationsByPostalCodeOrCity(query: string, country: string = 'de') {
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=${country}&format=jsonv2&addressdetails=5`;
    return this.http.get<any[]>(url);
  }
}
