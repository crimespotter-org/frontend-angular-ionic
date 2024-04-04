import {Component} from '@angular/core';
import {
  IonButton,
  IonButtons, IonChip,
  IonContent, IonDatetime,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList, IonMenu,
  IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar, MenuController
} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  add,
  calendar, closeCircle,
  createOutline,
  imagesOutline,
  layers,
  locate,
  micCircleOutline,
  optionsOutline,
  newspaperOutline,
  pin,
  pricetag,
  thumbsDownOutline,
  thumbsUpOutline
} from "ionicons/icons";


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
    NgForOf,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonButtons,
    IonButton,
    IonDatetime,
    IonMenu,
    IonChip,
    IonSelect,
    IonSelectOption

  ],
  standalone: true
})
export class CaselistComponent {

  constructor(private menu: MenuController) {
    addIcons({
      thumbsUpOutline,
      thumbsDownOutline,
      micCircleOutline,
      newspaperOutline,
      imagesOutline,
      closeCircle,
      createOutline,
      calendar,
      layers,
      optionsOutline,
      pricetag,
      locate,
      pin,
      add
    });
  }


  faelle = [
    {titel: 'Fall 1', zusammenfassung: 'Zusammenfassung von Fall 1'},
    {titel: 'Fall 2', zusammenfassung: 'Zusammenfassung von Fall 2'},
  ];

  openFilterMenu() {
    this.menu.enable(true, 'filterMenu');
    this.menu.open('filterMenu');
  }

  applyFilters() {

    this.menu.close('filterMenu');
  }

  //removeFilter(filter) {
    // Entfernen Sie den Filter aus der Liste der angewendeten Filter
    //this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
    // Aktualisieren Sie Ihre Liste entsprechend
  //}
}
