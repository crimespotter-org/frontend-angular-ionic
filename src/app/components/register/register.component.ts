import { Component, OnInit } from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import { ToastController, IonSpinner, IonButton, IonContent, IonHeader, IonItem, IonTitle, IonToolbar, IonLabel, IonInput} from "@ionic/angular/standalone";
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ IonSpinner, IonHeader, IonTitle, IonButton, IonItem, IonContent, FormsModule, IonToolbar, IonLabel, IonInput, ReactiveFormsModule, NgIf],
})
export class RegisterComponent  {

  loading: boolean = false;

  passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmpassword');
  
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };

  registerForm= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmpassword: new FormControl('', [Validators.required])
  }, {validators: this.passwordMatchingValidatior});

  constructor(private supabaseService: SupabaseService, private router: Router, private toastController: ToastController) {}

  async register() {    
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.registerForm.get('email')?.value;
    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;

    if(!email || !username || !password) {
      this.presentErrorToast('Something went wrong, please make sure all values are filled out correctly');
      console.log('Something went wrong');
      return;
    }

    const { data, error } = await this.supabaseService.signUp(email, password);
    if (error) {
      console.error('Fehler bei der Registrierung:', error);
      this.presentErrorToast('Could not create new user');
      return;
    }

    const userId = data?.user?.id;

    if(!userId) {
      this.presentErrorToast('Could not retrieve user id');
      console.log('Could not retrieve user id');
      return;
    }

    if(! await this.supabaseService.createUserProfile(userId, username, 'crimespotter')){
      this.presentErrorToast('Could not create user profile, database might be in an inconsistent state');
      return;
    };

    this.loading = false;

    this.router.navigate(['/tabs']);

  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  presentErrorToast(message: string) {
    this.loading=false;
    this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    }).then(toast => toast.present());
  }
}
