import {Component, Input, OnInit} from '@angular/core';
import {SupabaseService} from "../../../services/supabase.service";
import {addOutline, images, trashBinOutline, trashOutline} from "ionicons/icons";
import {IonCard, IonCol, IonGrid, IonImg, IonRow, IonText, ModalController, IonIcon, IonButton, IonCardContent} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";
import {HelperUtils} from "../../../shared/helperutils";
import {CaseDetailsService} from "../../../services/case-details.service";
import { EditCaseService } from 'src/app/services/edit-case.service';
import { ImageGet } from 'src/app/shared/interfaces/imageGet.interface';
import { addIcons } from 'ionicons';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';

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
    IonText,
    IonIcon,
    IonButton,
    IonCardContent
  ],
  standalone: true
})
export class CaseMediaEditComponent implements OnInit {
  @Input() caseId: any;
  images: ImageGet[] = [];

  constructor(private caseDetailsService: CaseDetailsService,
              private modalController: ModalController,
              public editCaseService: EditCaseService) {
                addIcons({trashOutline, addOutline});
  }

  async ngOnInit() {
    this.images = await this.editCaseService.images;
  }


  reorderImageUrls(selectedIndex: number): string[] {
  const imageUrls = this.images.map(image => image.imageUrl);

    let reordered = [imageUrls[selectedIndex]];
    for (let i = selectedIndex + 1; i < imageUrls.length; i++) {
      reordered.push(imageUrls[i]);
    }
    for (let i = 0; i < selectedIndex; i++) {
      reordered.push(imageUrls[i]);
    }
    return reordered;
  }

  async markImageForRemoval(image: ImageGet) {
    this.images = this.images.filter(img => img !== image);
    await this.editCaseService.imagesToDelete.push(image);
  }

  async addImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    console.log(image);

    this.editCaseService.newImages.push(image);
  }

  async removeTempImage(image: Photo){
    this.editCaseService.newImages = this.editCaseService.newImages.filter((img: Photo) => img !== image);
  }

  protected readonly HelperUtils = HelperUtils;
}
