import {Injectable} from '@angular/core';
import {Filter} from "../shared/interfaces/filter";
import {SupabaseService} from "./supabase.service";
import {BehaviorSubject, Subject} from "rxjs";
import {CaseFiltered} from "../shared/types/supabase";
import {FilterOptions} from "../shared/interfaces/filter.options";
import {Location} from "../shared/interfaces/location.interface";
import {HelperUtils} from "../shared/helperutils";
import {LocationService} from './location.service';

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
  private updateMapTrigger = new Subject<void>();
  private updateMapLocationTrigger = new Subject<void>();

  public updateMapTrigger$ = this.updateMapTrigger.asObservable();
  public updateMapLocationTrigger$ = this.updateMapLocationTrigger.asObservable();
  public readonly filters$ = this._filters.asObservable();
  public readonly filteredCases$ = this._filteredCases.asObservable();
  public readonly searchLocation$ = this._searchLocation.asObservable();
  public readonly searchQuery$ = this._searchQuery.asObservable();

  sortOrder = 'created_at';
  isAscending = false;

  constructor(private supabaseService: SupabaseService, private locationService: LocationService) {
    this.initializeLocation().then(() => {
      this.initializeCases();
    });
  }

  private async initializeCases(): Promise<void> {
    this.applyFilters(this.sortOrder, this.isAscending);
  }

  private async initializeLocation() {
    this.locationService.getInitialLocation().then(x => {
      this._searchLocation.next({latitude: x.location.latitude, longitude: x.location.longitude})
    });
  }

  async setFilters(newFilters: Filter[]) {
    this._filters.next([...newFilters]);
    await this.applyFilters();
  }

  setSearchLocation(location: Location): void {
    this._searchLocation.next(location);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.next(query);
    this.applyFilters();
  }

  async applyFilters(sortOrder?: string, isAscending?: boolean): Promise<void> {
    if (sortOrder) this.sortOrder = sortOrder;
    if (isAscending) this.isAscending = isAscending;

    const filters = this._filters.getValue();
    const searchQuery = this._searchQuery.getValue();

    let filterOptions: FilterOptions = this.convertFiltersToFilterOptions(filters);

    let cases = await this.supabaseService.getFilteredCases(filterOptions);

    if (searchQuery) {
      cases = cases.filter(caze => caze.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    cases = cases.map(caze => {
      if (caze.lat && caze.long) {
        caze.distance_to_location = HelperUtils.calculateDistance(
          {latitude: caze.lat, longitude: caze.long},
          this.locationService.getCurrentLocation().location        );
      }
      return caze;
    });

    this._filteredCases.next(cases);
    if (this.sortOrder && this.isAscending !== undefined) {
      this.sortCases(this.sortOrder, this.isAscending);
    }
  }

  sortCases(sortOrder: string, isAscending: boolean): void {
    this.sortOrder = sortOrder;
    this.isAscending = isAscending;

    const cases = this._filteredCases.getValue();
    let sortedCases;

    switch (sortOrder) {
      case 'title':
        sortedCases = cases.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created_at':
        sortedCases = cases.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'distance_to_location':
        sortedCases = cases.sort((a, b) => a.distance_to_location - b.distance_to_location);
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
        } else if (filter.type === 'crimefluencer' && typeof filter.value !== 'string' && 'username' in filter.value) {
          if (filterOptions.crimefluencerIds == undefined) {
            filterOptions.crimefluencerIds = [];
          }
          filterOptions.crimefluencerIds.push(filter.value.user_id);
        }
      }
    );
    return filterOptions;
  }

  async removeFilter(filterToRemove: Filter) {
    const currentFilters = this._filters.getValue();
    const newFilters = currentFilters.filter(f =>
      !(f.type === filterToRemove.type && JSON.stringify(f.value) === JSON.stringify(filterToRemove.value))
    );
    this._filters.next(newFilters);
    await this.applyFilters();
  }

  resetFilters(): void {
    this._filters.next([]);
    this.applyFilters();
  }

  getCurrentFilters(): Filter[] {
    return this._filters.getValue();
  }

  upvoteCase(caseId: string) {
    const caze = this._filteredCases.value.find(c => c.id === caseId);
    if (caze) {
      this.supabaseService.upvote(caseId).then(x => {
        if (caze.user_vote === -1) {
          caze.downvotes--;
        }
        caze.upvotes++;
        caze.user_vote = 1;
      }).catch((error) => {
        console.error(error);
      });

      this._filteredCases.next(this._filteredCases.value);
    }
  }


  downvoteCase(caseId: string) {
    const caze = this._filteredCases.value.find(c => c.id === caseId);
    if (caze) {
      this.supabaseService.downvote(caseId).then(x => {
        if (caze.user_vote === 1) {
          caze.upvotes--;
        }
        caze.downvotes++;
        caze.user_vote = -1;
      }).catch((error) => {
        console.error(error);
      });

      this._filteredCases.next(this._filteredCases.value);
    }
  }

  public triggerMapUpdate() {
    this.updateMapTrigger.next();
  }

  public triggerMapLocationUpdate() {
    this.updateMapLocationTrigger.next();
  }
}
