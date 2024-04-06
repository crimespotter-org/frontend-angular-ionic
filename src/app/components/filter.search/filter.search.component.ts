import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
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
import {closeCircle, optionsOutline} from "ionicons/icons";
import {StorageService} from "../../services/storage.service";
import {SupabaseService} from "../../services/supabase.service";
import {DataService} from "../../services/data.service";
import {CaseFiltered} from "../../shared/types/supabase";
import {Filter} from "../../shared/interfaces/filters";
import {FormsModule} from "@angular/forms";
import {FilterOptions} from "../../shared/interfaces/filter.options";
import {Geolocation} from "@capacitor/geolocation";
import {Location} from "../../shared/interfaces/location.interface"

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter.search.component.html',
  styleUrls: ['./filter.search.component.scss'],
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    NgForOf,
    IonItemOption,
    IonItemOptions,
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
export class FilterSearchComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() searchType: 'cases' | 'location' | undefined;

  startDate: Date = new Date("01.01.1900");
  endDate: Date = new Date(Date.now());
  cases: CaseFiltered[] = [];
  location = '';
  locations: any[] = [];
  selectedLocation: any = null;
  selectedCoordinates?: Location;
  enableLocationSearch: boolean = false;
  enableDateRangeSearch: boolean = false;
  useCurrentLocation: boolean = false;
  radius?: number;
  caseTypes: string[] = [];
  selectedCaseTypes?: string[];
  selectedStatus?: string;
  filters: Filter[] = [];
  @Output() emitSearch = new EventEmitter<CaseFiltered[]>();
  @Output() emitLocation = new EventEmitter<Location>();

  constructor(private storageService:
                StorageService, private supabaseService: SupabaseService, private menu: MenuController, private dataService: DataService, @Inject(LOCALE_ID) private locale: string) {
    addIcons({
      closeCircle,
      optionsOutline
    });
  }

  async ngOnInit() {
    await this.loadCases();
    this.emitSearch.emit(this.cases);
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
      filterOptions.currentLat = this.selectedCoordinates?.latitude;
      filterOptions.currentLong = this.selectedCoordinates?.longitude;
      filterOptions.radius = this.radius;
    }

    this.cases = await this.supabaseService.getFilteredCases(filterOptions);

    this.emitSearch.emit(this.cases);
    this.emitLocation.emit(this.selectedCoordinates);

    await this.menu.close('filterMenu');
  }

  checkLocationInput(locationInput: string) {
    this.dataService.getLocationsByPostalCodeOrCity(locationInput).subscribe(
      (response) => {
        this.locations = response.map((location) => {
          return {
            postalCode: location.address.postcode,
            city: location.address.city || location.address.town || location.address.village
          };
        });
      },
      (error) => {
        console.error(error);
        this.locations = [];
      }
    );
  }

  onLocationSelected(location: any) {
    this.selectedLocation = location;
    this.selectedCoordinates = {latitude: location.lat, longitude: location.lon};
  }

  toggleUseCurrentLocation($event: any) {
    if (this.useCurrentLocation) {
      Geolocation.getCurrentPosition().then((position) => {
        this.selectedCoordinates = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        this.emitLocation.emit(this.selectedCoordinates);
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
