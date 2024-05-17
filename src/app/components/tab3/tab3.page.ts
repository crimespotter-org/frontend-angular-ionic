import {Component, OnInit} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
  IonButton, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonToggle, IonSegment, IonSegmentButton,
} from '@ionic/angular/standalone';
import {ProfileEditPage} from "./components/account-management/components/profile-edit/profile-edit.page";
import {PasswordChangePage} from "./components/account-management/components/password-change/password-change.page";
import {SupabaseService} from "../../services/supabase.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {addIcons} from "ionicons";
import {invertModeOutline, exit, lockClosed, moon, notifications, personCircle} from "ionicons/icons";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ProfileEditPage, PasswordChangePage, RouterLink, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonToggle, FormsModule, IonSegment, IonSegmentButton, NgIf],
})
export class Tab3Page {
  colorModeAuto: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    addIcons({moon, notifications, lockClosed, personCircle, exit, invertModeOutline});
    this.initializeMode();
  }

  initializeMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentMode = localStorage.getItem('colormode');
    this.colorModeAuto = currentMode ? JSON.parse(currentMode) : true;
    if (!this.colorModeAuto) {
      const currentSetting = localStorage.getItem('darkMode');
      if (currentSetting === 'true') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }

  isDarkMode() {
    return document.body.classList.contains('dark');
  }

  toggleNotifications() {
  }

  toggleMode() {
    this.colorModeAuto = !this.colorModeAuto;
    localStorage.setItem('colormode', String(this.colorModeAuto));
    if (this.colorModeAuto) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    } else {
      this.initializeMode();
    }
  }

  toggleDarkMode(event: any) {
    document.body.classList.toggle('dark', event.detail.checked);
    localStorage.setItem('darkMode', event.detail.checked);
  }

  navigateTo(page: string) {
    this.router.navigate([`tabs/tab3/${page}`]);
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
