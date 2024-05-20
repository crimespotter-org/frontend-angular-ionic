import { Component, OnInit } from '@angular/core';
import {
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToolbar, ModalController
} from "@ionic/angular/standalone";
import {StorageService} from "../../../../services/storage.service";
import {HelperUtils} from "../../../../shared/helperutils";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-link-modal',
  templateUrl: './add-link-modal.component.html',
  styleUrls: ['./add-link-modal.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonContent,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons
  ]
})
export class AddLinkModalComponent  implements OnInit {

  HelperUtils = HelperUtils;

  url: string = '';
  selectedLinkType: string = '';
  linktypes: string[] = []

  constructor(private storageService: StorageService, private modalController: ModalController) { }

  ngOnInit() {
    this.linktypes = this.storageService.getLinkTypes();
  }

  async cancel(){
    await this.modalController.dismiss(null, 'cancel');
  }

  async confirm(){
    await this.modalController.dismiss({url: this.url, type: this.selectedLinkType}, 'confirm');
  }

}
