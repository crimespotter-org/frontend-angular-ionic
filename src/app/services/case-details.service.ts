import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CaseDetails} from "../shared/types/supabase";
import {SupabaseService} from "./supabase.service";

@Injectable({
  providedIn: 'root'
})
export class CaseDetailsService {
  private _caseDetails = new BehaviorSubject<CaseDetails | null>(null);
  private _caseLinks = new BehaviorSubject<string[]>([]);
  private _caseImageUrls = new BehaviorSubject<string[]>([]);
  private _newComment = new BehaviorSubject<any>({});
  private caseComments: any[] = [];

  caseDetails$: Observable<CaseDetails | null> = this._caseDetails.asObservable();
  caseLinks$: Observable<string[]> = this._caseLinks.asObservable();
  caseImageUrls$: Observable<string[]> = this._caseImageUrls.asObservable();
  newComment$: Observable<any> = this._newComment.asObservable();


  constructor(private supabaseService: SupabaseService) {
  }

  async loadCaseDetails(caseId: string): Promise<void> {
    try {
      const caseDetails = await this.supabaseService.getCaseDetails(caseId);
      this._caseDetails.next(caseDetails);
    } catch (error) {
      console.error(error);
      this._caseDetails.next(null);
    }
  }

  async loadCaseLinks(caseId: string): Promise<void> {
    this.supabaseService.getLinksByCaseId(caseId).then(links => {
      this._caseLinks.next(links);
    })
  }

  async loadCaseComments(caseId: string): Promise<void> {
    this.supabaseService.getCommentsByCaseId(caseId).then(comments => {
      this.caseComments = comments;
    })
  }

  async subscribeToCaseComments(caseId: string) {
    this.supabaseService.subscribeToComments(caseId, (newComment: any) => {
      this._newComment.next(newComment);
    });
  }

  async loadCaseImageUrls(caseId: string): Promise<void> {
    this.supabaseService.getImageUrlsForCase(caseId).then(imageUrls => {
      this._caseImageUrls.next(imageUrls);
    })
  }

  getCaseComments (){
    return this.caseComments;
  }
}
