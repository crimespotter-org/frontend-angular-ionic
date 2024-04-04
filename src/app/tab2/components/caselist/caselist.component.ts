import { Component } from '@angular/core';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList, IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList, IonSearchbar, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-caselist',
  templateUrl: './caselist.component.html',
  styleUrls: ['./caselist.component.scss'],
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    NgForOf

  ],
  standalone: true
})
export class CaselistComponent   {

  constructor() { }


  faelle = [
    { titel: 'Fall 1', zusammenfassung: 'Zusammenfassung von Fall 1' },
    { titel: 'Fall 2', zusammenfassung: 'Zusammenfassung von Fall 2' },
  ];

}
