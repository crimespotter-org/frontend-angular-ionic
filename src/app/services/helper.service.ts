import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  formatCrimeType(crimeType: string): string {
    switch (crimeType) {
      case 'murder':
        return 'Mord'
      case 'theft':
        return 'Diebstahl'
      case 'robbery-murder':
        return 'Raubmord'
      case 'brawl':
        return 'Schlägerei'
      case 'rape':
        return 'Vergewaltigung'
    }
    return ''
  }
}
