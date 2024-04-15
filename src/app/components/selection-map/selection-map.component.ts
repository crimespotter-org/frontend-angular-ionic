import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import * as L from 'leaflet';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { defaultMarker } from 'src/app/components/tab1/components/map/markers';
import { ViewDidEnter, IonSearchbar, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { NominatimResponse } from 'src/app/shared/interfaces/nominatim-response';
import { DataService } from 'src/app/services/data.service';
import { CommonModule } from '@angular/common';
import { QueryLocationResponse } from 'src/app/shared/interfaces/query-location-response';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-seletion-map',
  templateUrl: './selection-map.component.html',
  styleUrls: ['./selection-map.component.scss'],
  imports: [IonSearchbar, IonItem, IonLabel, IonList, CommonModule],
  standalone: true
})
export class SelectionMapComponent implements AfterViewInit {

  dataService = inject(DataService);

  @Input() location: Location = { latitude: 48.441976384366384, longitude: 8.684747075615647 };

  @Output() selectedLocation = new EventEmitter<Location>();

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  inputSearch?: any;
  searchList: any[] = [];

  private map!: L.Map;
  private marker: L.Marker = L.marker([0, 0], { icon: defaultMarker, opacity: 0 });

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap({ latitude: this.location.latitude, longitude: this.location.longitude }), 0);
  }

  initMap(coordinates: Location) {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('selectormap').setView([coordinates.latitude, coordinates.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);

    this.marker.addTo(this.map);
    this.map.on('click', this.onMapClick.bind(this));
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
    const searchText = event.target.value;

    const coordinatePattern = /^-?\d+(.\d+)?,\s*-?\d+(.\d+)?$/;
    if (coordinatePattern.test(searchText)) {
      console.log("Coordinates detected");
      const [latitude, longitude] = searchText.split(',').map(Number);
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
