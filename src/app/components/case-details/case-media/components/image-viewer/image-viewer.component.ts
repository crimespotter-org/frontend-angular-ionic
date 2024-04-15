import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild,} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
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
import {close} from "ionicons/icons";

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
    IonIcon
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageViewerComponent {
  @Input() imageUrls: string[] | undefined;
  @Input() activeIndex: number =0;
  constructor(private modalController: ModalController) {
    addIcons({close});
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
