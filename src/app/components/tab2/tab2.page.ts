import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent, IonFab, IonFabButton, IonIcon
} from '@ionic/angular/standalone';
import {CaselistComponent} from "./components/caselist/caselist.component";
import {FilterSearchComponent} from "../filter-search/filter.search.component";
import {FilterStateService} from "../../services/filter-state.service";
import {Router} from "@angular/router";
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CaselistComponent, IonSearchbar, FilterSearchComponent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon]
})
export class Tab2Page {

  constructor(private filterStateService:FilterStateService, private router: Router, private storageService: StorageService) {}

ngAfterViewInit(){
  console.log(this.storageService.getUserId());
  console.log(this.storageService.getUserEmail());
  console.log(this.storageService.getUserRole());
  console.log(this.storageService.getUsername());
}

  refreshCaselist($event: CustomEvent) {
    this.filterStateService.applyFilters();
    if (event?.target) {
      (event.target as HTMLIonRefresherElement).complete();
    }
  }

  navigateToAddPage() {
    console.log('Navigating to add page');
    this.router.navigate(['add-case-1']);
  }
}
