import { Injectable, signal } from '@angular/core';
import { Location, UserLocation } from '../shared/interfaces/location.interface';
import { Geolocation } from '@capacitor/geolocation';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private defaultLocation: UserLocation = { location: {latitude: 52.520008, longitude: 13.404954}, access_denied: true };

  private _currentLocation: BehaviorSubject<UserLocation> = new BehaviorSubject<UserLocation>(this.defaultLocation);

  public readonly currentLocation$: Observable<UserLocation> = this._currentLocation.asObservable();

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
    return !this._currentLocation.getValue().access_denied;
  }

  private watchPosition() {
    Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    }, (position, err) => {
      if(err){
        console.error(err);
        return;
      }
      else if(!position){
        console.error("Did not receive a position.");
        return;
      }
      this._currentLocation.next({
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        access_denied: false
      });
    });
  }

  public getCurrentLocation(): UserLocation {
    return this._currentLocation.getValue();
  }

  public async getInitialLocation(): Promise<UserLocation> {
    const initialPosition = await Geolocation.getCurrentPosition()

    if (!initialPosition) {
      return this.defaultLocation;
    }

    return {
      location : {
        latitude : initialPosition.coords.latitude,
        longitude : initialPosition.coords.longitude
      },
      access_denied : false
    }
  }
}
