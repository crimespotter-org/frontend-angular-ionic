import { Component, OnInit } from '@angular/core';
import {addIcons} from "ionicons";
import {
  keyOutline,
  personOutline,
  pinOutline, trashOutline
} from "ionicons/icons";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss'],
  imports: [
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    RouterLink,
    IonLabel
  ],
  standalone: true
})
export class AccountManagementComponent  implements OnInit {

  constructor() {
    addIcons({keyOutline, personOutline, trashOutline});
  }

  ngOnInit() {}

}
