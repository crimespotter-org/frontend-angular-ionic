import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {CaselistComponent} from "./components/caselist/caselist.component";
import {HttpClientModule} from "@angular/common/http";
import {FilterSearchComponent} from "../components/filter.search/filter.search.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CaselistComponent, IonSearchbar, FilterSearchComponent]
})
export class Tab2Page {

  constructor() {}

}
