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
import {CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  add,
  bookOutline,
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
import {Router} from '@angular/router';
import {FilterSearchComponent} from "../../../filter-search/filter.search.component";
import {CaseFiltered} from "../../../../shared/types/supabase";
import {SupabaseService} from "../../../../services/supabase.service";
import {FilterStateService} from "../../../../services/filter-state.service";
import {HelperService} from "../../../../services/helper.service";

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
    IonFab,
    DatePipe
  ],
  standalone: true
})
export class CaselistComponent implements OnInit {

  cases: CaseFiltered[] = [];

  constructor(private supabaseService: SupabaseService, private filterStateService: FilterStateService, private router: Router, protected helperService: HelperService) {
    addIcons({
      bookOutline,
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
    this.router.navigate(['/tabs/tab2/add']);
  }

  upvote(caseId: string) {
    this.supabaseService.upvote(caseId).then(() => {
      this.filterStateService.applyFilters();
    }).catch((error) => {
      console.error(error);
    });
  }

  downvote(caseId: string) {
    this.supabaseService.downvote(caseId).then(() => {
      this.filterStateService.applyFilters();
    }).catch((error) => {
      console.error(error);
    });
  }

}
