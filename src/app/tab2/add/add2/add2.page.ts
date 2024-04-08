import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, linkOutline, addOutline, checkmarkOutline, chevronBackOutline, locationOutline, trashOutline, imageOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { IonInput, IonModal, IonCard, IonCardContent, IonToast, IonItemSliding, IonItemOption, IonItemOptions, IonDatetime, IonButton, IonButtons, IonHeader, IonContent, IonToolbar, IonLabel, IonTitle, IonItem, IonFab, IonIcon, IonFabButton, IonSelectOption, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { SeletionMapComponent } from "../../../components/selection-map/selection-map.component";

@Component({
  selector: 'app-add2',
  templateUrl: './add2.page.html',
  styleUrls: ['./add2.page.scss'],
  standalone: true,
  imports: [IonItem,
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
    SeletionMapComponent,
    IonInput
  ]
})
export class Add2Page implements OnInit {

  router = inject(Router)

  @ViewChild('selectLocationModal') modal!: IonModal


  webLinks: webLink[] = [];
  images: Photo[] = [];
  location!: Location;

  constructor() {
    addIcons({ linkOutline, checkmarkOutline, chevronBackOutline, addOutline, trashOutline, locationOutline, imageOutline, closeOutline })
  }

  ngOnInit() {
  }

  selectedLocationChanged(location: Location) {
    console.log(location);
    this.location = location;
  }

  confirmLocationModal() {
    this.modal.dismiss(null, 'cancel');
  }

  cancelLocationModal() {
    this.modal.dismiss(this.location, 'confirm');
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

  addLink(){
    this.webLinks.push({value: '', type: LinkType.article});
  }

  removeLink(link: webLink){
    console.log("clicked");
    let index = this.webLinks.findIndex(item => item === link);
    if (index !== -1) {
      this.webLinks.splice(index, 1); // Remove one element at the found index
    }
  }
}


enum LinkType{
  podcast,
  article
}

interface webLink{
  value: string,
  type: LinkType
}