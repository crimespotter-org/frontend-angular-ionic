import {Component, Input, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgSwitch} from "@angular/common";
import {CaseFactsComponent} from "./case-facts/case-facts.component";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon, IonLabel, IonSegment, IonSegmentButton, IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {CaseDetails} from "../../shared/types/supabase";
import {ActivatedRoute, Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";
import {addIcons} from "ionicons";
import {chevronBackOutline} from "ionicons/icons";


@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  imports: [
    FormsModule,
    NgSwitch,
    CaseFactsComponent,
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
    IonLabel
  ],
  standalone: true
})
export class CaseDetailsComponent implements OnInit {
  @Input() returnRoute: string = '/';

  caseDetails?: CaseDetails;
  segment: string = 'facts';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.loadCaseDetails(caseId);
    }

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state && 'returnRoute' in currentNavigation.extras.state) {
      this.returnRoute = currentNavigation.extras.state['returnRoute'];
    }
  }

  goBack() {
    console.log(this.returnRoute)
    this.router.navigateByUrl(this.returnRoute);
  }

  async loadCaseDetails(caseId: string): Promise<void> {
    this.supabaseService.getCaseDetails(caseId).then((caseDetail) => {
      if (caseDetail) {
        this.caseDetails = caseDetail;
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

}
