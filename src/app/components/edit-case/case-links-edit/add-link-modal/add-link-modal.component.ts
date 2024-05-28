import { Component, OnInit } from '@angular/core';
import {
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToolbar, ModalController,
  IonIcon,
  IonTitle, ToastController
} from "@ionic/angular/standalone";
import {StorageService} from "../../../../services/storage.service";
import {HelperUtils} from "../../../../shared/helperutils";
import {FormsModule} from "@angular/forms";
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

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
    IonButtons,
    IonIcon,
    IonTitle
  ]
})
export class AddLinkModalComponent  implements OnInit {

  HelperUtils = HelperUtils;

  url: string = '';
  selectedLinkType: string = '';
  linktypes: string[] = []

  constructor(private storageService: StorageService, private modalController: ModalController, private toastController: ToastController) {
    addIcons({
      checkmarkOutline,
      closeOutline
    })
  }

  ngOnInit() {
    this.linktypes = this.storageService.getLinkTypes();
  }

  async cancel(){
    await this.modalController.dismiss(null, 'cancel');
  }

  async confirm(){
    if(await this.validValues()){
      await this.modalController.dismiss({url: this.url, type: this.selectedLinkType}, 'confirm');
    }
    else{
      const toast = await this.toastController.create({
        message: 'Bitte geben Sie sowohl einen Typ als auch eine URL ein.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      }
    }

  async validValues(){
    return this.url &&
      this.url.trim().length !== 0 &&
      this.selectedLinkType.length !== 0;
  }

}
