import { AfterViewInit, Component, inject } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from "../../../shared/interfaces/location.interface"
import { SupabaseService } from "../../../services/supabase.service";
import * as L from 'leaflet';
import { Case } from 'src/app/shared/types/supabase';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit {

  private supabaseService: SupabaseService = inject(SupabaseService);

  constructor(){
    this.defaultIcon = L.icon({
        iconUrl: '../../assets/images/marker-icon.png',
        shadowUrl: '../../assets/images/marker-shadow.png',
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -40]
    });
  }

  private defaultIcon!: L.Icon;
  private map!: L.Map;

  ngAfterViewInit(): void {

    Geolocation.getCurrentPosition().then((position) => {
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      setTimeout(() => this.initMap(coordinates), 0);
    }).catch((error) => {
      console.log(error);
      const coordinates = {
        latitude: 52.5200,
        longitude: 13.4050
      }
      setTimeout(() => this.initMap(coordinates), 0);
    }).then(() => {
      this.supabaseService.getAllCases().then((data: Case[]) => {
        data.forEach((item: Case) => this.addMarker(item))
      });
    }
    );
  };


  private initMap(initialPosition: Location): void {
    this.map = L.map('map').setView([initialPosition.latitude, initialPosition.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    L.marker([initialPosition.latitude, initialPosition.longitude], {icon: this.defaultIcon}).addTo(this.map);
  }

  private addMarker(caze: Case){
    L.marker([caze.lat, caze.long], {icon: this.defaultIcon}).bindPopup(`${caze.title} <br /> `).addTo(this.map);
  }

}
function constructor() {
  throw new Error('Function not implemented.');
}

