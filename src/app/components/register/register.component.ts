import { Component, OnInit } from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {IonButton, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonLabel, IonInput} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonButton, IonItem, IonContent, FormsModule, IonToolbar, IonLabel, IonInput],
})
export class RegisterComponent  {
  email = '';
  password = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async register() {
    const { error } = await this.supabaseService.signUp(this.email, this.password);
    if (error) {
      console.error('Fehler bei der Registrierung:', error);
    } else {
      this.router.navigate(['/tabs']);
    }
  }

  toLogin() {
    this.router.navigate(['/login']);
  }
}
