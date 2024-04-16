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
import {CaseDetailsService} from "../../services/case-details.service";
import {CaseLinksComponent} from "./case-links/case-links.component";
import {CaseMediaComponent} from "./case-media/case-media.component";
import {CaseChatComponent} from "./case-chat/case-chat.component";


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
    IonLabel,
    CaseLinksComponent,
    CaseMediaComponent,
    CaseChatComponent
  ],
  standalone: true
})
export class CaseDetailsComponent implements OnInit {
  returnRoute: string = '';
  caseId: string | null = '';
  segment: string  = 'facts';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseDetailsService: CaseDetailsService
  ) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.caseId = this.route.snapshot.paramMap.get('id');
      if (this.caseId) {
        this.caseDetailsService.loadCaseDetails(this.caseId);
      }
    }

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state && 'returnRoute' in currentNavigation.extras.state) {
      this.returnRoute = currentNavigation.extras.state['returnRoute'];
    }
  }

  goBack() {
    this.router.navigateByUrl(this.returnRoute);
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

}
