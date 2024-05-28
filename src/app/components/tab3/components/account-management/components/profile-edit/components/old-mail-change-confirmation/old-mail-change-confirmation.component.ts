import { Component} from '@angular/core';
import {addIcons} from "ionicons";
import {mailOpenOutline} from "ionicons/icons";
import {IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-old-mail-change-confirmation',
  templateUrl: './old-mail-change-confirmation.component.html',
  styleUrls: ['./old-mail-change-confirmation.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonIcon
  ],
  standalone: true
})
export class OldMailChangeConfirmationComponent{

  constructor() {
    addIcons({
      mailOpenOutline
    })
  }

}
