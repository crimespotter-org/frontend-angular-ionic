import {AfterViewInit, Component, Inject, Input, LOCALE_ID, OnInit} from '@angular/core';
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
  IonModal, IonNote,
  IonRange,
  IonSearchbar, IonSegment, IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  MenuController
} from "@ionic/angular/standalone";
import {CommonModule, DatePipe, formatDate, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {closeCircle, optionsOutline, arrowUpOutline, arrowDownOutline} from "ionicons/icons";
import {FormsModule} from "@angular/forms";
import {FilterStateService} from "../../services/filter-state.service";
import {DataService} from "../../services/data.service";
import {Geolocation} from "@capacitor/geolocation";
import {StorageService} from "../../services/storage.service";
import {Filter} from "../../shared/interfaces/filter";
import {QueryLocationResponse} from "../../shared/interfaces/query-location-response";
import { HelperUtils } from 'src/app/shared/helperutils';


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
    IonToggle,
    IonNote,
    IonSegmentButton,
    IonSegment
  ],
  standalone: true
})
export class FilterSearchComponent implements OnInit {

  HelperUtils = HelperUtils;

  @Input() placeholder: string = '';
  @Input() menuId: string = '';

  filters: Filter[] = [];
  tempFilters: Filter[] = [];
  enableDateRangeSearch: boolean = false;
  startDate?: Date;
  endDate?: Date;
  missingStartDate = false;
  missingEndDate = false;
  missingLocationDetails = false;
  enableLocationSearch: boolean = false;
  useCurrentLocation: boolean = false;
  inputLocation?: any;
  selectedLocation?: any;
  locations: QueryLocationResponse[] = [];
  radius?: number;
  selectedCaseTypes: string[] = [];
  selectedStatus?: string;
  caseTypes: string[] = [];
  searchDebounceTime?: any;
  inputSearch?: any;
  searchList: any[] = [];
  selectedSortOrder = 'created_at';
  segmentValue = 'filter';
  isAscendingSort = false;

  constructor(private menu: MenuController,
              private filterStateService: FilterStateService,
              private dataService: DataService,
              private storageService: StorageService,
              @Inject(LOCALE_ID) private locale: string) {
    addIcons({closeCircle, optionsOutline, arrowUpOutline, arrowDownOutline});
  }

  ngOnInit() {
    this.filterStateService.filters$.subscribe(filters => {
      this.filters = filters;
    });
  }

  initializeFilterVariables() {
    const dateRangeFilter = this.filters.find(f => f.type === 'dateRange');
    this.enableDateRangeSearch = !!dateRangeFilter;
    this.missingStartDate = false;
    this.missingEndDate = false;
    this.missingLocationDetails = false;

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
        this.inputLocation = locationFilter.value.city + (locationFilter.value.postalCode ? ', ' + locationFilter.value.postalCode : '');
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
    let valid = true;

    if (this.enableDateRangeSearch && (!this.startDate || !this.endDate)) {
      this.missingStartDate = !this.startDate;
      this.missingEndDate = !this.endDate;
      valid = false;
    } else if (this.enableDateRangeSearch && this.startDate && this.endDate) {
      this.addTempFilter('dateRange', {start: this.startDate, end: this.endDate});
      this.missingStartDate = false;
      this.missingEndDate = false;
    }

    if (this.enableLocationSearch && (!this.selectedLocation)) {
      this.missingLocationDetails = true;
      valid = false;
    } else if (this.enableLocationSearch) {
      this.missingLocationDetails = false;
      this.addTempFilter('location', {...this.selectedLocation, radius: this.radius})
      this.filterStateService.setSearchLocation({
        latitude: this.selectedLocation.latitude,
        longitude: this.selectedLocation.longitude
      })
    }

    if (this.selectedCaseTypes.length > 0) {
      this.selectedCaseTypes.forEach(caseType => {
        this.addTempFilter('caseType', caseType);
      });
    }

    if (this.selectedStatus) {
      this.addTempFilter('status', this.selectedStatus);
    }

    if (!valid) {
      this.tempFilters = [];
      return;
    }
    this.filterStateService.setFilters([...new Set(this.tempFilters)]);
    this.tempFilters = [];
    this.initializeFilterVariables();

    await this.menu.close(this.menuId);
  }

  applySorting() {
    this.filterStateService.sortCases(this.selectedSortOrder, this.isAscendingSort);
  }

  toggleSortDirection() {
    this.isAscendingSort = !this.isAscendingSort;
    this.filterStateService.sortCases(this.selectedSortOrder, this.isAscendingSort);
  }

  openFilterMenu() {
    this.menu.enable(true, this.menuId);
    this.menu.open(this.menuId).then(() => {
      this.initializeFilterVariables();
    });
    this.caseTypes = this.storageService.getCaseTypes();
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

  toggleEnableDateRangeSearch($event: any) {
    if (!this.enableDateRangeSearch) {
      this.startDate = undefined;
      this.endDate = undefined;
    }
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

  onSearchChange(query: string) {
    clearTimeout(this.searchDebounceTime);

    this.searchDebounceTime = setTimeout(() => {
      if (this.menuId === 'caselistMenu') {
        this.filterStateService.setSearchQuery(query);
      } else {
        this.checkSearchLocationInput(query);
      }
    }, 500);
  }

  onSearchBlur() {
    setTimeout(() => {
      if (this.menuId === 'mapMenu') {
        this.inputSearch = undefined;
        this.searchList = [];
      }
    }, 200);
  }

  onSearchClear() {
    this.filterStateService.setSearchQuery('');
    this.inputSearch = undefined;
    this.searchList = [];
  }

  checkSearchLocationInput(query: string) {
    if (query.length >= 3) {
      this.dataService.getLocationsNominatim(query)
        .subscribe((locations) => {
          this.searchList = locations;
        });
    }
    else {
      this.searchList = []
    }
  }

  onSearchEntrySelected(searchListEntry: any) {
    if ('latitude' in searchListEntry) {
      this.filterStateService.setSearchLocation({
        latitude: searchListEntry.latitude,
        longitude: searchListEntry.longitude
      });
    }
    this.searchList = [];
    this.inputSearch = undefined;
  }

  onLocationFilterSelected(location: QueryLocationResponse) {
    this.selectedLocation = location;
    this.locations = [];
    this.inputLocation = location.city + (location.sub? location.sub : '') + (location.postalCode ? ', ' + location.postalCode : '');
  }

  onLocationFilterChange(searchText: string) {
    clearTimeout(this.searchDebounceTime);

    this.searchDebounceTime = setTimeout(() => {
      this.checkLocationInput(searchText);
    }, 500);
  }

  checkLocationInput(query: string) {
    if (query.length >= 3) {
      this.dataService.getLocationsNominatim(query).subscribe((locations) => {
        this.locations = locations;
      });
    }
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
      return `Ort: ${filterValue.city}, Radius: ${filterValue.radius}km`;
    }
    return ''
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }
}
