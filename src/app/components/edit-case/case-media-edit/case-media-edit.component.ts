import {Component, Input, OnInit} from '@angular/core';
import {SupabaseService} from "../../../services/supabase.service";
import {images} from "ionicons/icons";
import {IonCard, IonCol, IonGrid, IonImg, IonRow, IonText, ModalController} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";
import {HelperUtils} from "../../../shared/helperutils";
import {CaseDetailsService} from "../../../services/case-details.service";
import { EditCaseService } from 'src/app/services/edit-case.service';

@Component({
  selector: 'app-case-media-edit',
  templateUrl: './case-media-edit.component.html',
  styleUrls: ['./case-media-edit.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    NgForOf,
    IonCard,
    NgIf,
    IonText
  ],
  standalone: true
})
export class CaseMediaEditComponent implements OnInit {
  @Input() caseId: any;
  imageUrls: string[] = [];

  constructor(private caseDetailsService: CaseDetailsService,
              private modalController: ModalController,
              private editCaseService: EditCaseService) {
  }

  async ngOnInit() {
    this.imageUrls = await this.editCaseService.imageUrls;
  }


  reorderImageUrls(selectedIndex: number): string[] {
    let reordered = [this.imageUrls[selectedIndex]];
    for (let i = selectedIndex + 1; i < this.imageUrls.length; i++) {
      reordered.push(this.imageUrls[i]);
    }
    for (let i = 0; i < selectedIndex; i++) {
      reordered.push(this.imageUrls[i]);
    }
    return reordered;
  }

  protected readonly HelperUtils = HelperUtils;
}
