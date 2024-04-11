import { Injectable } from '@angular/core';
import { Location } from '../shared/interfaces/location.interface';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  currentLocation: Location | undefined;

  constructor() { }

  /**
   * Updates the current location of the user.
   * @returns the current location of the user or undefined if user denied access.
   */
  async updateLocation(): Promise<Location | undefined> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      //don't do anything if user denies access
      //keep latest location stored
    }
    return this.currentLocation;
  }

  /**
   * Gets the latest stored location of the user.
   * If no location is stored, it will try to update the location.
   * @returns the current location of the user or undefined if user denied access.
   */
  async getLatestLocation(): Promise<Location | undefined>{
    return this.currentLocation || await this.updateLocation();
  }

}
