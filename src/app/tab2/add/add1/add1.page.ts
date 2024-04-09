import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { addOutline, chevronForwardOutline, locationOutline, trashOutline, warningOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonToast, IonItemSliding, IonItemOption, IonItemOptions, IonDatetime ,IonButton, IonButtons, IonHeader, IonContent, IonToolbar, IonLabel, IonTitle, IonItem, IonFab, IonIcon, IonFabButton, IonSelectOption, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AddService } from 'src/app/services/add.service';

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
    ]
})
export class Add1Page implements AfterViewInit {

  @ViewChild(IonToast) toast!: IonToast;

  router = inject(Router);
  fb = inject(FormBuilder);
  addService = inject(AddService);

  form: FormGroup;

  
  title: string | undefined;
  summary: string | undefined;
  type: string | undefined;

  storageService = inject(StorageService);
  caseTypes: string[] = [];
  
  constructor() {
    addIcons({locationOutline, addOutline, trashOutline, chevronForwardOutline, warningOutline});

    this.form = this.addService.form.get('page1') as FormGroup;
  }

  ngAfterViewInit() {
    this.caseTypes = this.storageService.getCaseTypes(); 
  }

  routeToNextPage(){
    console.log(this.form.value);
    if(this.form.valid){
      this.router.navigate(['tabs/tab2/add2']);
    }    
    else{
      this.toast.present();
    }
 
  }

}
