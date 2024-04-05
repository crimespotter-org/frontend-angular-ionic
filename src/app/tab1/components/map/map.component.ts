import { AfterViewInit, Component, inject } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from "../../../shared/interfaces/location.interface"
import { SupabaseService } from "../../../services/supabase.service";
import * as L from 'leaflet';
import { Case } from 'src/app/shared/types/supabase';
import { defaultMarker, murderMarker } from './markers';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
})
export class MapComponent implements AfterViewInit {

  private supabaseService: SupabaseService = inject(SupabaseService);

  constructor(){
  }

  private map!: L.Map;

  async ngAfterViewInit(): Promise<void> {

    try{
      const userPosition = await Geolocation.getCurrentPosition();

      //current position of user 
      this.initMap({
        latitude: userPosition.coords.latitude, 
        longitude: userPosition.coords.longitude});

      L.marker([userPosition.coords.latitude, userPosition.coords.longitude], {icon: defaultMarker}).bindPopup("Hier sind Sie").addTo(this.map);
    }
    catch(error){
      //Berlin
      this.initMap({
        latitude: 52.5200,
        longitude: 13.4050
      })
    }
    
    this.supabaseService.getAllCases().then((data: Case[]) => {
      data.forEach((item: Case) => this.addCaseMarker(item))
    });
  };


  private initMap(initialPosition: Location): void {
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
  }

  private addCaseMarker(caze: Case){
    //TODO: Distinguish between different case types. Seems do be not in db currently
    L.marker([caze.lat, caze.long], {icon: murderMarker}).bindPopup(`${caze.title} <br /> `).addTo(this.map);
  }

}
function constructor() {
  throw new Error('Function not implemented.');
}

