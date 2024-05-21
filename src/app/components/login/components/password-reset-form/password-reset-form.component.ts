import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseService} from "../../../../services/supabase.service";
import {
  IonButton,
  IonCard,
  IonCardContent, IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonRow, IonSpinner, IonText,
  IonTitle,
  IonToolbar,
  ToastController
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
    IonCardContent,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
    NgIf,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner
  ],
  standalone: true
})
export class PasswordResetFormComponent implements OnInit {
  resetForm: FormGroup;
  loading: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  accessToken = '';
  refreshToken = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator()});
  }

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation()?.extras.state;
    if (routerState) {
      this.accessToken = routerState['accessToken'];
      this.refreshToken = routerState['refreshToken'];
    }
  }

  passwordMatchValidator() {
    return (group: FormGroup) => {
      const newPass = group.controls['newPassword'].value;
      const confirmPass = group.controls['confirmPassword'].value;
      return newPass === confirmPass ? null : {mismatch: true};
    };
  }

  async resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.loading = true;

    const {newPassword, confirmPassword} = this.resetForm.value;

    this.supabaseService.setSession(this.accessToken, this.refreshToken);

    const updatePassword = await this.supabaseService.updatePassword(newPassword);

    await this.supabaseService.signOut();

    if (updatePassword.length > 0) {
      this.showToast(updatePassword, 'danger');
    } else {
      this.showToast('Passwort erfolgreich geändert', 'success');
    }

    this.router.navigate(['/login'])

    this.loading = false;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'newPassword') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
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
