import {Component, NgZone, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet} from '@ionic/angular/standalone';
import {SupabaseService} from "./services/supabase.service";
import {App} from "@capacitor/app";
import {Router} from "@angular/router";
import {CaseDetailsService} from "./services/case-details.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private supabaseService: SupabaseService,
              private router: Router,
              private caseDetailsService: CaseDetailsService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    App.addListener('appUrlOpen', (event) => {
      const url = new URL(event.url);
      const path = url.pathname;
      const segments = path.split('/');
      if (segments.length >= 2) {
        const caseId = segments[1];
        this.caseDetailsService.loadCaseDetails(caseId).then(() => {
          this.ngZone.run(() => {
            this.router.navigate(['tabs/case-details', caseId]);
          });
        })
      }
    });
    this.supabaseService.updateLocalUser();
    this.supabaseService.updateCaseTypes();
    this.supabaseService.updateLinkTypes();
    const currentMode = localStorage.getItem('colormode');
    const colorModeAuto = currentMode ? JSON.parse(currentMode) : true;
    if (!colorModeAuto) {
      const currentSetting = localStorage.getItem('darkMode');
      if (currentSetting === 'true') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
}
