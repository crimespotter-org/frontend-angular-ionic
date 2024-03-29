import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
  IonButton,
} from '@ionic/angular/standalone';
import {ProfileEditPage} from "./profile-edit/profile-edit.page";
import {PasswordChangePage} from "./password-change/password-change.page";
import {SupabaseService} from "../services/supabase.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ProfileEditPage, PasswordChangePage, RouterLink],
})
export class Tab3Page {

  constructor(private modalController: ModalController, private supabaseService: SupabaseService, private router: Router) { }

  async openProfileEditModal() {
    const modal = await this.modalController.create({
      component: ProfileEditPage
    });
    return await modal.present();
  }

  async openPasswordChangeModal() {
    const modal = await this.modalController.create({
      component: PasswordChangePage,
    });
    return await modal.present();
  }

  async close() {
    await this.modalController.dismiss();
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
