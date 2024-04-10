import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {CaseDetails} from "../../shared/types/supabase";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GestureController, IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgSwitch} from "@angular/common";
import {CaseFactsComponent} from "./case-facts/case-facts.component";
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NgSwitch,
    CaseFactsComponent,
    CommonModule
  ],
  standalone: true
})
export class CaseDetailsComponent implements OnInit {
  @Input() returnRoute: string = '/';

  caseDetails?: CaseDetails;
  segment: string = 'facts';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private gestureCtrl: GestureController,
    private el: ElementRef,
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.loadCaseDetails(caseId);
    }

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state && 'returnRoute' in currentNavigation.extras.state) {
      this.returnRoute = currentNavigation.extras.state['returnRoute'];
    }

    this.setupEdgeSwipeBackGesture();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    if (touch.clientX < 20) {
      this.setupEdgeSwipeBackGesture();
    }
  }

  setupEdgeSwipeBackGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 15,
      gestureName: 'edge-swipe-back',
      onEnd: ev => {
        if (ev.deltaX > 150) {
          this.goBack();
        }
      }
    }, true);

    gesture.enable();
  }

  goBack() {
    this.router.navigateByUrl(this.returnRoute);
  }

  async loadCaseDetails(caseId: string): Promise<void> {
    this.supabaseService.getCaseDetails(caseId).then((caseDetail) => {
      if (caseDetail) {
        this.caseDetails = caseDetail;
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }

}
