import {Component} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  ModalController,
  IonButton, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonToggle,
} from '@ionic/angular/standalone';
import {ProfileEditPage} from "./components/account-management/components/profile-edit/profile-edit.page";
import {PasswordChangePage} from "./components/account-management/components/password-change/password-change.page";
import {SupabaseService} from "../../services/supabase.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {addIcons} from "ionicons";
import {closeOutline, exit, lockClosed, moon, notifications, personCircle} from "ionicons/icons";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ProfileEditPage, PasswordChangePage, RouterLink, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonToggle, FormsModule],
})
export class Tab3Page {
  settings = {
    notifications: true,
    darkMode: false
  };

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private modalController: ModalController
  ) {
    addIcons({moon, notifications, lockClosed, personCircle, exit});
  }

  toggleNotifications() {
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
