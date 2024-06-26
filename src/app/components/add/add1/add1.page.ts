import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormsModule, NgModel } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { closeOutline, arrowBackOutline, arrowForwardOutline, addOutline, chevronBackCircle, chevronBackOutline, chevronForwardOutline, locationOutline, lockClosedOutline, lockOpenOutline, trashOutline, warningOutline, closeSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonBackButton ,IonModal, IonCard, IonCardContent, IonText, IonRow, IonCol, IonGrid, IonChip, IonInput, IonToast, IonItemSliding, IonItemOption, IonItemOptions, IonDatetime ,IonButton, IonButtons, IonHeader, IonContent, IonToolbar, IonLabel, IonTitle, IonItem, IonFab, IonIcon, IonFabButton, IonSelectOption, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddService } from 'src/app/services/add.service';
import { HelperUtils } from 'src/app/shared/helperutils';
import { Keyboard } from '@capacitor/keyboard';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
    selector: 'app-add',
    templateUrl: './add1.page.html',
    styleUrls: ['./add1.page.scss'],
    standalone: true,
    imports: [IonItem,
      IonContent,
      IonHeader,
      FormsModule,
      ReactiveFormsModule,
      IonToast,
      IonContent,
      IonToolbar,
      IonLabel,
      IonTitle,
      IonFab,
      IonIcon,
      IonFabButton,
      IonSelect,
      IonSelectOption,
      IonTextarea,
      IonButton,
      IonButtons,
      IonDatetime,
      IonContent,
      IonItemOption,
      IonItemOptions,
      IonItemSliding,
      IonInput,
      IonChip,
      IonGrid,
      IonRow,
      IonCol,
      IonText,
      IonCardContent,
      IonCard,
      IonModal,
      DatePipe,
      CommonModule,
      IonBackButton
    ]
})
export class Add1Page implements AfterViewInit {

  HelperUtils = HelperUtils;

  @ViewChild(IonToast) toast!: IonToast;

  router = inject(Router);
  fb = inject(FormBuilder);
  addService = inject(AddService);
  storageService = inject(StorageService);

  form: FormGroup;

  hideFab = false;
  crimeDate?: Date;
  title: string | undefined;
  summary: string | undefined;
  type: string | undefined;

  caseTypes: string[] = [];

  constructor() {
    addIcons({ closeSharp, arrowForwardOutline, arrowBackOutline, chevronBackOutline, lockClosedOutline, lockOpenOutline, locationOutline, addOutline, trashOutline, chevronForwardOutline, warningOutline});

    this.form = this.addService.form.get('page1') as FormGroup;

  }

  ngAfterViewInit() {
    this.caseTypes = this.storageService.getCaseTypes();

    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboardWillShow');
      this.hideFab = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboardWillHide');
      this.hideFab = false;
    });
  }

  routeToNextPage(){
    console.log(this.form.get('closed')?.value);
console.log(this.form.value);
    if(this.form.valid){
      this.router.navigate(['add-case-2']);
    }
    else{
      this.form.markAllAsTouched();
      this.toast.present();
    }
  }

  switchState(){
    this.form.get('closed')?.setValue(!this.form.get('closed')?.value);
  }



}
