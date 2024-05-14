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

  private _currentLocation: BehaviorSubject<UserLocation> = new BehaviorSubject<UserLocation>(this.defaultLocation);

  public readonly currentLocation$: Observable<UserLocation> = this._currentLocation.asObservable();

  public currentLocation: UserLocation = this.defaultLocation;

  constructor() { 
    this.checkAndRequestLocationAccess();
  }

  private checkAndRequestLocationAccess() {
    Geolocation.checkPermissions().then(permission => {
      if (permission.location === 'granted') {
        this.watchPosition();
      } else {
        Geolocation.requestPermissions().then(permission => {
          if (permission.location === 'granted') {
            this.watchPosition();
          } else {
            this._currentLocation.next(this.defaultLocation);
          }
        });
      }
    });
  }

  public locationAccessGranted(): boolean {
    return this.currentLocation.access_denied === false;
  }

  private watchPosition() {
    Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    }, (position, err) => {
      if(err){
        console.error(err);
        return;
      }
      else if(!position){
        console.error("Did not receive a position.");
        return;
      }
      this.currentLocation = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        access_denied: false
      };
      this._currentLocation.next(this.currentLocation);
    });
  }

  public getCurrentLocation(): UserLocation {
    return this.currentLocation;
  }
}