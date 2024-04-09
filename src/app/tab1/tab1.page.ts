import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar} from '@ionic/angular/standalone';
import {MapComponent} from "./components/map/map.component";
import {FilterSearchComponent} from "../components/filter.search/filter.search.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, MapComponent, IonSearchbar, FilterSearchComponent],
})
export class Tab1Page {

}
