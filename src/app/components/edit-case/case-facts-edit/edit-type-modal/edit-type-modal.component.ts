import { Component, Input, OnInit } from '@angular/core';
import {
  IonSelect, 
  IonSelectOption, 
  ModalController,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonItem,
  IonList
} from "@ionic/angular/standalone";
import { StorageService } from 'src/app/services/storage.service';
import { NgFor, NgIf } from '@angular/common';
import { HelperUtils } from 'src/app/shared/helperutils';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-type-modal',
  templateUrl: './edit-type-modal.component.html',
  styleUrls: ['./edit-type-modal.component.scss'],
  imports: [
    IonSelect,
    IonSelectOption,
    NgIf,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    FormsModule,
    NgFor,
    IonItem,
    IonList,
  ],
  standalone: true
})
export class EditTypeModalComponent implements OnInit {

  @Input() currentType?: string;

  HelperUtils = HelperUtils;

  caseTypes: string[] | undefined;

  selectedType: string | undefined;

  constructor(private storageService: StorageService, private modalController: ModalController) { }

  async ngOnInit() {
    this.caseTypes = await this.storageService.getCaseTypes();
    this.selectedType = this.currentType;
  }

  cancel() {
    return this.modalController.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalController.dismiss(this.selectedType, "confirm");
  }

  selectType(type: string) {
  this.selectedType = type;
  this.confirm();
}
}
