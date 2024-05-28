import {Component,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SupabaseService} from "../../../../../../services/supabase.service";
import {
  IonBackButton, IonButton,
  IonButtons, IonCard, IonCardContent, IonCol,
  IonContent, IonGrid,
  IonHeader, IonInput, IonItem, IonLabel, IonRow, IonSpinner, IonText,
  IonTitle,
  IonToolbar,
  ToastController
} from "@ionic/angular/standalone";
import {StorageService} from "../../../../../../services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonBackButton, IonButtons, IonHeader, IonToolbar, IonContent, IonTitle, IonCardContent, IonCard, IonItem, IonLabel, IonInput, IonText, IonGrid, IonRow, IonButton, IonCol, IonSpinner]
})
export class ProfileEditPage {
  profileForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private supabaseService: SupabaseService,
              private toastController: ToastController,
              private storageService: StorageService,
              private router: Router) {
    this.profileForm = this.fb.group({
      username: [''],
      email: ['', [Validators.email]]
    }, {validators: this.profileEditValidator()});
  }

  profileEditValidator() {
    return (group: FormGroup) => {
      const username = group.controls['username'].value;
      const email = group.controls['email'].value;
      return username.length === 0 && email.length === 0 ? {'empty': true} : null;
    };
  }

  async updateProfile() {


    this.loading = true;
    const values = this.profileForm.value;

    let result: string = '';

    if (values.username) {
      const updateUsername = await this.supabaseService.updateUsername(values.username);
      if (updateUsername.length === 0) this.storageService.saveUsername(values.username);
      result = result + updateUsername;
    }
    if (values.email) {
      result = result + await this.supabaseService.updateEmail(values.email);
    }
    if (result.length > 0) {
      this.showToast(result, 'danger');
    } else {
      this.showToast('Profil erfolgreich aktualisiert. Die E-Mail muss ggf. noch bestätigt werden.', 'success');
      this.router.navigate(['tabs/tab3'])
    }

    this.loading = false;
  }

  private async showToast(message: string, toastcolor: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: toastcolor
    });
    toast.present();
  }
}
