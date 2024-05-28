import { Component } from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar} from '@ionic/angular/standalone';
import {MapComponent} from "./components/map/map.component";
import {FilterSearchComponent} from "../filter-search/filter.search.component";
import {FilterStateService} from "../../services/filter-state.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, MapComponent, IonSearchbar, FilterSearchComponent],
})
export class Tab1Page {

  constructor(private filterStateService: FilterStateService) {}

  ionViewDidEnter() {
    this.filterStateService.triggerMapUpdate();
  }

  ionViewWillLeave() {
    this.filterStateService.triggerMapLocationUpdate();
  }
}
