import {Component, ComponentFactoryResolver, Injector, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow, IonText,
  IonInput,
  IonTextarea,
  AlertController,
  ModalController,
  IonDatetimeButton,
  IonDatetime,
  IonModal
} from "@ionic/angular/standalone";
import { HelperUtils } from 'src/app/shared/helperutils';
import {
  fingerPrint,
  lockOpenOutline,
  lockClosedOutline,
  pencilSharp,
  locationOutline
} from "ionicons/icons";
import {addIcons} from "ionicons";
import { EditTypeModalComponent } from './edit-type-modal/edit-type-modal.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditStateModalComponent } from './edit-state-modal/edit-state-modal.component';
import { EditCaseService } from 'src/app/services/edit-case.service';
import { StorageService } from 'src/app/services/storage.service';
import { SelectionMapComponent } from '../../selection-map/selection-map.component';
import { LocationPickerComponent } from '../../location-picker/location-picker.component';
import { Location } from 'src/app/shared/interfaces/location.interface';
import { DataService } from 'src/app/services/data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-case-facts-edit',
  templateUrl: './case-facts-edit.component.html',
  styleUrls: ['./case-facts-edit.component.scss'],
  imports: [
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    DatePipe,
    IonCardSubtitle,
    IonChip,
    IonBadge,
    IonRow,
    IonButton,
    IonCol,
    IonIcon,
    IonItem,
    IonLabel,
    NgIf,
    IonText,
    IonInput,
    IonTextarea,
    FormsModule,
    IonDatetimeButton,
    IonDatetime,
    IonModal,
    LocationPickerComponent,
    ReactiveFormsModule
  ],
  standalone: true
})
export class CaseFactsEditComponent implements OnInit {

  caseDetails!: FormGroup;
  caseStates: string[] = [
    "open",
    "closed",
  ];
  caseTypes?: any[];
  location?: Location;

  constructor(public editCaseService: EditCaseService,
     private alertController: AlertController,
     private modalController: ModalController,
     private storageService: StorageService,
     private dataServie: DataService,) {
    addIcons({
      fingerPrint,
      lockOpenOutline,
      lockClosedOutline,
      pencilSharp,
      locationOutline
    });
  }

  async ngOnInit() {
    this.caseTypes = await this.storageService.getCaseTypes();
    this.caseDetails = this.editCaseService.detailsForm;
    console.log(this.caseDetails)
    this.location = { longitude: this.caseDetails.get('caseLong')!.value, latitude: this.caseDetails.get('caseLat')!.value};
  }

async editType() {
  if(!this.caseTypes) return;
  const alert = await this.alertController.create({
    header: 'Type',
    inputs: this.caseTypes.map(type => {
      return {
        name: 'type',
        type: 'radio',
        label: HelperUtils.formatCrimeType(type),
        value: type,
        checked: type === this.caseDetails.get('caseType')?.value,
        handler: (selectedType: any) => {
          // Führen Sie hier die Aktion aus, die Sie ausführen möchten, wenn ein Element angeklickt wird
          console.log('Selected type:', selectedType);
          this.caseDetails.patchValue({ caseType: selectedType.value });
          alert.dismiss();
        }
      }
    }),
    buttons: [] // Keine Buttons
  });

  await alert.present();
}


async editState(){
  const alert = await this.alertController.create({
    header: 'Status',
    inputs: this.caseStates.map(state => {
      return {
        name: 'status',
        type: 'radio',
        label: HelperUtils.formatStatus(state),
        value: state,
        checked: state === this.caseDetails.get('caseState')?.value,
        handler: (selectedState: any) => {
          console.log('Selected state:', selectedState);
          this.caseDetails.patchValue({ caseState: selectedState.value });
          alert.dismiss();
      }
    }
    }),
    buttons: []
  });

  await alert.present();
}

  protected readonly HelperUtils = HelperUtils;

  locationUpdate(loc: Location) {
    console.log("location updated");
    this.caseDetails.patchValue({caseLat: loc.latitude});
    this.caseDetails.patchValue({caseLong: loc.longitude});
    this.updatePLZAndPlaceNameAlert();
  }

  async updatePLZAndPlaceNameAlert(){
    const alert = await this.alertController.create({
      header: 'Location',
      message: 'Wollen Sie PLZ und Ort zum Standort updaten?',
      buttons: [
        {
          text: 'Nein',
          role: 'no',
          cssClass: 'secondary',
        },{
          text: 'Ja',
          role: 'yes',
          cssClass: 'primary',
        }
      ]
  });
  alert.present();

  const { role } = await alert.onWillDismiss();

  if (role === 'yes') {
    this.updatePLZandPlaceName(this.caseDetails.get('caseLocation')?.value);
  }
}


  async updatePLZandPlaceName(loc: Location) {
    const data = await firstValueFrom(this.dataServie.getLocationFromCoordinatesNominatim(loc));

    if (data) {
      console.log(data)
      this.caseDetails.patchValue({caseZipCode: data.postalCode});
      this.caseDetails.patchValue({casePlaceName: data.city || data.sub || data.county});
    }
  }
}
