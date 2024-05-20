import {Component, Input, OnInit} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  AlertController,
  AlertInput, ModalController
} from "@ionic/angular/standalone";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {SupabaseService} from "../../../services/supabase.service";
import {addIcons} from "ionicons";
import {
  bookOutline,
  linkOutline,
  micCircleOutline,
  micOutline,
  newspaperOutline,
  openOutline,
  trashOutline
} from "ionicons/icons";
import {HelperUtils} from "../../../shared/helperutils";
import {Browser} from "@capacitor/browser"
import {CaseDetailsService} from "../../../services/case-details.service";
import { EditCaseService } from 'src/app/services/edit-case.service';
import { StorageService } from 'src/app/services/storage.service';
import {AddLinkModalComponent} from "./add-link-modal/add-link-modal.component";

@Component({
  selector: 'app-case-links-edit',
  templateUrl: './case-links-edit.component.html',
  styleUrls: ['./case-links-edit.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    NgForOf,
    IonItemSliding,
    IonGrid,
    IonRow,
    IonCard,
    IonCol,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TitleCasePipe,
    IonText,
    NgIf
  ],
  standalone: true
})
export class CaseLinksEditComponent implements OnInit {
  @Input() caseId: any;
  linkGroups: any[] = [];
  types: string[] = [];
  linksToDelete: any[] = [];

  allLinks: any[] = [];

  constructor(private editCaseService: EditCaseService, private alertController: AlertController, private storageService: StorageService, private modalController: ModalController) {
    addIcons({
      bookOutline,
      micCircleOutline,
      newspaperOutline,
      linkOutline,
      openOutline,
      micOutline,
      trashOutline
    });
  }

  ngOnInit() {
    this.types = this.storageService.getLinkTypes()
    this.allLinks.push(...this.editCaseService.caseLinks);
    this.groupLinksByType(this.allLinks);
  }

  groupLinksByType(links: any []) {
    const groups = links.reduce((acc, link) => {
      const type = link.link_type || 'other';
      if (!acc[type]) {
        acc[type] = {
          type: type,
          links: []
        };
      }
      acc[type].links.push(link);
      return acc;
    }, {});

    this.linkGroups = Object.values(groups);
  }


  async addLink(){
    const modal = await this.modalController.create({
      component: AddLinkModalComponent,
      cssClass: 'modal',
    });

    modal.present();

    const {data, role} = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.allLinks.push({link_type: data.type, url: data.url, new: true});
      console.log(this.allLinks);
      this.groupLinksByType(this.allLinks);
    }
  }


  protected readonly HelperUtils = HelperUtils;

  removeLink(link: any) {
      this.allLinks = this.allLinks.filter((l: any) => l !== link);
      this.linksToDelete.push(link);
      this.groupLinksByType(this.allLinks);
  }
}
