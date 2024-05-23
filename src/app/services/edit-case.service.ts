import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CaseDetails } from '../shared/types/supabase';
import {BehaviorSubject, Subject} from 'rxjs';
import { Observable } from 'rxjs';
import { Location } from '../shared/interfaces/location.interface';
import { ImageGet } from '../shared/interfaces/imageGet.interface';
import { Image } from '../shared/interfaces/image.interface';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class EditCaseService {

  constructor(private supabaseService: SupabaseService, private fb: FormBuilder) {
  }

  location!: Location;
  caseDetails?: CaseDetails | null;
  caseLinks: any[] = [];
  images: ImageGet[] = [];
  imagesToDelete: ImageGet[] = [];
  newImages: Photo[] = []

  detailsForm = this.fb.group({
    caseTitle: ['', Validators.required],
    caseSummary: ['', Validators.required],
    caseType: ['', Validators.required],
    caseState: ['', Validators.required],
    caseDate: ['', Validators.required],
    caseLocation: [null as any, Validators.required],
    caseLat: [0, Validators.required],
    caseLong: [0, Validators.required],
    caseZipCode: [0, Validators.required],
    casePlaceName: ['', Validators.required],
  });

  private reloadSubject = new Subject<void>();

  reloadObservable = this.reloadSubject.asObservable();

  async loadAllCaseData(caseId: string): Promise<void> {
    await this.loadCaseDetails(caseId);
    await this.loadCaseLinks(caseId);
    await this.loadCaseImageUrls(caseId);
  }

  async loadCaseDetails(caseId: string): Promise<void> {
    try {
      const caseDetails = await this.supabaseService.getCaseDetails(caseId);
      if(!caseDetails) {
        throw new Error('Case not found');
      }

      this.detailsForm.patchValue({
        caseTitle: caseDetails.title,
        caseSummary: caseDetails.summary,
        caseType: caseDetails.case_type,
        caseState: caseDetails.status,
        caseDate: caseDetails.crime_date_time,
        caseLocation: { latitude: caseDetails.lat, longitude: caseDetails.long },
        caseLat: caseDetails.lat,
        caseLong: caseDetails.long,
        caseZipCode: caseDetails.zip_code,
        casePlaceName: caseDetails.place_name,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async loadCaseLinks(caseId: string): Promise<void> {
    this.supabaseService.getLinksByCaseId(caseId).then(links => {
      this.caseLinks = links;
    })
  }

  async loadCaseImageUrls(caseId: string): Promise<void> {
    this.supabaseService.getImagesForCase(caseId).then(imageUrls => {
      this.images = imageUrls;
    });
  }

  triggerReload(){
    this.reloadSubject.next();
  }
}
