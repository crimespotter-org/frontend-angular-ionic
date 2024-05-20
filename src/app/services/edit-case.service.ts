import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseDetails } from '../shared/types/supabase';

@Injectable({
  providedIn: 'root'
})
export class EditCaseService {

  constructor(private supabaseService: SupabaseService, private fb: FormBuilder) {
  }

  caseDetails?: CaseDetails | null;
  caseLinks: any[] = [];
  caseComments: any[] = [];
  imageUrls: string[] = [];

  async loadAllCaseData(caseId: string): Promise<void> {
    await this.loadCaseDetails(caseId);
    await this.loadCaseLinks(caseId);
    await this.loadImageUrls(caseId);
  }

  async loadCaseDetails(caseId: string): Promise<void> {
    this.caseDetails = await this.supabaseService.getCaseDetails(caseId);
  }

  async loadCaseLinks(caseId: string): Promise<void> {
    this.caseLinks = await this.supabaseService.getLinksByCaseId(caseId);
  }


  async loadImageUrls(caseId: string): Promise<void> {
     this.imageUrls = await this.supabaseService.getImageUrlsForCase(caseId);
  }
}
