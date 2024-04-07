import {Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
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
import {FormsModule} from "@angular/forms";
import {FilterStateService} from "../../services/filter-state.service";
import {DataService} from "../../services/data.service";
import {Geolocation} from "@capacitor/geolocation";
import {StorageService} from "../../services/storage.service";
import {Filter} from "../../shared/interfaces/filter";


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
  @Input() menuId: string = '';

  filters: Filter[] = [];
  tempFilters: Filter[] = [];
  enableDateRangeSearch: boolean = false;
  startDate?: Date;
  endDate?: Date;
  enableLocationSearch: boolean = false;
  useCurrentLocation: boolean = false;
  inputLocation?: any;
  selectedLocation?: any;
  locations: any[] = [];
  radius?: number;
  selectedCaseTypes: string[] = [];
  selectedStatus?: string;
  caseTypes: string[] = [];

  constructor(private menu: MenuController,
              private filterStateService: FilterStateService,
              private dataService: DataService,
              private storageService: StorageService,
              @Inject(LOCALE_ID) private locale: string) {
    addIcons({closeCircle, optionsOutline});
  }

  ngOnInit() {
    this.filterStateService.filters$.subscribe(filters => {
      this.filters = filters;
    });
    this.caseTypes = this.storageService.getCaseTypes();
  }

  initializeFilterVariables() {
    const dateRangeFilter = this.filters.find(f => f.type === 'dateRange');
    this.enableDateRangeSearch = !!dateRangeFilter;
    if (dateRangeFilter && typeof dateRangeFilter.value !== 'string' && 'start' in dateRangeFilter.value && 'end' in dateRangeFilter.value) {
      this.startDate = new Date(dateRangeFilter.value.start);
      this.endDate = new Date(dateRangeFilter.value.end);
    } else {
      this.startDate = undefined;
      this.endDate = undefined;
    }

    const locationFilter = this.filters.find(f => f.type === 'location');
    this.enableLocationSearch = !!locationFilter;
    if (locationFilter && typeof locationFilter.value !== 'string' && 'city' in locationFilter.value) {
      if (locationFilter.value.city === "Aktueller Ort") {
        this.useCurrentLocation = true;
      } else {
        this.inputLocation = locationFilter.value.postalCode;
        this.selectedLocation = locationFilter.value;
        this.radius = locationFilter.value.radius;
      }
    } else {
      this.inputLocation = undefined;
      this.selectedLocation = undefined;
      this.radius = 1;
    }

    const caseTypeFilter = this.filters.filter(f => f.type === 'caseType');
    this.selectedCaseTypes = caseTypeFilter.map(f => f.value.toString());

    const statusFilter = this.filters.find(f => f.type === 'status');
    this.selectedStatus = statusFilter ? statusFilter.value.toString() : undefined;
  }

  addTempFilter(type: 'caseType' | 'status' | 'dateRange' | 'location', value: any): void {
    this.tempFilters.push({type, value});
  }

  async applyFilters() {
    if (this.enableDateRangeSearch && this.startDate && this.endDate) {
      this.addTempFilter('dateRange', {start: this.startDate, end: this.endDate});
    }

    if (this.enableLocationSearch) {
      this.addTempFilter('location', {...this.selectedLocation, radius: this.radius})
    }

    if (this.selectedCaseTypes.length > 0) {
      this.selectedCaseTypes.forEach(caseType => {
        this.addTempFilter('caseType', caseType);
      });
    }

    if (this.selectedStatus) {
      this.addTempFilter('status', this.selectedStatus);
    }

    this.filterStateService.setFilters([...new Set(this.tempFilters)]);
    this.tempFilters = [];
    this.initializeFilterVariables();

    await this.menu.close(this.menuId);
  }

  openFilterMenu() {
    this.menu.enable(true, this.menuId);
    this.menu.open(this.menuId).then(() => {
      this.initializeFilterVariables();
    });
  }

  removeFilter(filterToRemove: Filter): void {
    this.filterStateService.removeFilter(filterToRemove);
  }

  setStartDate(event: CustomEvent) {
    this.startDate = new Date(event.detail.value);
  }

  setEndDate(event: CustomEvent) {
    this.endDate = new Date(event.detail.value);
  }

  toggleUseCurrentLocation($event: any) {
    Geolocation.getCurrentPosition().then(position => {
      const currentPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.selectedLocation = {
        city: 'Aktueller Ort',
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude
      };
    }).catch(err => {
      console.error(err);
      this.useCurrentLocation = false;
    });
  }

  checkLocationInput(locationInput: string) {
    this.dataService.getLocationsByPostalCodeOrCity(locationInput).subscribe(
      (response) => {
        this.locations = response.map((location) => {
          return {
            postalCode: location.address.postcode,
            city: location.address.city || location.address.town || location.address.village,
            latitude: location.lat,
            longitude: location.lon
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
    this.inputLocation = location.postalCode;
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
    if (typeof filterValue !== 'string' && 'start' in filterValue && 'end' in filterValue) {
      const startDate = formatDate(filterValue.start, 'dd.MM.yyyy', this.locale);
      const endDate = formatDate(filterValue.end, 'dd.MM.yyyy', this.locale);
      return `Datum: ${startDate} - ${endDate}`;
    }
    return '';
  }

  formatLocation(filterValue: Filter['value']): string {
    if (typeof filterValue !== 'string' && 'city' in filterValue) {
      return `Ort: ${filterValue.city}`;
    }
    return ''
  }
}
