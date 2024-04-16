import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {Location} from "../../../../shared/interfaces/location.interface"
import * as L from 'leaflet';
import {Case, CaseFiltered} from 'src/app/shared/types/supabase';
import {murderMarker} from './markers';
import {FilterStateService} from 'src/app/services/filter-state.service';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {locateOutline,  searchOutline} from "ionicons/icons";
import {Geolocation} from "@capacitor/geolocation";
import {FilterSearchComponent} from "../../../filter-search/filter.search.component";
import {Router} from "@angular/router";
import {HelperUtils} from "../../../../shared/helperutils";
import * as moment from "moment";


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

  constructor(private filterStateService: FilterStateService, private router: Router, private ngZone: NgZone) {
    addIcons({locateOutline, searchOutline});
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
    this.filterStateService.updateTrigger$.subscribe(() => {
      this.reloadMap();
    });
    (window as any)['navigateToCaseDetails'] = this.navigateToCaseDetails.bind(this);
  }

  async ngAfterViewInit(): Promise<void> {
    let initialPosition: Location;

    if (this.location == undefined) {
      try {
        const userPosition = await Geolocation.getCurrentPosition();
        this.location = {
          latitude: userPosition.coords.latitude,
          longitude: userPosition.coords.longitude
        };
      } catch (error) {
        console.log("Error getting user location, defaulting to Berlin", error);
        initialPosition = {latitude: 52.5200, longitude: 13.4050}; // Berlin
      }
    } else {
      initialPosition = this.location;
      this.location = initialPosition;
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

    this.map.on('zoom', () => {
      this.adjustMarkers();
    });


    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);

    this.updateMapWithCases();
  }

  private reloadMap(): void {
    if (this.location) {
      this.initMap(this.location);
    }
  }

  updateLocation(location: { latitude: number, longitude: number, radius?: number }) {
    this.location = location;
    if (this.map) {
      this.map.flyTo([location.latitude, location.longitude], 13, {
        animate: true,
        duration: 0.8
      });
    }
  }

  updateMapWithCases() {
    this.clearMarkers();
    this.cases.forEach((caze) => {
      const marker = L.marker([caze.lat, caze.long], {icon: murderMarker})
        .bindPopup(this.createPopupContent(caze));
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  private createPopupContent(caseData: CaseFiltered): string {
    return `
      <div class="popup-content">
        <h3 style="margin:0;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            ${caseData.title}
        </h3>
        <h6 style="margin:1px;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            ${HelperUtils.formatCrimeType(caseData.case_type)} | ${HelperUtils.formatStatus(caseData.status)}
        </h6>
        <h6 style="margin:1px;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            Am ${new Date(caseData.crime_date_time).toLocaleDateString()} in ${caseData.zip_code}, ${caseData.place_name}
        </h6>
        <p style="margin:1px;overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; font-size: 0.8rem;">
            ${caseData.summary}
        </p>
        <p style="font-size: 0.6rem; margin-top: 4px;">
            Erstellt am: ${moment(caseData.created_at).format('DD.MM.YYYY, HH:mm')}
        </p>
        <ion-chip color="primary" onClick="navigateToCaseDetails('${caseData.id}', '${caseData.lat}', '${caseData.long}')">
            <ion-icon name="search-outline"></ion-icon>
            <ion-label>Details ansehen</ion-label>
        </ion-chip>
      </div>
    `;
  }

  navigateToCaseDetails(caseId: string, lat: number, long: number) {
    this.ngZone.run(() => {
      this.updateLocation({latitude: lat, longitude: long})
      this.router.navigate(['tabs/case-details', caseId], {state: {returnRoute: '/tabs/tab1'}});
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

  adjustMarkers() {
    this.markers.forEach(marker => {
      if (this.map.getZoom() < 5) {
        marker.setOpacity(0);
      } else {
        marker.setOpacity(1);
      }
    });
  }

}
