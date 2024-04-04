import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar} from '@ionic/angular/standalone';
import {MapComponent} from "./components/map/map.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, MapComponent, IonSearchbar],
})
export class Tab1Page {

}
