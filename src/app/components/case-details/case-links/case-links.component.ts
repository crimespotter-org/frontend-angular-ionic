import {Component, Input, OnInit} from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRow, IonText
} from "@ionic/angular/standalone";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {SupabaseService} from "../../../services/supabase.service";
import {addIcons} from "ionicons";
import {bookOutline, linkOutline, micCircleOutline, newspaperOutline, openOutline} from "ionicons/icons";
import {HelperUtils} from "../../../shared/helperutils";
import {Browser} from "@capacitor/browser"

@Component({
  selector: 'app-case-links',
  templateUrl: './case-links.component.html',
  styleUrls: ['./case-links.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    NgForOf,
    IonItemSliding,
    IonGrid,
    IonRow,
    IonCard,
    IonCol,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    TitleCasePipe,
    IonText,
    NgIf
  ],
  standalone: true
})
export class CaseLinksComponent implements OnInit {
  @Input() caseId: any;
  linkGroups: any[] = [];

  constructor(private supabaseService: SupabaseService) {
    addIcons({
      bookOutline,
      micCircleOutline,
      newspaperOutline,
      linkOutline,
      openOutline
    });
  }

  ngOnInit() {
    this.loadLinks()
  }

  async loadLinks() {
    this.supabaseService.getLinksByCaseId(this.caseId).then(links => {
      this.groupLinksByType(links);
    })
  }

  groupLinksByType(links: any []) {
    const groups = links.reduce((acc, link) => {
      const type = link.link_type || 'other';
      if (!acc[type]) {
        acc[type] = {
          type: type,
          links: []
        };
      }
      acc[type].links.push(link);
      return acc;
    }, {});

    this.linkGroups = Object.values(groups);
  }


  async openLink(url: string) {
    await Browser.open({
      url: url,
      presentationStyle: 'fullscreen'
    });
  }

  getLinkIcon(type: string):
    string {
    switch (type) {
      case 'podcast':
        return 'mic-circle-outline';
      case 'newspaper':
        return 'newspaper-outline';
      case 'book':
        return 'book-outline';
      default:
        return 'link-outline';
    }
  }

  protected readonly HelperUtils = HelperUtils;
}
