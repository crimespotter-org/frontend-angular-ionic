import {Component, Input, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgSwitch} from "@angular/common";
import {CaseFactsEditComponent} from "./case-facts-edit/case-facts-edit.component";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonLabel, IonProgressBar, IonSegment, IonSegmentButton, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {ActivatedRoute, Router} from "@angular/router";
import {addIcons} from "ionicons";
import {checkmarkOutline, chevronBackOutline, shareOutline} from "ionicons/icons";
import {CaseDetailsService} from "../../services/case-details.service";
import {CaseLinksEditComponent} from "./case-links-edit/case-links-edit.component";
import {CaseMediaEditComponent} from "./case-media-edit/case-media-edit.component";
import {Share} from "@capacitor/share";
import {DataService} from "../../services/data.service";
import { EditCaseService } from "src/app/services/edit-case.service";
import {AddCase} from "../../shared/interfaces/addcase.interface";
import {SupabaseService} from "../../services/supabase.service";
import {FurtherLink} from "../../shared/interfaces/further-link.interface";
import { HelperUtils } from "src/app/shared/helperutils";


@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  standalone: true,
  styleUrls: ['./edit-case.component.scss'],
    imports: [
        FormsModule,
        NgSwitch,
        CaseFactsEditComponent,
        CommonModule,
        IonFab,
        IonFabButton,
        IonIcon,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonContent,
        IonTitle,
        IonSegmentButton,
        IonSegment,
        IonLabel,
        CaseLinksEditComponent,
        CaseMediaEditComponent,
        IonBackButton,
        IonProgressBar,
    ]
})
export class EditCaseComponent implements OnInit {
  loading = false;
  caseId: string | null = '';
  segment: string  = 'facts';
  constructor(
    private route: ActivatedRoute,
    private editCaseService: EditCaseService,
    private dataService: DataService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    addIcons({ chevronBackOutline, shareOutline, checkmarkOutline });
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.caseId = this.route.snapshot.paramMap.get('id');
      if (this.caseId) {
       this.editCaseService.loadAllCaseData(this.caseId);
      }
    }
  }

  async updateCase() {


    if(!this.editCaseService.detailsForm.valid){
      console.log('Form is invalid');
      return;
    };

    this.loading = true;

    console.log(this.caseId);


    const caseDetailsForm = this.editCaseService.detailsForm.value;

    const links: FurtherLink[] = this.editCaseService.caseLinks.map((link) => {
      return {
        type: link.link_type,
        value: link.url
      }
    });

    const data: AddCase = {
      title: caseDetailsForm.caseTitle!,
      summary: caseDetailsForm.caseSummary!,
      caseType: caseDetailsForm.caseType!,
      latitude: caseDetailsForm.caseLat!,
      longitude: caseDetailsForm.caseLong!,
      status: caseDetailsForm.caseState!,
      zipCode: caseDetailsForm.caseZipCode!,
      placeName: caseDetailsForm.casePlaceName!,
      crimeDateTime: caseDetailsForm.caseDate!,
      links: links
    };

    console.log(data);


    this.supabaseService.uploadImagesForCase(
      this.caseId!,
      this.editCaseService.newImages.map(image => ({ base64: HelperUtils.dataURItoBase64(image?.dataUrl ?? ''), type: image.format }))
    );

    this.supabaseService.deleteImagesFromCase(this.caseId!, this.editCaseService.imagesToDelete.map(image => image.imageName));


    const state = await this.supabaseService.updateCrimeCase(data, this.caseId!);

    console.log(state);

    this.editCaseService.triggerReload();
    this.router.navigate(['tabs/tab2']);

    this.loading = false;
  }
}

