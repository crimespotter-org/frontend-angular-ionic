import { Injectable, signal } from '@angular/core';
import { Location, UserLocation } from '../shared/interfaces/location.interface';
import { Geolocation } from '@capacitor/geolocation';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private defaultLocation: UserLocation = { location: {latitude: 52.520008, longitude: 13.404954}, access_denied: true }; // Berlin/Germany

  private currentLocation!: UserLocation;

  private _currentLocation: BehaviorSubject<UserLocation> = new BehaviorSubject<UserLocation>(this.currentLocation);

  public readonly currentLocation$: Observable<UserLocation> = this._currentLocation.asObservable();


  constructor() { 

    this.updateLocation().then(location => {
      this.currentLocation = location;
    });
    
    // Update location every minute
    const timer = setInterval(() => {
      this.updateLocation();
    }, 60 * 1000);
  }

  /**
   * Updates the current location of the user.
   * @returns the current location of the user or defaultLocation if user denied access.
   */
  async updateLocation(): Promise<UserLocation>{
    try{
      const position = await Geolocation.getCurrentPosition();
      this.currentLocation = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        access_denied: false
      };
      this._currentLocation.next(this.currentLocation);
      return this.currentLocation;
    }
    catch (error) {
      if(this.currentLocation === undefined){
        this.currentLocation = this.defaultLocation;
      }
      //Access denied just keep current stored location
      return this.currentLocation;
    }
  }

  /**
   * Gets the latest stored location of the user.
   * If no location is stored, it will try to update the location.
   * @returns the current location of the user or undefined if user denied access.
   */
  async getLatestLocation(): Promise<UserLocation>{
    return this.currentLocation || this.updateLocation();
  }

}
