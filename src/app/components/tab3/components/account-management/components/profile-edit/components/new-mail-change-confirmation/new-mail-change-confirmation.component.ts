import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonCard, IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader, IonIcon,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {checkmarkCircleOutline} from "ionicons/icons";

@Component({
  selector: 'app-new-mail-change-confirmation',
  templateUrl: './new-mail-change-confirmation.component.html',
  styleUrls: ['./new-mail-change-confirmation.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonButton,
    RouterLink
  ],
  standalone: true
})
export class NewMailChangeConfirmationComponent {

  constructor() {
    addIcons({
      checkmarkCircleOutline
    })
  }

}
