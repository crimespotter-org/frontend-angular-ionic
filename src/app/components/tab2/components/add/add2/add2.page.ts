import { Component, OnInit, ViewChild, forwardRef, inject } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline, linkOutline, addOutline, checkmarkOutline, chevronBackOutline, locationOutline, trashOutline, imageOutline, newspaperOutline, bookOutline, micOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { IonInput, IonModal, IonCard, IonCardContent, IonToast, IonItemSliding, IonItemOption, IonItemOptions, IonDatetime, IonButton, IonButtons, IonHeader, IonContent, IonToolbar, IonLabel, IonTitle, IonItem, IonFab, IonIcon, IonFabButton, IonSelectOption, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { SelectionMapComponent } from "../../../../selection-map/selection-map.component";
import { AddService } from 'src/app/services/add.service';
import { LocationPickerComponent } from 'src/app/components/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { FurtherLink } from 'src/app/shared/interfaces/further-link.interface';
import { HelperUtils } from 'src/app/shared/helperutils';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-add2',
  templateUrl: './add2.page.html',
  styleUrls: ['./add2.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonItem,
    IonContent,
    IonHeader,
    FormsModule,
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
    IonCard,
    IonCardContent,
    IonModal,
    SelectionMapComponent,
    LocationPickerComponent,
    IonInput,
    ReactiveFormsModule,
  ]
})
export class Add2Page implements OnInit {

  HelperUtils = HelperUtils;

  router = inject(Router)
  addService = inject(AddService);
  storageService = inject(StorageService);
  actionSheetController = inject(ActionSheetController);

  @ViewChild('selectLocationModal') modal!: IonModal

  images: Photo[] = [];
  location: Location | undefined;

  form: FormGroup;
  links: FormArray;

  linkTypes: string[] = [];

  //TODO: Make this globally accessible to also show icons in case details page
  LinkTypeToIcon: Map<string, string> = new Map([
    ['website', 'link-outline'],
    ['facebook', 'logo-facebook'],
    ['twitter', 'logo-twitter'],
  ]);

  constructor() {
    addIcons({ micOutline, bookOutline, newspaperOutline, linkOutline, checkmarkOutline, chevronBackOutline, addOutline, trashOutline, locationOutline, imageOutline, closeOutline });

    this.form = this.addService.form.get('page2') as FormGroup;
    this.links = this.form.get('further_links') as FormArray;

    this.linkTypes = this.storageService.getLinkTypes();

    console.log(this.linkTypes);
  }

  ngOnInit() {
  }

  selectedLocationChanged(location: Location) {
    console.log(location);
    this.location = location;
  }

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.images.push(image);
  }

  discardImage(image: Photo) {
    let index = this.images.findIndex(item => item === image);
    if (index !== -1) {
      this.images.splice(index, 1); // Remove one element at the found index
    }
  }
  routeToPreviousPage() {
    this.router.navigate(["tabs/tab2/add"]);
  }

  addLink() {
    this.links.push(this.addService.fb.group({
      value: ['', Validators.required],
      type: [this.linkTypes[0], ]
    }));
  }

  removeLink(index: number) {
    this.links.removeAt(index) // Remove one element at the found index
  }

  submitForm() {
    console.log(this.form.value);
    console.log(this.form.valid)
  }

  async chooseIcon(idx: number){
    const actionSheet = await this.actionSheetController.create({
      header: 'Link-Typ wählen',
      buttons: this.linkTypes.map(type => {
        return {
          text: HelperUtils.formatLinkType(type),
          value: type,
          handler: () => {
            this.links.at(idx).patchValue({type: type});
          }
        };
      })
    });
    await actionSheet.present();
  }

}

