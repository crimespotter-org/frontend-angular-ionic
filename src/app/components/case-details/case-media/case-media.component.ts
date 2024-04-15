import {Component, Input, OnInit} from '@angular/core';
import {SupabaseService} from "../../../services/supabase.service";
import {images} from "ionicons/icons";
import {IonCol, IonGrid, IonImg, IonRow, ModalController} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";
import {ImageViewerComponent} from "./components/image-viewer/image-viewer.component";

@Component({
  selector: 'app-case-media',
  templateUrl: './case-media.component.html',
  styleUrls: ['./case-media.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    NgForOf
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

  constructor(private supabaseService: SupabaseService, private modalController: ModalController) {
  }

  async ngOnInit() {
    await this.loadImages();
  }

  private async loadImages() {
    this.imageUrls = await this.supabaseService.getImageUrlsForCase(this.caseId)
  }

  protected readonly images = images;

  async openFullscreen(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageViewerComponent,
      componentProps: { imageUrl }
    });
    return await modal.present();
  }
}
