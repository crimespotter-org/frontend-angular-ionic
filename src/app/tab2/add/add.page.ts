import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SeletionMapComponent } from "../../components/selection-map/selection-map.component";
import { Location } from 'src/app/shared/interfaces/location.interface';
import { StorageService } from 'src/app/services/storage.service';
import { addOutline, locationOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonModal } from '@ionic/angular';
import { MapComponent } from "../../tab1/components/map/map.component";
import {ViewDidEnter} from "@ionic/angular/standalone";
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-add',
    templateUrl: './add.page.html',
    styleUrls: ['./add.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, SeletionMapComponent, MapComponent]
})
export class AddPage implements AfterViewInit, ViewDidEnter {
[x: string]: any;

  @ViewChild(IonModal) modal!: IonModal
  
  title: string | undefined;
  summary: string | undefined;
  type: string | undefined;
  location!: Location;

  storageService = inject(StorageService);
  caseTypes: string[] = [];

  images: Photo[] = []
  
  constructor() {
    addIcons({locationOutline, addOutline, trashOutline});
  }

  ionViewDidEnter(): void {
    console.log("triggered");
  }

  ngAfterViewInit() {
    this.caseTypes = this.storageService.getCaseTypes(); 
  }

  selectedLocationChanged(location: Location){
    console.log(location);
    this.location = location;
  }

  confirmLocationModal(){
    this.modal.dismiss(null, 'cancel');
  }

  cancelLocationModal(){
    this.modal.dismiss(this.location, 'confirm');
  }

  async uploadImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.images.push(image);
  }

  discardImage(image: Photo){
    let index = this.images.findIndex(item => item === image);
    if (index !== -1) {
    this.images.splice(index, 1); // Remove one element at the found index
}
  }

}
