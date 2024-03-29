import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ModalController} from "@ionic/angular/standalone";
import {SupabaseService} from "../../services/supabase.service";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PasswordChangePage {

  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  constructor(
    private modalController: ModalController,
    private supabaseService: SupabaseService
  ) {}

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      console.error('Die Passwörter stimmen nicht überein.');
      return;
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
