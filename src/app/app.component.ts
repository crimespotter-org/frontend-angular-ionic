import {Component, OnInit} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {SupabaseService} from "./services/supabase.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{
  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.updateLocalUser();
  }
}
