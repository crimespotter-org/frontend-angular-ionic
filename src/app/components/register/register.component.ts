import {Component, OnInit} from '@angular/core';
import {SupabaseService} from "../../services/supabase.service";
import {Router} from "@angular/router";
import {
  ToastController,
  IonSpinner,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonRow, IonCol, IonGrid, IonText, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonIcon
} from "@ionic/angular/standalone";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NgIf} from '@angular/common';
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonHeader, IonTitle, IonButton, IonItem, IonContent, FormsModule, IonToolbar, IonLabel, IonInput, ReactiveFormsModule, NgIf, IonRow, IonCol, IonGrid, IonText, IonCardContent, IonCardHeader, IonCard, IonCardTitle, IonIcon],
})
export class RegisterComponent {

  loading: boolean = false;
  showPassword1: boolean = false;
  showPassword2: boolean = false;


  passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmpassword');

    return password?.value === confirmPassword?.value ? null : {notmatched: true};
  };

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmpassword: new FormControl('', [Validators.required])
  }, {validators: this.passwordMatchingValidatior});

  constructor(private supabaseService: SupabaseService, private router: Router, private toastController: ToastController) {
    addIcons({
      eye,
      eyeOff
    })
  }

  async register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.registerForm.get('email')?.value!;
    const username = this.registerForm.get('username')?.value!;
    const password = this.registerForm.get('password')?.value!;

    const isUsernameTaken = await this.supabaseService.isUsernameTaken(username);
    if (isUsernameTaken) {
      this.loading = false;
      this.presentErrorToast('Benutzername ist bereits vergeben.');
      return;
    }

    const {data, error} = await this.supabaseService.signUp(email, password);

    if (error) {
      console.error('Could not register:', error);
      this.presentErrorToast('Fehler bei der Registrierung. Bitte wenden Sie sich an den Support.');
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      this.presentErrorToast('Es existiert bereits ein Konto mit der E-Mail Adresse. Bitte melden Sie sich an.');
    } else if (data.user){
      const userId = data.user.id;

      if (!userId) {
        this.presentErrorToast('Bitte wenden Sie sich an den Support.');
        console.log('Could not retrieve user id');
      }

      if (!await this.supabaseService.createUserProfile(userId, username, 'crimespotter')) {
        this.presentErrorToast('Fehler bei der Registrierung. Bitte wenden Sie sich an den Support.');
        console.log('User profile could not be generated.');
      }
    }

    this.loading = false;

    this.router.navigate(['/tabs']);

  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  presentErrorToast(message: string) {
    this.loading = false;
    this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    }).then(toast => toast.present());
  }

  togglePassword1Visibility() {
    this.showPassword1 = !this.showPassword1;
  }

  togglePassword2Visibility() {
    this.showPassword2 = !this.showPassword2;
  }
}
