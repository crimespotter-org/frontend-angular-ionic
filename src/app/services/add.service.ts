import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AddService {

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup; 

  constructor() { 
    this.form = this.fb.group({
      page1: this.fb.group({
        title: ['', Validators.required],
        closed: [ , Validators.required],
        summary: ['', Validators.required],
        type: ['', Validators.required],
        date_of_crime: ['', Validators.required]
      }),
      page2: this.fb.group({
        location: this.fb.group({
          coordinates: [null, Validators.required],
          plz: ['', Validators.required],
          city: ['', Validators.required],
        }), 
        images: this.fb.array([]),
        further_links: this.fb.array([])
      }),
    });
  }
  
}
