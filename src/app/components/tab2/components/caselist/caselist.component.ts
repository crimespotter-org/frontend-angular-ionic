import {Component, OnInit} from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonButtons, IonCol,
  IonContent,
  IonFab,
  IonFabButton, IonGrid,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent, IonRow, LoadingController
} from "@ionic/angular/standalone";
import {CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  add,
  bookOutline,
  chevronDownCircleOutline,
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
import {Router, RouterLink} from '@angular/router';
import {FilterSearchComponent} from "../../../filter-search/filter.search.component";
import {CaseFiltered} from "../../../../shared/types/supabase";
import {SupabaseService} from "../../../../services/supabase.service";
import {FilterStateService} from "../../../../services/filter-state.service";
import {HelperUtils} from 'src/app/shared/helperutils';
import {CaseDetailsService} from "../../../../services/case-details.service";
import {EditCaseService} from 'src/app/services/edit-case.service';
import {UpdaterService} from "../../../../services/updater.service";

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
    DatePipe,
    RouterLink,
    IonRefresher,
    IonRefresherContent,
    IonAvatar,
    IonGrid,
    IonCol,
    IonRow
  ],
  standalone: true
})
export class CaselistComponent implements OnInit {

  HelperUtils = HelperUtils;

  cases: CaseFiltered[] = [];

  constructor(private supabaseService: SupabaseService,
              private caseDetailsService: CaseDetailsService,
              private filterStateService: FilterStateService,
              private router: Router,
              private loadingController: LoadingController,
              private editCaseService: EditCaseService,
              private updater: UpdaterService) {
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
      add,
      chevronDownCircleOutline
    });
  }

  ngOnInit() {
    this.filterStateService.filteredCases$.subscribe(filteredCases => {
      this.cases = filteredCases;
    });
    this.updater.reloadObservable.subscribe(() => {
      this.filterStateService.applyFilters();
    });
  }

  upvote(caseId: string) {
    this.filterStateService.upvoteCase(caseId);
  }

  downvote(caseId: string) {
    this.filterStateService.downvoteCase(caseId);
  }

  async navigateToCaseDetails(caseId: string, event: MouseEvent) {
    await this.presentLoading('Steckbrief wird geladen...');
    try {
      this.caseDetailsService.loadCaseDetails(caseId).then(() => {
        let target: HTMLElement | null = event.target as HTMLElement | null;
        while (target !== null) {
          if (target.classList && target.classList.contains('vote-button')) {
            return;
          }
          target = target.parentElement;
        }
        this.router.navigate(['tabs/tab2/case-details', caseId]);
      })
    } catch (error) {
    } finally {
      await this.dismissLoading();
    }
  }

  async presentLoading(message: string = 'Bitte warten...') {
    const loading = await this.loadingController.create({
      message: message,
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async editCase(caseId: string) {
    await this.presentLoading('Falldaten werden geladen...');
    await this.editCaseService.loadAllCaseData(caseId);
    await this.dismissLoading();
    this.router.navigate(['edit-case', caseId]);
  }
}
