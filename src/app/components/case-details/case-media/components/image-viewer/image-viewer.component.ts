import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent, IonFab, IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {closeOutline} from "ionicons/icons";
import Swiper from "swiper";

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  imports: [
    IonHeader,
    IonButtons,
    IonToolbar,
    IonButton,
    IonContent,
    NgForOf,
    NgIf,
    IonLabel,
    IonInput,
    IonImg,
    IonIcon,
    IonFabButton,
    IonFab
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageViewerComponent implements OnInit{
  @Input() imageUrls: string[] | undefined;
  @Input() activeIndex: number =0;

  constructor(private modalController: ModalController) {
    addIcons({closeOutline});
  }

  ngOnInit() {
    const swiperEl = document.querySelector('swiper-container');

    console.log(swiperEl)
    const swiperParams = {
      loop: true,
      pagination: true,
      navigation: true,
      slidesPerView: 1,
      on: {
        init() {
        },
      },
    };

    if(swiperEl) {
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }


}
