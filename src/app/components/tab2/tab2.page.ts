import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar} from '@ionic/angular/standalone';
import {CaselistComponent} from "./components/caselist/caselist.component";
import {FilterSearchComponent} from "../filter-search/filter.search.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, CaselistComponent, IonSearchbar, FilterSearchComponent]
})
export class Tab2Page {

  constructor() {}

}
