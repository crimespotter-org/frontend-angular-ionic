import { Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { ModalController, IonModal, IonButton, IonContent, IonTitle, IonLabel, IonIcon, IonHeader, IonToolbar, IonButtons, IonItem} from '@ionic/angular/standalone';
import { SelectionMapComponent } from '../selection-map/selection-map.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Location } from 'src/app/shared/interfaces/location.interface';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  imports: [IonButton, SelectionMapComponent, IonContent, IonModal, IonTitle, IonLabel, IonIcon, IonHeader, IonToolbar, IonButtons, IonItem],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => LocationPickerComponent),
    }
  ],
  standalone: true,
})
export class LocationPickerComponent implements ControlValueAccessor {

  location: Location;

  @Input()
  defaultLocation: Location = {latitude: 52.52437, longitude: 13.41053};

  @Output() selectedLocation = new EventEmitter<Location>();

  @ViewChild('selectLocationModal') modal!: IonModal

  tempLocation: Location | undefined;

  onChange = (location: Location) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  constructor() { 
    console.log(this.defaultLocation);
    this.location = this.defaultLocation;
  }

  writeValue(location: any): void {
    this.location = location;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.onTouched();
    }
  }

  selectedLocationChanged(location: Location) {
    this.tempLocation = location;
  }

  confirmLocationModal() {
    if (this.tempLocation == undefined) {
      return;
    }
      this.touched = true;
      this.location = this.tempLocation;
      this.selectedLocation.emit(this.location);
      console.log(this.location);
      this.onChange(this.location);
      this.onTouched();
      this.modal.dismiss();
      this.tempLocation = undefined;
    }
  

  cancelLocationModal() {
    console.log('canceled');
    this.touched = true;
    this.onTouched();
    this.tempLocation = undefined;
    this.modal.dismiss();
  }

  getClasses() {
    return {
      'ng-touched': this.touched,
      'ng-untouched': !this.touched,
      'ng-valid': this.location != null,
      'ng-invalid': this.location == null
    };
  }
}