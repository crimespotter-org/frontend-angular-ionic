import {Component, ElementRef, OnInit} from '@angular/core';
import {CaseDetails} from "../../shared/types/supabase";
import {SupabaseService} from "../../services/supabase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GestureController, IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgSwitch} from "@angular/common";
import {CaseFactsComponent} from "./case-facts/case-facts.component";

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NgSwitch,
    CaseFactsComponent
  ],
  standalone: true
})
export class CaseDetailsComponent implements OnInit {
  caseId: string | null = null;
  caseDetails?: CaseDetails;
  segment: string = 'facts';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private gestureCtrl: GestureController,
    private el: ElementRef,
  ) {
  }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    if (caseId) {
      this.loadCaseDetails(caseId);
    }

    this.setupBackSwipeGesture();
  }

  setupBackSwipeGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 15,
      gestureName: 'swipe-back',
      onEnd: ev => {
        if (ev.deltaX > 150) {
          this.router.navigate(['']);
        }
      }
    }, true);

    gesture.enable();
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
