import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SupabaseService} from "../../../../../../services/supabase.service";
import {ToastController} from "@ionic/angular/standalone";
import {StorageService} from "../../../../../../services/storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfileEditPage {
  profileForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private toastController: ToastController, private storageService: StorageService, private router:Router) {
    this.profileForm = this.fb.group({
      username: [''],
      email: ['', [Validators.email]]
    });
  }

  async updateProfile() {


    this.loading = true;
    const values = this.profileForm.value;

    if (values.email.length>0 || values.username.length>0){
      let result: string = '';

      if (values.username) {
        const updateUsername = await this.supabaseService.updateUsername(values.username);
        if (updateUsername.length === 0) this.storageService.saveUsername(values.username);
        result = result + updateUsername;
      }
      if (values.email) {
        result = result + await this.supabaseService.updateEmail(values.email);
      }
      if (result.length >0) {
        this.showToast(result, 'danger');
      } else {
        this.showToast('Profil erfolgreich aktualisiert. Die E-Mail muss ggf. noch bestätigt werden.', 'success');
      }
    } else {
      this.showToast('Keine Daten zum aktualisieren übergeben.', 'danger');
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
