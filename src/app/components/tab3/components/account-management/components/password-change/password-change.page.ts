import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons, IonCard, IonCardContent, IonCol,
  IonContent, IonGrid, IonHeader, IonIcon,
  IonInput,
  IonItem,
  IonLabel, IonRow, IonSpinner, IonText,
  IonTitle,
  IonToolbar, ToastController
} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {SupabaseService} from "../../../../../../services/supabase.service"
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";
import {StorageService} from "../../../../../../services/storage.service";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, IonBackButton, IonGrid, IonCol, IonRow, IonSpinner, ReactiveFormsModule, IonCardContent, IonCard, IonText, IonIcon]
})
export class PasswordChangePage {
  passwordForm: FormGroup;
  loading: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword1: boolean = false;
  showNewPassword2: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private toastController: ToastController,
    private router: Router,
    private storageService: StorageService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validators: [this.newPasswordMatchValidator(), this.oldPasswordMatchValidator()]});
    addIcons({eye, eyeOff})
  }

  newPasswordMatchValidator() {
    return (group: FormGroup) => {
      const newPass = group.controls['newPassword'].value;
      const confirmPass = group.controls['confirmPassword'].value;
      return newPass === confirmPass ? null : {'mismatch': true};
    };
  }

  oldPasswordMatchValidator() {
    return (group: FormGroup) => {
      const newPass = group.controls['newPassword'].value;
      const currentPass = group.controls['currentPassword'].value;
      return newPass === currentPass ? {'mismatchOld': true} : null;
    };
  }

  async changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const {currentPassword, newPassword} = this.passwordForm.value;
    const email = this.storageService.getUserEmail() ?? '';

    const oldPasswordValid = await this.supabaseService.signInPasswordCheck(email, currentPassword);

    if (oldPasswordValid) {

      const updatePassword = await this.supabaseService.updatePassword(newPassword);

      if (updatePassword.length > 0) {
        this.showToast('Passwort konnte nicht geändert werden.', 'danger');
      } else {
        this.showToast('Passwort erfolgreich geändert', 'success');
        this.router.navigate(['/tabs/tab3/account-management']);
      }
    } else {
      this.showToast('Passwort konnte nicht geändert werden. Altes Passwort prüfen.', 'danger');
    }

    this.loading = false;
  }

  togglePasswordVisibility(passwordType: string) {
    if (passwordType === 'oldPassword') {
      this.showOldPassword = !this.showOldPassword;
    } else if (passwordType === 'newPassword1') {
      this.showNewPassword1 = !this.showNewPassword1;
    } else if (passwordType === 'newPassword2') {
      this.showNewPassword2 = !this.showNewPassword2;
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
