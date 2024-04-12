import { Component, OnInit, ViewChild, forwardRef, inject } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { closeOutline, linkOutline, addOutline, checkmarkOutline, chevronBackOutline, locationOutline, trashOutline, imageOutline, newspaperOutline, bookOutline, micOutline, caretUpOutline, caretDownOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { IonInput, IonModal, IonCard, IonCardContent, IonToast, IonItemSliding, IonItemOption, IonItemOptions, IonDatetime, IonButton, IonButtons, IonHeader, IonContent, IonToolbar, IonLabel, IonTitle, IonItem, IonFab, IonIcon, IonFabButton, IonSelectOption, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Location, UserLocation } from 'src/app/shared/interfaces/location.interface';
import { SelectionMapComponent } from "../../../../selection-map/selection-map.component";
import { AddService } from 'src/app/services/add.service';
import { LocationPickerComponent } from 'src/app/components/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { FurtherLink } from 'src/app/shared/interfaces/further-link.interface';
import { HelperUtils } from 'src/app/shared/helperutils';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Action } from 'rxjs/internal/scheduler/Action';
import { LocationService } from 'src/app/services/location.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AddCase } from 'src/app/shared/interfaces/addcase.interface';
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom } from 'rxjs';


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
  locationService = inject(LocationService);
  supaBaseService = inject(SupabaseService);
  dataService = inject(DataService); 

  @ViewChild('selectLocationModal') modal!: IonModal

  images: Photo[] = [];
  currentLocation?: Location;

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
    addIcons({ caretDownOutline, caretUpOutline, micOutline, bookOutline, newspaperOutline, linkOutline, checkmarkOutline, chevronBackOutline, addOutline, trashOutline, locationOutline, imageOutline, closeOutline });

    this.form = this.addService.form.get('page2') as FormGroup;
    this.links = this.form.get('further_links') as FormArray;

    this.linkTypes = this.storageService.getLinkTypes();

    console.log(this.linkTypes);
  }

  async ngOnInit(): Promise<void> {
    this.currentLocation = (await this.locationService.getLatestLocation()).location;

    this.locationService.currentLocation$.subscribe(userlocation => {
      console.log(`Location changed: ${userlocation.location.latitude}, ${userlocation.location.longitude}`)
      this.currentLocation = userlocation.location;
    });
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
      type: [this.linkTypes[0],]
    }));
  }

  removeLink(index: number) {
    this.links.removeAt(index) // Remove one element at the found index
  }

  async submitForm() {
    
    if (!this.addService.form.valid) {
      console.log('Form invalid');
      return;
    }

    const fullform = this.addService.form;


    const array = this.form.get('further_links') as FormArray;

    console.log(array);


    const loc = fullform.get('page2')?.get('location')?.value as Location;

    //Fetch geolocation data for coordinates from Nominatim
    const geoLocationData = await firstValueFrom(this.dataService.getLocationFromCoordinatesNominatim(loc));

    console.log(geoLocationData);
    const caseData: AddCase = {
      title: fullform.get('page1')?.get('title')?.value,
      summary: fullform.get('page1')?.get('summary')?.value,
      caseType: fullform.get('page1')?.get('type')?.value,
      crimeDateTime: fullform.get('page1')?.get('date_of_crime')?.value,
      latitude: loc.latitude,
      longitude: loc.longitude,
      status: 'closed',
      placeName: geoLocationData.city || geoLocationData.sub || geoLocationData.county,
      zipCode: geoLocationData.postalCode,
      links: array.value
    };

    await this.supaBaseService.createCrimeCase(caseData);
  }

  async chooseIcon(idx: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Link-Typ wählen',
      buttons: this.linkTypes.map(type => {
        return {
          text: HelperUtils.formatLinkType(type),
          value: type,
          handler: () => {
            this.links.at(idx).patchValue({ type: type });
          }
        };
      })
    });
    await actionSheet.present();
  }

}

