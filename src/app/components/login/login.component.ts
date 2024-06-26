import {Component, OnInit} from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonIcon,
  ToastController,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol, IonToast
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonHeader, IonTitle, IonButton, IonItem, IonContent, FormsModule, IonToolbar, IonLabel, IonInput, NgIf, IonIcon, ReactiveFormsModule, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonGrid, IonRow, IonCol, IonToast, RouterLink],
  standalone: true
})
export class LoginComponent {
  loading: boolean = false;
  showPassword: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private supabaseService: SupabaseService, private router: Router, private toastController: ToastController) {
    addIcons({eye,eyeOff})
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    const {error} = await this.supabaseService.signIn(email, password);
    if (error) {
      console.error('Fehler beim Anmelden:', error);
      this.presentErrorToast('Fehler beim Anmelden. Bitte E-Mail und Passwort prüfen.');
    } else {
      this.router.navigate(['/tabs']);
    }

    this.loading = false;
  }

  presentErrorToast(message: string) {
    this.loading=false;
    this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    }).then(toast => toast.present());
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
