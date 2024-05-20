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
  IonList,
  IonItem
} from "@ionic/angular/standalone";
import { StorageService } from 'src/app/services/storage.service';
import { NgFor, NgIf } from '@angular/common';
import { HelperUtils } from 'src/app/shared/helperutils';
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'app-edit-state-modal',
  templateUrl: './edit-state-modal.component.html',
  styleUrls: ['./edit-state-modal.component.scss'],
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
    IonItem,
    IonList,
    NgFor,
  ],
  standalone: true
})
export class EditStateModalComponent  implements OnInit {
  
  HelperUtils = HelperUtils;

  @Input() currentState?: string;

  caseStates: string[] = [
    "open",
    "closed",
  ];

  selectedState: string | undefined;

  constructor(private storageService: StorageService, private modalController: ModalController) { }

  ngOnInit() {
    this.selectedState = this.currentState;
  }

  cancel() {
    return this.modalController.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalController.dismiss(this.selectedState, "confirm");
  }

  selectState(state: string) {
    this.selectedState = state;
    this.confirm();
  }
}
