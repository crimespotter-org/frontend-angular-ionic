import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonModal, IonButton, IonContent, IonTitle, IonLabel, IonIcon, IonHeader, IonToolbar, IonButtons, IonItem} from '@ionic/angular/standalone';
import { SelectionMapComponent } from '../selection-map/selection-map.component';
import { ControlValueAccessor } from '@angular/forms';
import { Location } from 'src/app/shared/interfaces/location.interface';



@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  imports: [IonButton, SelectionMapComponent, IonContent, IonModal, IonTitle, IonLabel, IonIcon, IonHeader, IonToolbar, IonButtons, IonItem],
  standalone: true,
})
export class LocationPickerComponent implements ControlValueAccessor {

  @Input()
  location?: Location;

  @Input()
  defaultLocation: Location | undefined;

  @ViewChild('selectLocationModal') modal!: IonModal

  tempLocation: Location | undefined;

  onChange = (_: Location) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  constructor() { }

  writeValue(location: any): void {
    this.location = location;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  selectedLocationChanged(location: Location) {
    this.tempLocation = location;
  }

  confirmLocationModal() {
    if (this.tempLocation != undefined) {
      this.location = this.tempLocation;
      this.onChange(this.location);
      this.onTouched();
      this.modal.dismiss();
      this.tempLocation = undefined;
    }
  }

  cancelLocationModal() {
    this.tempLocation = undefined;
    this.onTouched();
    this.modal.dismiss();
  }
}