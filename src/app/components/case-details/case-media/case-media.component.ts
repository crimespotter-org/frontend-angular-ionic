import {Component, Input, OnInit} from '@angular/core';
import {SupabaseService} from "../../../services/supabase.service";
import {images} from "ionicons/icons";
import {IonCard, IonCol, IonGrid, IonImg, IonRow, IonText, ModalController} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";
import {ImageViewerComponent} from "./components/image-viewer/image-viewer.component";
import {HelperUtils} from "../../../shared/helperutils";
import {CaseDetailsService} from "../../../services/case-details.service";

@Component({
  selector: 'app-case-media',
  templateUrl: './case-media.component.html',
  styleUrls: ['./case-media.component.scss'],
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
export class CaseMediaComponent implements OnInit {
  @Input() caseId: any;
  imageUrls: string[] = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 10,
    slidesPerView: 1.2
  };

  constructor(private caseDetailsService: CaseDetailsService,
              private modalController: ModalController) {
  }

  async ngOnInit() {
    this.caseDetailsService.caseImageUrls$.subscribe(imageUrls => {
      this.imageUrls = imageUrls;
    })
  }

  async openFullscreen(imageUrl: string) {
    const activeIndex = this.imageUrls.indexOf(imageUrl);
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: {
        imageUrls: this.imageUrls,
        activeIndex: activeIndex
      }
    });
    return await modal.present();
  }

  protected readonly HelperUtils = HelperUtils;
}
