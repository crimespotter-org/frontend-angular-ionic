import {Component, NgZone, OnInit} from '@angular/core';
import {IonApp, IonRouterOutlet, LoadingController} from '@ionic/angular/standalone';
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
              private ngZone: NgZone,
              private loadingController: LoadingController) {
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
            this.loadingController.create({
              message: 'Geteilter Fall wird geladen...',
            }).then(x => {
              x.present().then(() => {
                setTimeout(() => {
                  this.router.navigate(['tabs/case-details', caseId])
                  this.loadingController.dismiss();
                }, 1000);
              })
            });
          });
        })
      }
    });
    this.supabaseService.updateLocalUser();
    this.supabaseService.updateCaseTypes();
    this.supabaseService.updateLinkTypes();

    const currentMode = localStorage.getItem('colormode');
    const colorModeAuto = currentMode ? JSON.parse(currentMode) : true;
    if (colorModeAuto) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    } else {
      const currentSetting = localStorage.getItem('darkMode');
      if (currentSetting === 'true') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
}
