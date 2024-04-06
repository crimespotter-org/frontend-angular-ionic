import {AfterViewInit, Component} from '@angular/core';
import {Geolocation} from '@capacitor/geolocation';
import {Location} from "../../../shared/interfaces/location.interface"
import * as L from 'leaflet';
import {Case, CaseFiltered} from 'src/app/shared/types/supabase';
import {defaultMarker, murderMarker} from './markers';
import {FilterSearchComponent} from "../../../components/filter.search/filter.search.component";
import {ViewDidEnter} from '@ionic/angular/standalone';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    FilterSearchComponent
  ]
})
export class MapComponent implements ViewDidEnter {
  ionViewDidEnter(): void {
    console.log('triggered ionViewDidEnter in MapComponent');
  }
  private map!: L.Map;
  private markers: L.Marker[] = [];
  cases: CaseFiltered[] = [];
  location: Location | undefined;

  async ngAfterViewInit(): Promise<void> {
    console.log("test")
    let initialPosition: Location;

    if (this.location == undefined) {
      try {
        const userPosition = await Geolocation.getCurrentPosition();
        initialPosition = {
          latitude: userPosition.coords.latitude,
          longitude: userPosition.coords.longitude
        };
      } catch (error) {
        console.log("Error getting user location, defaulting to Berlin", error);
        initialPosition = {latitude: 52.5200, longitude: 13.4050}; // Berlin
      }
    } else {
      initialPosition = this.location;
    }
    setTimeout(() => this.initMap(initialPosition), 0);
  }

  private async initMap(initialPosition: Location): Promise<void> {

    this.map = L.map('map').setView([initialPosition.latitude, initialPosition.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('zoomend', (event) => {
      const currentZoomLevel = this.map.getZoom();
      console.log("Current zoom level: " + currentZoomLevel);
      // You can perform any actions based on the current zoom level here
    });

    this.updateMapWithCases();

    L.marker([initialPosition.latitude, initialPosition.longitude], {icon: defaultMarker}).addTo(this.map);
  }

  updateCases(cases: CaseFiltered[]) {
    this.cases = cases;
    if (this.map) {
      this.updateMapWithCases();
    }
  }

  updateLocation(location: Location) {
    this.location = location;
    if (this.map) {
      this.map.setView([location.latitude, location.longitude]);
    }
  }

  updateMapWithCases() {
    this.clearMarkers();
    this.cases.forEach((caze) => {
      const marker = L.marker([caze.lat, caze.long], {icon: murderMarker}).bindPopup(`${caze.title}<br/>`);
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  addCaseMarker(caze: Case) {
    //TODO: Distinguish between different case types. Seems do be not in db currently
    L.marker([caze.lat, caze.long], {icon: murderMarker}).bindPopup(`${caze.title} <br /> `).addTo(this.map);
  }

}

