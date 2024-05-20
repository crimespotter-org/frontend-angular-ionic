import {Component} from '@angular/core';
import {addIcons} from "ionicons";
import {keyOutline, personOutline, trashOutline} from "ionicons/icons";
import {
  ActionSheetController,
  IonAvatar, IonBackButton, IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController, ToastController
} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";
import {AvatarViewerComponent} from "./components/avatar-viewer/avatar-viewer.component";
import {Camera, CameraResultType} from "@capacitor/camera";
import {StorageService} from "../../../../services/storage.service";
import {SupabaseService} from "../../../../services/supabase.service";
import {HelperUtils} from "../../../../shared/helperutils";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss'],
  imports: [
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    RouterLink,
    IonLabel,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonBackButton,
    IonButtons
  ],
  standalone: true
})
export class AccountManagementComponent {
  userName: string | null = '';
  userId: string | null = '';
  userEmail: string | null = '';
  userAvatar: string | null = ''

  constructor(private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private storageService: StorageService,
              private supabaseService: SupabaseService,
              private toastController: ToastController) {
    addIcons({keyOutline, personOutline, trashOutline});
    this.userName = this.storageService.getUsername();
    this.userId = this.storageService.getUserId();
    this.userEmail = this.storageService.getUserEmail();
    this.userAvatar = this.storageService.getUserAvatarUrl();
  }

  async onAvatarClick() {
    const alert = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Ansehen',
          handler: () => {
            this.viewAvatar();
          }
        },
        {
          text: 'Ändern',
          handler: () => {
            this.changeAvatar();
          }
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => {
            this.deleteAvatar();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async viewAvatar() {
    const modal = await this.modalController.create({
      component: AvatarViewerComponent,
      componentProps: {avatarImage: this.avatarImage}
    });
    return await modal.present();
  }

  async changeAvatar() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    if (image && this.userId) {
      await this.supabaseService.deleteUserAvatar(this.userId);
      await this.supabaseService.uploadUserAvatar({
        base64: HelperUtils.dataURItoBase64(image?.dataUrl ?? ''),
        type: image.format
      }, this.userId).then(() => {
        if (this.userId) {
          this.supabaseService.getAvatarUrlForUser(this.userId).then(url => {
            this.storageService.saveUserAvatarUrl(url)
            this.userAvatar = url
            this.showToast("Das Profilbild wurde aktualisiert..", 'success')
          })
        }
      });
    }
  }

  async deleteAvatar() {
    if (this.userId) {
      await this.supabaseService.deleteUserAvatar(this.userId).then(() => {
        this.storageService.saveUserAvatarUrl('assets/icon/avatar.svg')
        this.userAvatar = 'assets/icon/avatar.svg';
        }
      )
      this.showToast("Das Profilbild wurde gelöscht.", 'danger')
    }
  }

  get avatarImage() {
    return this.userAvatar !== '' ? this.userAvatar : 'assets/icon/avatar.svg';
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
