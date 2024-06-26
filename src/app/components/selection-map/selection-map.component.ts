import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import * as L from 'leaflet';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { defaultMarker } from 'src/app/components/tab1/components/map/markers';
import { ViewDidEnter, IonSearchbar, IonItem, IonLabel, IonList, IonContent } from '@ionic/angular/standalone';
import { NominatimResponse } from 'src/app/shared/interfaces/nominatim-response';
import { DataService } from 'src/app/services/data.service';
import { CommonModule } from '@angular/common';
import { QueryLocationResponse } from 'src/app/shared/interfaces/query-location-response';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-selection-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.scss'],
  imports: [IonSearchbar, IonItem, IonLabel, IonList, CommonModule, IonContent],
  standalone: true
})
export class SelectionMapComponent implements AfterViewInit {

  dataService = inject(DataService);

  @Input() location: Location = { latitude: 48.441976384366384, longitude: 8.684747075615647 };
  @Input() defaultMarkerLocation: Location | null = null;

  @Output() selectedLocation = new EventEmitter<Location>();

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  inputSearch?: any;
  searchList: any[] = [];

  private map!: L.Map;
  private marker: L.Marker = L.marker([0, 0], { icon: defaultMarker, opacity: 0 });

  constructor() { }

  ngAfterViewInit(): void {
    console.log(this.location);
    setTimeout(() => this.initMap({ latitude: this.location.latitude, longitude: this.location.longitude }), 100);
    if (this.defaultMarkerLocation != null) {
      this.marker.setLatLng([this.defaultMarkerLocation.latitude, this.defaultMarkerLocation.longitude]);
      this.marker.setOpacity(1);
    }
  }

  initMap(coordinates: Location) {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('selectormap', { zoomControl: false }).setView([coordinates.latitude, coordinates.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.marker.addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
    setTimeout(() => {
      this.map.invalidateSize();
    }, 10);
  }

  private onMapClick(event: L.LeafletMouseEvent) {
    // Retrieve clicked coordinates
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;


    this.marker.setOpacity(1);
    this.marker.setLatLng([lat, lng]);

    this.selectedLocation.emit({ latitude: lat, longitude: lng });
  }

  onSearchChange(event: any) {
    if (event == undefined || event.target == undefined || event.target.value === "") return;
    let searchText: string = event.target.value;

    //(lat, lng) | lat, lng
    const coordinatePattern = /^(\(-?\d+(.\d+)?,\s*-?\d+(.\d+)?\))$|^-?\d+(.\d+)?,\s*-?\d+(.\d+)?$/;
    if (coordinatePattern.test(searchText)) {
      console.log("Coordinates detected");
      const coordinates = searchText.replace('(', '').replace(')', '');
      const [latitude, longitude] = coordinates.split(',').map(Number);
      console.log(latitude, longitude);
      this.marker.setOpacity(1);
      this.marker.setLatLng([latitude, longitude]);

      this.selectedLocation.emit({ latitude: latitude, longitude: longitude });
      this.onSearchEntrySelected({
        latitude: latitude,
        longitude: longitude,
        postalCode: 0,
        sub: '',
        city: '',
        county: ''
      });
    } else {
      this.dataService.getLocationsNominatim(searchText).subscribe(results => {
        this.searchList = results;
        if (this.searchList.length == 1) {
          this.onSearchEntrySelected(this.searchList[0]);
        }
      });
    }
  }

  onSearchEntrySelected(search: QueryLocationResponse) {
    this.map.flyTo([search.latitude, search.longitude], 13, {
      animate: true,
      duration: 0.8
    });
    this.searchList = [];
    this.searchbar.value = "";
  }

}
