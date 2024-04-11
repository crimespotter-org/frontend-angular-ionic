import { Injectable } from '@angular/core';
import { Location } from '../shared/interfaces/location.interface';
import { Geolocation } from '@capacitor/geolocation';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private defaultLocation: Location = { longitude: 52.52437, latitude: 13.41053 }; // Berlin/Germany

  currentLocation: Location | undefined;

  constructor() { }

  /**
   * Updates the current location of the user.
   * @returns the current location of the user or undefined if user denied access.
   */
  async updateLocation(): Promise<Location> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      this.currentLocation = this.defaultLocation;
    }
    return this.currentLocation;
  }

  /**
   * Gets the latest stored location of the user.
   * If no location is stored, it will try to update the location.
   * @returns the current location of the user or undefined if user denied access.
   */
  async getLatestLocation(): Promise<Location>{
    return this.currentLocation || await this.updateLocation();
  }

}
