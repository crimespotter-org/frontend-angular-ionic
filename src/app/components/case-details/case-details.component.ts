import {Component, Input, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgSwitch} from "@angular/common";
import {CaseFactsComponent} from "./case-facts/case-facts.component";
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
import {CaseLinksComponent} from "./case-links/case-links.component";
import {CaseMediaComponent} from "./case-media/case-media.component";
import {CaseChatComponent} from "./case-chat/case-chat.component";
import {Share} from "@capacitor/share";
import {DataService} from "../../services/data.service";


@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  standalone: true,
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
    CaseChatComponent,
    IonBackButton
  ]
})
export class CaseDetailsComponent implements OnInit {
  caseId: string | null = '';
  segment: string  = 'facts';
  constructor(
    private route: ActivatedRoute,
    private caseDetailsService: CaseDetailsService
  ) {
    addIcons({ chevronBackOutline, shareOutline });
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.caseId = this.route.snapshot.paramMap.get('id');
      if (this.caseId) {
        this.caseDetailsService.loadCaseDetails(this.caseId);
        this.caseDetailsService.loadCaseLinks(this.caseId);
        this.caseDetailsService.loadCaseComments(this.caseId);
        this.caseDetailsService.subscribeToCaseComments(this.caseId);
        this.caseDetailsService.loadCaseImageUrls(this.caseId);
      }
    }
  }

  async shareCase() {
    if (this.caseId) {
      const longUrl = `https://crimespotter.bvrx.de/case-details/${this.caseId}`;
      try {
        await this.share(longUrl);
      } catch (error) {
        console.error('Error beim Teilen der Case Details:', error);
        await this.share(longUrl);
      }
    }
  }

  private async share(url: string) {
    await Share.share({
      title: 'Teile diesen Fall',
      text: 'Schau dir diesen interessanten Fall bei Crimespotter an:',
      url: url,
      dialogTitle: 'Teile den Link zu diesem Fall'
    });
  }

}
