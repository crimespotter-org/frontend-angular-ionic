import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import * as L from 'leaflet';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { defaultMarker } from 'src/app/components/tab1/components/map/markers';
import {ViewDidEnter, IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-seletion-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.scss'],
  imports: [IonSearchbar],
  standalone: true
})
export class SelectionMapComponent implements AfterViewInit{

  @Input() location: Location = {latitude: 48.441976384366384, longitude: 8.684747075615647};

  @Output() selectedLocation = new EventEmitter<Location>();

  private map!: L.Map;
  private marker: L.Marker = L.marker([0,0], {icon: defaultMarker, opacity: 0});

  constructor() { }

  ngAfterViewInit(): void {
      setTimeout(() => this.initMap({latitude: this.location.latitude, longitude: this.location.longitude}), 0);
  }

  initMap(coordinates: Location){
    if (this.map != undefined) this.map.remove();
    this.map = L.map('selectormap').setView([coordinates.latitude, coordinates.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    },500);

    this.marker.addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
  }

  private onMapClick(event: L.LeafletMouseEvent) {
    // Retrieve clicked coordinates
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;


    this.marker.setOpacity(1);
    this.marker.setLatLng([lat, lng]);

    this.selectedLocation.emit({latitude: lat, longitude: lng});
  }

}
