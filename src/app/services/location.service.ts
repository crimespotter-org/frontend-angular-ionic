import { Injectable } from '@angular/core';
import { Location, UserLocation } from '../shared/interfaces/location.interface';
import { Geolocation } from '@capacitor/geolocation';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private defaultLocation: UserLocation = { location: {longitude: 52.52437, latitude: 13.41053}, access_denied: true }; // Berlin/Germany

  currentLocation: UserLocation | undefined;

  constructor() { }

  /**
   * Updates the current location of the user.
   * @returns the current location of the user or undefined if user denied access.
   */
  async updateLocation(): Promise<UserLocation> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentLocation = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        access_denied: false
      };
    } catch (error) {
      //if location was already defined and now access is denied, use the latest location
      if(this.currentLocation == undefined){
        this.currentLocation = this.defaultLocation;
      }
    }
    return this.currentLocation;
  }

  /**
   * Gets the latest stored location of the user.
   * If no location is stored, it will try to update the location.
   * @returns the current location of the user or undefined if user denied access.
   */
  async getLatestLocation(): Promise<UserLocation>{
    return this.currentLocation || await this.updateLocation();
  }

}
