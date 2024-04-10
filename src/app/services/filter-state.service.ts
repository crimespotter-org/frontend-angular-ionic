import {Injectable} from '@angular/core';
import {Filter} from "../shared/interfaces/filter";
import {SupabaseService} from "./supabase.service";
import {BehaviorSubject, Subject} from "rxjs";
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
  private updateTrigger = new Subject<void>();

  public updateTrigger$ = this.updateTrigger.asObservable();
  public readonly filters$ = this._filters.asObservable();
  public readonly filteredCases$ = this._filteredCases.asObservable();
  public readonly searchLocation$ = this._searchLocation.asObservable();
  public readonly searchQuery$ = this._searchQuery.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initializeCases();
    this.initializeLocation();
  }

  private async initializeCases(): Promise<void> {
    this.applyFilters('created_at', false);
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
    this.applyFilters();
  }

  async applyFilters(sortOrder?: string, isAscending?: boolean): Promise<void> {
    const filters = this._filters.getValue();
    const searchQuery = this._searchQuery.getValue();

    let filterOptions: FilterOptions = this.convertFiltersToFilterOptions(filters);

    let cases = await this.supabaseService.getFilteredCases(filterOptions);

    if (searchQuery) {
      cases = cases.filter(caze => caze.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    this._filteredCases.next(cases);
    if (sortOrder && isAscending) {
      this.sortCases(sortOrder, isAscending);
    }
  }

  sortCases(sortOrder: string, isAscending: boolean): void {
    const cases = this._filteredCases.getValue();
    let sortedCases;

    switch (sortOrder) {
      case 'title':
        sortedCases = cases.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created_at':
        sortedCases = cases.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'crime_date_time':
        sortedCases = cases.sort((a, b) => new Date(a.crime_date_time).getTime() - new Date(b.crime_date_time).getTime());
        break;
      default:
        sortedCases = cases;
    }

    if (!isAscending) {
      sortedCases = sortedCases.reverse();
    }

    this._filteredCases.next(sortedCases);
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

  async goToCurrentLocation() {
    await this.initializeLocation();
  }

  public triggerMapUpdate() {
    this.updateTrigger.next();
  }
}
