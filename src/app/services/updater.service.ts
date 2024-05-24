import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {

  constructor() { }

  private reloadSubject = new Subject<void>();
  reloadObservable = this.reloadSubject.asObservable();

  triggerReload(){
    this.reloadSubject.next();
  }
}
