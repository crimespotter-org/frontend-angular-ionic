import {Component, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList
} from "@ionic/angular/standalone";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  add,
  chevronDownOutline,
  chevronUpOutline,
  createOutline,
  imagesOutline,
  layers,
  micCircleOutline,
  newspaperOutline,
  thumbsDownOutline,
  thumbsUpOutline
} from "ionicons/icons";
import {CaseFiltered} from "../../../shared/types/supabase";
import {FilterSearchComponent} from "../../../components/filter.search/filter.search.component";
import {Router} from '@angular/router';
import {FilterStateService} from "../../../services/filter-state.service";

@Component({
  selector: 'app-caselist',
  templateUrl: './caselist.component.html',
  styleUrls: ['./caselist.component.scss'],
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    NgForOf,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonButtons,
    IonButton,
    NgIf,
    CommonModule,
    FilterSearchComponent,
    IonFabButton,
    IonFab
  ],
  standalone: true
})
export class CaselistComponent implements OnInit {
  router = inject(Router);
  filterStateService = inject(FilterStateService);

  cases: CaseFiltered[] = [];

  constructor() {
    addIcons({
      chevronUpOutline,
      chevronDownOutline,
      thumbsUpOutline,
      thumbsDownOutline,
      micCircleOutline,
      newspaperOutline,
      imagesOutline,
      createOutline,
      layers,
      add
    });
  }

  ngOnInit() {
    this.filterStateService.filteredCases$.subscribe(filteredCases => {
      this.cases = filteredCases;
    });
  }

  updateCases(cases: CaseFiltered[]) {
    this.cases = cases;
  }

  navigateToAddPage() {
    console.log('Navigating to add page');
    this.router.navigate(['./tabs/tab2/add']);
  }
}
