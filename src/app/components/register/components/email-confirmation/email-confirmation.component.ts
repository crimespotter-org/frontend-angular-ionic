import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";
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
import {addIcons} from "ionicons";
import {checkmarkCircleOutline} from "ionicons/icons";

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
  imports: [
    RouterLink,
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
  ],
  standalone: true
})
export class EmailConfirmationComponent {

  constructor() {
    addIcons({
      checkmarkCircleOutline
    })
  }

}
