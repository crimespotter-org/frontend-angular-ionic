import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CaseDetails} from "../shared/types/supabase";
import {SupabaseService} from "./supabase.service";

@Injectable({
  providedIn: 'root'
})
export class CaseDetailsService {
  private _caseDetails = new BehaviorSubject<CaseDetails | null>(null);
  private returnRoute = new BehaviorSubject<string>('/');

  caseDetails$: Observable<CaseDetails | null> = this._caseDetails.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  async loadCaseDetails(caseId: string): Promise<void> {
    try {
      const caseDetails = await this.supabaseService.getCaseDetails(caseId);
      this._caseDetails.next(caseDetails);
    } catch (error) {
      console.error(error);
      this._caseDetails.next(null);
    }
  }

  setReturnRoute(route: string) {
    this.returnRoute.next(route);
  }

  getReturnRoute() {
    return this.returnRoute.asObservable();
  }
}
