import {Component, Input, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-avatar-viewer',
  templateUrl: './avatar-viewer.component.html',
  styleUrls: ['./avatar-viewer.component.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent
  ],
  standalone: true
})
export class AvatarViewerComponent{

  @Input() avatarImage: string | undefined;

  constructor(private modalController: ModalController) {
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
