import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Location, UserLocation} from "../../../../shared/interfaces/location.interface"
import * as L from 'leaflet';
import 'leaflet.heat';
import {Case, CaseFiltered} from 'src/app/shared/types/supabase';
import {defaultMarker, murderMarker} from './markers';
import {FilterStateService} from 'src/app/services/filter-state.service';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, LoadingController} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {flame, locateOutline, searchOutline} from "ionicons/icons";
import {Geolocation} from "@capacitor/geolocation";
import {FilterSearchComponent} from "../../../filter-search/filter.search.component";
import {Router} from "@angular/router";
import {HelperUtils} from "../../../../shared/helperutils";
import * as moment from "moment";
import {NgClass} from "@angular/common";
import {CaseDetailsService} from "../../../../services/case-details.service";
import { LocationService } from 'src/app/services/location.service';


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
    IonHeader,
    NgClass
  ]
})
export class MapComponent implements OnInit, AfterViewInit {
  private firstReload: boolean = false;
  private heatLayer: any;
  private markerLayer: any;
  heatmapVisible: boolean = false;
  private map!: L.Map;
  private caseMarkers: L.Marker[] = [];
  private locationMarker!: L.Marker;
  cases: CaseFiltered[] = [];
  viewLocation?: Location;
  userLocation?: UserLocation;

  constructor(private filterStateService: FilterStateService,
              private caseDetailsService: CaseDetailsService,
              private router: Router,
              private ngZone: NgZone,
              private loadingController: LoadingController,
            private locationService: LocationService) {
    addIcons({locateOutline, searchOutline, flame});
  }

  ngOnInit() {

    this.locationService.currentLocation$.subscribe(location => {
      if(!location.access_denied)this.setUserLocationMarker(location.location);
      this.userLocation = location;
      //this.viewLocation = location.location;
      //this.updateUserLocation(location.location);
    });

    this.filterStateService.filteredCases$.subscribe(cases => {
      if (cases) {
        this.cases = cases;
        this.updateMapWithCases();
      }
    });
    this.filterStateService.searchLocation$.subscribe(location => {
      if (location) {
        this.updateMapView(location);
      }
    });
    this.filterStateService.updateMapTrigger$.subscribe(() => {
      this.reloadMap();
    });
    this.filterStateService.updateMapLocationTrigger$.subscribe(() => {
      this.viewLocation = {latitude: this.map.getCenter().lat, longitude: this.map.getCenter().lng}
      if (this.heatmapVisible){
        this.toggleHeatmap();
      }
    });
    (window as any)['navigateToCaseDetails'] = this.navigateToCaseDetails.bind(this);
    this.markerLayer = L.layerGroup();
    this.heatLayer = L.heatLayer([], {radius: 25, blur: 15});
  }

  async ngAfterViewInit(): Promise<void> {

    setTimeout(() => {
      this.initMap(this.locationService.getCurrentLocation()), 100;
    })
    if(this.locationService.locationAccessGranted()){
      this.setUserLocationMarker(this.locationService.getCurrentLocation().location);
    }
  }

  initMap(initialPosition: UserLocation) {
    if (this.map != undefined) this.map.remove();
    this.map = L.map('map', {zoomSnap: 0.4, zoomDelta: 1, zoomControl: false}).setView([initialPosition.location.latitude, initialPosition.location.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('zoom', this.onZoomMarkers);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 50);

    this.markerLayer.addTo(this.map);

    this.updateMapWithCases();
  }

  private setUserLocationMarker(location: Location) {
    if(!this.locationMarker){
      this.locationMarker = L.marker([location.latitude, location.longitude], {icon: defaultMarker});
      this.locationMarker.addTo(this.map);
    }
    else{
      this.locationMarker.addTo(this.map);
      this.locationMarker.setLatLng([location.latitude, location.longitude]);
    }
  }

  private reloadMap(): void {
    if (this.viewLocation) {

      if (!this.firstReload) {
        let zoom = this.map.getZoom();
        this.map.remove()
        this.map = L.map('map', {zoomSnap: 0.4, zoomDelta: 1, zoomControl: false}).setView([this.viewLocation.latitude, this.viewLocation.longitude], zoom);
        this.firstReload = true;
      } else {
        this.map = this.map.flyTo([this.viewLocation.latitude, this.viewLocation.longitude], this.map.getZoom());
      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      this.map.on('zoom', this.onZoomMarkers);

      setTimeout(() => {
        this.map.invalidateSize();
      }, 50);

      this.markerLayer.addTo(this.map);

      this.updateMapWithCases();

      this.markerLayer.eachLayer((layer: L.Layer) => {
        const marker = layer as L.Marker;
        const markerLat = marker.getLatLng().lat;
        const markerLng = marker.getLatLng().lng;

        if (this.viewLocation?.latitude && this.viewLocation.longitude &&
          Math.abs(markerLat - this.viewLocation?.latitude) < 0.001 && Math.abs(markerLng - this.viewLocation?.longitude) < 0.001) {
          marker.openPopup();
        }
      });
    }
  }


  updateMapView(location: { latitude: number, longitude: number, radius?: number }) {
    this.viewLocation = location;
    if (this.map) {
      this.map.flyTo([location.latitude, location.longitude], 13, {
        animate: true,
        duration: 0.8
      });
    }
  }

  updateMapWithCases() {
    this.markerLayer.clearLayers();
    const heatPoints: number[][] = [];

    this.cases.forEach((caze) => {
      const marker = L.marker([caze.lat, caze.long], {icon: murderMarker})
        .bindPopup(this.createPopupContent(caze));
      this.markerLayer.addLayer(marker);

      heatPoints.push([caze.lat, caze.long, (caze.upvotes-caze.downvotes) * 600]);
    });

    this.heatLayer.setLatLngs(heatPoints);
  }

  private createPopupContent(caseData: CaseFiltered): string {
    return `
      <div class="popup-content">
        <h5 style="padding-top:5px;padding-bottom:5px;margin:0;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
          <strong>
             ${caseData.title}
          </strong>
        </h5>
        <h6 style="margin:1px;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            ${HelperUtils.formatCrimeType(caseData.case_type)} | ${HelperUtils.formatStatus(caseData.status)} | ${caseData.distance_to_location.toFixed(0)}km entfernt
        </h6>
        <h6 style="margin:1px;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            Am ${new Date(caseData.crime_date_time).toLocaleDateString()} in ${caseData.zip_code}, ${caseData.place_name}
        </h6>
        <p style="margin:1px;overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; font-size: 0.8rem;">
            ${caseData.summary}
        </p>
        <ion-grid style="padding: 0;margin: 0;">
          <ion-row style="padding: 0;margin: 0;align-items: center;">
            <ion-col size="auto">
              <ion-avatar style="width: 26px;height: 26px;margin: 5px;margin-left:0;--border-radius: 4px;">
                <img src="${caseData.creator_avatar_url}" alt="User Avatar">
              </ion-avatar>
            </ion-col>
            <ion-col style="padding: 0;margin: 0;">
              <p style="font-size: 0.6rem; margin-top: 1px; padding: 0; margin-bottom: 0;">
                  Erstellt am: ${moment(caseData.created_at).format('DD.MM.YYYY, HH:mm')}</br>
                  ${caseData.creator_username}
              </p>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-chip color="primary" onClick="navigateToCaseDetails('${caseData.id}', '${caseData.lat}', '${caseData.long}')">
            <ion-icon name="search-outline"></ion-icon>
            <ion-label>Details ansehen</ion-label>
        </ion-chip>
      </div>
    `;
  }

  async navigateToCaseDetails(caseId: string, lat: number, long: number) {
    await this.presentLoading('Steckbrief wird geladen...');
    try {
      this.caseDetailsService.loadCaseDetails(caseId).then(()=>{
        this.ngZone.run(() => {
          this.map.setView([lat, long], 13);
          this.router.navigate(['tabs/tab1/case-details', caseId]);
        });
      })
    } catch (error) {
    } finally {
      await this.dismissLoading();
    }
  }

  clearMarkers() {
    this.caseMarkers.forEach(marker => marker.remove());
    this.caseMarkers = [];
  }

  addCaseMarker(caze: Case) {
    //TODO: Distinguish between different case types. Seems do be not in db currently
    L.marker([caze.lat, caze.long], {icon: murderMarker}).bindPopup(`${caze.title} <br /> `).addTo(this.map);
  }

  goToCurrentLocation() {
    this.updateMapView(this.locationService.getCurrentLocation().location);
  }

  adjustMarkers() {
    this.caseMarkers.forEach(marker => {
      if (this.map.getZoom() < 5) {
        marker.setOpacity(0);
      } else {
        marker.setOpacity(1);
      }
    });
  }

  toggleHeatmap(): void {
    this.heatmapVisible = !this.heatmapVisible;
    if (this.map.hasLayer(this.heatLayer)) {
      this.map.removeLayer(this.heatLayer);
      this.map.addLayer(this.markerLayer);
      this.map.off('zoom', this.onZoomHeat);
      this.map.on('zoom', this.onZoomMarkers)
    } else {
      this.map.addLayer(this.heatLayer);
      this.map.removeLayer(this.markerLayer);
      this.map.off('zoom', this.onZoomMarkers);
      this.map.on('zoom', this.onZoomHeat)
    }
  }

  async presentLoading(message: string = 'Bitte warten...') {
    const loading = await this.loadingController.create({
      message: message,
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  onZoomHeat = () => {
    this.heatLayer.redraw();
  }

  onZoomMarkers = () => {
    this.adjustMarkers();
  }

  async updateUserLocation(location: Location) {
    if (this.map) {
      this.map.flyTo([location.latitude, location.longitude], 13, {
        animate: true,
        duration: 0.8
      });
    }
  }
}


