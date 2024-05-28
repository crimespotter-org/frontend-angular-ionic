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
    this.addDeepLinkListener();

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

  private addDeepLinkListener() {
    App.addListener('appUrlOpen', (event) => {
      const url = new URL(event.url);
      const path = url.pathname;
      const segments = path.split('/');

      if (url.href.includes('casedetails')) {
        const caseId = segments[segments.length - 1];
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

      if (url.href.includes('register-confirm')) {
        this.supabaseService.signOut();
        this.ngZone.run(() => {
          this.router.navigate(['register-confirm'])
        });
      }

      if (url.href.includes('reset-password')) {
        this.supabaseService.signOut();

        const searchParams = new URLSearchParams(url.search);
        const fragmentParams = new URLSearchParams(url.hash.replace('#', ''));

        const accessToken = fragmentParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || fragmentParams.get('refresh_token');

        if (accessToken && refreshToken) {
          this.ngZone.run(() => {
            this.router.navigate(['password-reset-form'],
              {
                state: {
                  accessToken: accessToken,
                  refreshToken: refreshToken
                }
              })
          });
        }
      }

      if (url.href.includes('update-mail')) {
        this.supabaseService.signOut();
        if (url.href.includes('message=Confirmation+link+accepted')) {
          this.ngZone.run(() => {
            this.router.navigate(['mail-change-old-confirm'])
          });
        }

        if (url.href.includes('type=email_change')) {
          this.ngZone.run(() => {
            this.router.navigate(['mail-change-new-confirm'])
          });
        }
      }


    });
  }
}
