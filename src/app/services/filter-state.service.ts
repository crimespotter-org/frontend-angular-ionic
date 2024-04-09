import {Injectable} from '@angular/core';
import {Filter} from "../shared/interfaces/filter";
import {SupabaseService} from "./supabase.service";
import {BehaviorSubject} from "rxjs";
import {CaseFiltered} from "../shared/types/supabase";
import {FilterOptions} from "../shared/interfaces/filter.options";
import {Location} from "../shared/interfaces/location.interface";
import {Geolocation} from "@capacitor/geolocation";

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private _filters = new BehaviorSubject<Filter[]>([]);
  private _filteredCases = new BehaviorSubject<CaseFiltered[]>([]);
  private _searchLocation: BehaviorSubject<Location> = new BehaviorSubject<Location>({
    latitude: 52.5200,
    longitude: 13.4050
  });
  private _searchQuery = new BehaviorSubject<string>('');

  public readonly filters$ = this._filters.asObservable();
  public readonly filteredCases$ = this._filteredCases.asObservable();
  public readonly searchLocation$ = this._searchLocation.asObservable();
  public readonly searchQuery$ = this._searchQuery.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initializeCases();
    this.initializeLocation();
  }

  private async initializeCases(): Promise<void> {
    this.applyFilters(); // Führt eine Anfrage ohne Filter durch
  }

  private async initializeLocation() {
    const userPosition = await Geolocation.getCurrentPosition();
    this._searchLocation.next({latitude: userPosition.coords.latitude, longitude: userPosition.coords.longitude})
  }

  setFilters(newFilters: Filter[]): void {
    this._filters.next([...newFilters]);
    this.applyFilters();
  }

  setSearchLocation(location: Location): void {
    this._searchLocation.next(location);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.next(query);
    this.applyFilters(); // Aktualisiere die gefilterten Fälle basierend auf dem neuen Suchtext
  }

  async applyFilters(): Promise<void> {
    const filters = this._filters.getValue();
    const searchQuery = this._searchQuery.getValue();

    console.log(filters)

    let filterOptions: FilterOptions = this.convertFiltersToFilterOptions(filters);

    let cases = await this.supabaseService.getFilteredCases(filterOptions);

    if (searchQuery) {
      cases = cases.filter(caze => caze.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    this._filteredCases.next(cases);
  }

  convertFiltersToFilterOptions(filters: Filter[]): FilterOptions {
    const filterOptions: FilterOptions = {};
    filters.forEach(filter => {
        if (filter.type === 'dateRange' && typeof filter.value !== 'string' && 'start' in filter.value) {
          filterOptions.startDate = filter.value.start;
          filterOptions.endDate = filter.value.end;
        } else if (filter.type === 'location' && typeof filter.value !== 'string' && 'city' in filter.value) {
          filterOptions.currentLat = filter.value.latitude;
          filterOptions.currentLong = filter.value.longitude;
          filterOptions.radius = filter.value.radius * 1000;
        } else if (filter.type === 'caseType' && typeof filter.value === 'string') {
          if (filterOptions.caseTypes == undefined) {
            filterOptions.caseTypes = [];
          }
          filterOptions.caseTypes.push(filter.value);
        } else if (filter.type === 'status' && typeof filter.value === 'string') {
          filterOptions.status = filter.value;
        }
      }
    );
    return filterOptions;
  }

  removeFilter(filterToRemove: Filter): void {
    const currentFilters = this._filters.getValue();
    const newFilters = currentFilters.filter(f =>
      !(f.type === filterToRemove.type && JSON.stringify(f.value) === JSON.stringify(filterToRemove.value))
    );
    this._filters.next(newFilters);
    this.applyFilters();
  }

  resetFilters(): void {
    this._filters.next([]);
    this.applyFilters();
  }

  getCurrentFilters(): Filter[] {
    return this._filters.getValue();
  }

  async goToCurrentLocation(){
    await this.initializeLocation();
  }
}