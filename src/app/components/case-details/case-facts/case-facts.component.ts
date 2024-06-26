import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonCol, IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonRow, IonText
} from "@ionic/angular/standalone";
import {CaseDetailsService} from "../../../services/case-details.service";
import { HelperUtils } from 'src/app/shared/helperutils';
import {
  fingerPrint,
  lockOpenOutline,
  lockClosedOutline
} from "ionicons/icons";
import {addIcons} from "ionicons";

@Component({
  selector: 'app-case-facts',
  templateUrl: './case-facts.component.html',
  styleUrls: ['./case-facts.component.scss'],
    imports: [
        IonCard,
        IonCardTitle,
        IonCardHeader,
        IonCardContent,
        DatePipe,
        IonCardSubtitle,
        IonChip,
        IonBadge,
        IonRow,
        IonButton,
        IonCol,
        IonIcon,
        IonItem,
        IonLabel,
        NgIf,
        IonText,
        IonAvatar,
        IonGrid
    ],
  standalone: true
})
export class CaseFactsComponent implements OnInit {

  caseDetails: any

  constructor(private caseDetailsService: CaseDetailsService) {
    addIcons({
      fingerPrint,
      lockOpenOutline,
      lockClosedOutline
    });
  }

  ngOnInit() {
    this.caseDetailsService.caseDetails$.subscribe(caseDetails => {
      this.caseDetails = caseDetails;
    });
  }

  protected readonly HelperUtils = HelperUtils;
}
