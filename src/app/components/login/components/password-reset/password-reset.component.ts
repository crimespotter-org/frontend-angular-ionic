import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseService} from "../../../../services/supabase.service";
import {
  IonBackButton,
  IonButton, IonButtons,
  IonCard,
  IonCardContent, IonCol,
  IonContent, IonGrid,
  IonHeader, IonInput, IonItem, IonLabel, IonRow, IonSpinner, IonText,
  IonTitle,
  IonToolbar,
  ToastController
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    FormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    NgIf,
    ReactiveFormsModule,
    IonBackButton,
    IonButtons,
    IonSpinner
  ],
  standalone: true
})
export class PasswordResetComponent {
  resetForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const passwordResetSuccess = await this.supabaseService.sendPasswordResetEmail(this.resetForm.get('email')?.value);
    if (passwordResetSuccess) {
      this.showToast('Ein Link zum Zurücksetzen Ihres Passworts wurde gesendet.', 'success');
      this.router.navigate(['login'])
    } else {
      this.showToast('Fehler beim Senden des Links. Prüfen Sie die E-Mail und wenden Sie sich bei mehrmaligem Auftreten an den Support.', 'danger');
    }

    this.loading = false;
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
