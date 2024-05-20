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
    private dataService: DataService
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

  updateCase() {
    console.log(this.editCaseService.caseDetails);
    console.log(this.editCaseService.caseLinks);
  }
}

