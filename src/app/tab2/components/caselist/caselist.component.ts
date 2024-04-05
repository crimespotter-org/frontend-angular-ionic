import {Component, Inject, LOCALE_ID} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenu,
  IonModal,
  IonRange,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  MenuController
} from "@ionic/angular/standalone";
import {CommonModule, DatePipe, formatDate, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  add,
  calendar,
  chevronDownOutline,
  chevronUpOutline,
  closeCircle,
  createOutline,
  imagesOutline,
  layers,
  locate,
  micCircleOutline,
  newspaperOutline,
  optionsOutline,
  pin,
  pricetag,
  thumbsDownOutline,
  thumbsUpOutline
} from "ionicons/icons";
import {CaseFiltered} from "../../../shared/types/supabase";
import {SupabaseService} from "../../../services/supabase.service";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../../services/data.service";
import {FilterOptions} from "../../../shared/interfaces/filter.options";
import {Geolocation} from "@capacitor/geolocation";
import {StorageService} from "../../../services/storage.service";
import {Filter} from "../../../shared/interfaces/filters";


@Component({
  selector: 'app-caselist',
  templateUrl: './caselist.component.html',
  styleUrls: ['./caselist.component.scss'],
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    NgForOf,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonButtons,
    IonButton,
    IonDatetime,
    IonMenu,
    IonChip,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonInput,
    DatePipe,
    IonModal,
    FormsModule,
    NgIf,
    CommonModule,
    IonToggle
  ],
  standalone: true
})
export class CaselistComponent {
  startDate: Date = new Date("01.01.1900");
  endDate: Date = new Date(Date.now());
  cases: CaseFiltered[] = [];
  location = '';
  locations: any[] = [];
  selectedLocation: any = null;
  selectedCoordinates?: { lat: number; lon: number };
  enableLocationSearch: boolean = false;
  enableDateRangeSearch: boolean = false;
  useCurrentLocation: boolean = false;
  radius?: number;
  caseTypes: string[] = [];
  selectedCaseTypes?: string[];
  selectedStatus?: string;
  filters: Filter[] = [];

  constructor(private storageService:
                StorageService, private supabaseService: SupabaseService, private menu: MenuController, private dataService: DataService, @Inject(LOCALE_ID) private locale: string) {
    addIcons({
      chevronUpOutline,
      chevronDownOutline,
      thumbsUpOutline,
      thumbsDownOutline,
      micCircleOutline,
      newspaperOutline,
      imagesOutline,
      closeCircle,
      createOutline,
      calendar,
      layers,
      optionsOutline,
      pricetag,
      locate,
      pin,
      add
    });
  }

  async ngOnInit() {
    await this.loadCases();
    this.caseTypes = this.storageService.getCaseTypes();
  }

  async loadCases() {
    this.cases = await this.supabaseService.getFilteredCases();
  }

  openFilterMenu() {
    this.menu.enable(true, 'filterMenu');
    this.menu.open('filterMenu');
  }

  setStartDate(event: CustomEvent) {
    this.startDate = new Date(event.detail.value);
  }

  setEndDate(event: CustomEvent) {
    this.endDate = new Date(event.detail.value);
  }

  async applyFilters() {

    this.filters = [];

    if (this.selectedCaseTypes && this.selectedCaseTypes.length > 0) {
      this.selectedCaseTypes.forEach(type => {
        this.filters.push({type: 'caseType', value: type});
      });
    }

    if (this.selectedStatus) {
      this.filters.push({type: 'status', value: this.selectedStatus});
    }

    if (this.enableDateRangeSearch && this.startDate && this.endDate) {
      this.filters.push({type: 'dateRange', value: {start: this.startDate, end: this.endDate}});
    }

    if (this.enableLocationSearch) {
      if (this.useCurrentLocation) {
        this.filters.push({type: 'location', value: 'Aktueller Ort'});
      } else if (this.selectedLocation) {
        this.filters.push({type: 'location', value: this.selectedLocation.name});
      }
    }

    const filterOptions: FilterOptions = {
      startDate: this.startDate,
      endDate: this.endDate,
      caseTypes: this.selectedCaseTypes,
      status: this.selectedStatus,
    };

    if (this.enableLocationSearch) {
      if (this.useCurrentLocation) {
        Geolocation.getCurrentPosition().then((position) => {
          filterOptions.currentLat = position.coords.latitude;
          filterOptions.currentLong = position.coords.longitude;
        }).catch((error) => {
          console.log(error);
        })
      } else {
        filterOptions.currentLat = this.selectedLocation.lat;
        filterOptions.currentLong = this.selectedLocation.lon;
      }
      filterOptions.radius = this.radius;
    }

    this.cases = await this.supabaseService.getFilteredCases(filterOptions);

    await this.menu.close('filterMenu');
  }

  checkLocationInput(locationInput: string) {
    this.dataService.getLocationsByPostalCodeOrCity(locationInput).subscribe(locations => {
      this.locations = locations;
    }, error => {
      console.error('Fehler bei der Suche nach Standorten', error);
      this.locations = [];
    });
  }

  onLocationSelected(location: any) {
    this.selectedLocation = location;
    this.selectedCoordinates = {lat: location.lat, lon: location.lon};
  }

  toggleUseCurrentLocation($event: any) {
    if (this.useCurrentLocation) {
      Geolocation.getCurrentPosition().then((position) => {
        this.selectedLocation.lat = position.coords.latitude;
        this.selectedLocation.lon = position.coords.longitude;
      }).catch((error) => {
        console.log(error);
        this.useCurrentLocation = false;
      })
    }
  }

  updateCaseTypeFilter(event: any) {
    const selectedTypes: string[] = event.detail.value;
    this.filters = this.filters.filter(f => f.type !== 'caseType');
    selectedTypes.forEach(type => this.addCaseTypeFilter(type));
  }

  addCaseTypeFilter(type: string) {
    this.filters.push({type: 'caseType', value: type});
  }

  updateStatusFilter(event: any) {
    const selectedStatus: string = event.detail.value;
    this.filters = this.filters.filter(f => f.type !== 'status');
    if (selectedStatus) {
      this.addStatusFilter(selectedStatus);
    }
  }

  addStatusFilter(status: string) {
    this.filters.push({type: 'status', value: status});
  }

  addDateRangeFilter(start: Date, end: Date) {
    this.filters.push({type: 'dateRange', value: {start, end}});
  }

  formatDateRange(filterValue: Filter['value']): string {
    if (typeof filterValue !== 'string') {
      const start = formatDate(filterValue.start, 'dd.MM.yyyy', this.locale);
      const end = formatDate(filterValue.end, 'dd.MM.yyyy', this.locale);
      return `Datum: ${start} - ${end}`;
    }
    return '';
  }

  removeFilter(filterToRemove: Filter) {
    this.filters = this.filters.filter(filter => filter !== filterToRemove);

    if (filterToRemove.type === 'caseType') {
      if (this.selectedCaseTypes != null) {
        this.selectedCaseTypes = this.selectedCaseTypes.filter(type => type !== filterToRemove.value)
        if (this.selectedCaseTypes.length == 0) {
          this.selectedCaseTypes = undefined;
        }
      }
    } else if (filterToRemove.type === 'status') {
      this.selectedStatus = undefined;
    } else if (filterToRemove.type === 'dateRange') {
      this.startDate = new Date("01.01.1900");
      this.endDate = new Date(Date.now());
      this.enableDateRangeSearch = false;
    } else if (filterToRemove.type === 'location') {
      this.enableLocationSearch = false;
      this.useCurrentLocation = false;
      this.selectedLocation = null;
      this.selectedCoordinates = undefined;
    }

    this.applyFilters();
  }

}
