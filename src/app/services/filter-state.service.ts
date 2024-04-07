import {Injectable} from '@angular/core';
import {Filter} from "../shared/interfaces/filter";
import {SupabaseService} from "./supabase.service";
import {BehaviorSubject} from "rxjs";
import {CaseFiltered} from "../shared/types/supabase";
import {FilterOptions} from "../shared/interfaces/filter.options";

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  private _filters = new BehaviorSubject<Filter[]>([]);
  private _filteredCases = new BehaviorSubject<CaseFiltered[]>([]);

  public readonly filters$ = this._filters.asObservable();
  public readonly filteredCases$ = this._filteredCases.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.initializeCases();
  }

  private async initializeCases(): Promise<void> {
    this.applyFilters(); // Führt eine Anfrage ohne Filter durch
  }

  setFilters(newFilters: Filter[]): void {
    this._filters.next([...newFilters]);
    this.applyFilters();
  }

  async applyFilters(): Promise<void> {
    const filters = this._filters.getValue();
    let filterOptions: FilterOptions = this.convertFiltersToFilterOptions(filters);

    const cases = await this.supabaseService.getFilteredCases(filterOptions);
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
          filterOptions.radius = filter.value.radius;
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

  removeFilter(filterToRemove
                 :
                 Filter
  ):
    void {
    const currentFilters = this._filters.getValue();
    const newFilters = currentFilters.filter(f =>
      !(f.type === filterToRemove.type && JSON.stringify(f.value) === JSON.stringify(filterToRemove.value))
    );
    this._filters.next(newFilters);
    this.applyFilters();
  }

  resetFilters()
    :
    void {
    this._filters.next([]);
    this.applyFilters();
  }

  getCurrentFilters()
    :
    Filter[] {
    return this._filters.getValue();
  }
}
