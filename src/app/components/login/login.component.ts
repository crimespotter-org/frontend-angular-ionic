import { Component, OnInit } from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {IonButton, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonLabel, IonInput} from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonHeader, IonTitle, IonButton, IonItem, IonContent, FormsModule, IonToolbar, IonLabel, IonInput],
  standalone: true
})
export class LoginComponent{
  email = '';
  password = '';

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async login() {
    const { error } = await this.supabaseService.signIn(this.email, this.password);
    if (error) {
      console.error('Fehler beim Anmelden:', error);
    } else {
      this.router.navigate(['/tabs']);
    }
  }

  toRegister() {
    this.router.navigate(['/register']);
  }
}
