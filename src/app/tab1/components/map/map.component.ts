import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "../../../shared/interfaces/location.interface"
import * as L from 'leaflet';
import {Case, CaseFiltered} from 'src/app/shared/types/supabase';
import {murderMarker} from './markers';
import {FilterSearchComponent} from "../../../components/filter.search/filter.search.component";
import {FilterStateService} from 'src/app/services/filter-state.service';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {locateOutline} from "ionicons/icons";
import {Geolocation} from "@capacitor/geolocation";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    FilterSearchComponent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonContent,
    IonHeader
  ]
})
export class MapComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  private markers: L.Marker[] = [];
  cases: CaseFiltered[] = [];
  location?: Location;

  constructor(private filterStateService: FilterStateService) {
    addIcons({locateOutline});
  }

  ngOnInit() {
    this.filterStateService.filteredCases$.subscribe(cases => {
      if (cases) {
        this.cases = cases;
        this.updateMapWithCases();
      }
    });
    this.filterStateService.searchLocation$.subscribe(location => {
      if (location) {
        this.updateLocation(location);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    let initialPosition: Location;

    if (this.location == undefined) {
      try {
        const userPosition = await Geolocation.getCurrentPosition();
        this.location  = {
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

  initMap(initialPosition: Location) {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('map').setView([initialPosition.latitude, initialPosition.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    },100);

    this.updateMapWithCases();
  }

  updateLocation(location: { latitude: number, longitude: number, radius?: number }) {
    this.location = location;
    if (this.map) {
      this.map.setView([location.latitude, location.longitude], this.map.getZoom());
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

  async goToCurrentLocation() {
    await this.filterStateService.goToCurrentLocation();
  }

}

