import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonToolbar, IonHeader, IonSegment, IonSegmentButton, IonTitle, IonLabel } from '@ionic/angular/standalone';
import { Add1Page } from '../tab2/components/add/add1/add1.page';
import { Add2Page } from '../tab2/components/add/add2/add2.page';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
  standalone: true,
  imports: [CommonModule, Add1Page, Add2Page, CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonTitle, IonLabel]
})
export class AddCasePage implements OnInit {

  segment: string = '1'
  constructor() { }

  ngOnInit() {
  }

}
