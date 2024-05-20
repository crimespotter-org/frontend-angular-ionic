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
  IonIcon, IonLabel, IonSegment, IonSegmentButton, IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {ActivatedRoute, Router} from "@angular/router";
import {addIcons} from "ionicons";
import {chevronBackOutline, shareOutline} from "ionicons/icons";
import {CaseDetailsService} from "../../services/case-details.service";
import {CaseLinksEditComponent} from "./case-links-edit/case-links-edit.component";
import {CaseMediaEditComponent} from "./case-media-edit/case-media-edit.component";
import {Share} from "@capacitor/share";
import {DataService} from "../../services/data.service";
import { EditCaseService } from "src/app/services/edit-case.service";
import {AddCase} from "../../shared/interfaces/addcase.interface";
import {SupabaseService} from "../../services/supabase.service";
import {FurtherLink} from "../../shared/interfaces/further-link.interface";


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
  ]
})
export class EditCaseComponent implements OnInit {
  caseId: string | null = '';
  segment: string  = 'facts';
  constructor(
    private route: ActivatedRoute,
    private editCaseService: EditCaseService,
    private dataService: DataService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    addIcons({ chevronBackOutline, shareOutline });
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

    const links: FurtherLink[] = this.editCaseService.caseLinks.map((link) => {
      return {
        type: link.link_type,
        value: link.url
      }
    });

    const data: AddCase = {
      title: this.editCaseService.caseDetails?.title!,
      summary: this.editCaseService.caseDetails?.summary!,
      caseType: this.editCaseService.caseDetails?.case_type!,
      latitude: this.editCaseService.caseDetails?.lat!,
      longitude: this.editCaseService.caseDetails?.long!,
      status: this.editCaseService.caseDetails?.status!,
      zipCode: this.editCaseService.caseDetails?.zip_code!,
      placeName: this.editCaseService.caseDetails?.place_name!,
      crimeDateTime: this.editCaseService.caseDetails?.crime_date_time!,
      links: links
    };

    console.log(data);

    const state = await this.supabaseService.updateCrimeCase(data, this.caseId!);

    console.log(state);

    this.router.navigate(['tabs/tab2']);
  }
}

