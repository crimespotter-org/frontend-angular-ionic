import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AddService {

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup; 

  constructor() { 
    this.form = this.fb.group({
      page1: this.fb.group({
        title: [''],
        summary: [''],
        type: [''],
        date_of_crime: ''
      }),
      page2: this.fb.group({
        location: [''],
        images: [''],
        further_links: ['']
      }),
    });
  }

  


}
