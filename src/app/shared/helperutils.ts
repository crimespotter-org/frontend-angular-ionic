import {Location} from "./interfaces/location.interface";

export class HelperUtils {

  static formatCrimeType(crimeType: string): string {
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

  static formatLinkType(type: string): string {
    switch (type) {
      case 'newspaper':
        return 'Artikel'
      case 'book':
        return 'Buch'
      case 'podcast':
        return 'Podcast'
      default:
        return 'undefined'
    }
  }

  static formatStatus(type: string): string {
    switch (type) {
      case 'open':
        return 'Offen'
      case 'closed':
        return 'Geschlossen'
      default:
        return ''
    }
  }

  static convertLinkTypeToIcon(type: string): string {
    switch (type) {
      case 'newspaper':
        return 'newspaper-outline'
      case 'book':
        return 'book-outline'
      case 'podcast':
        return 'mic-outline'
      default:
        return 'link-outline'
    }
  }

  static calculateDistance(coord1: Location, coord2: Location): number {
    const R = 6371;
    const lat1 = coord1.latitude * Math.PI / 180;
    const lat2 = coord2.latitude * Math.PI / 180;
    const deltaLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const deltaLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distanz in Kilometern
    return distance;
  }

  // Function to convert data URI to base64
  static dataURItoBase64(dataURI: string): string {
    // Split the data URI to get the actual data part
    const splitDataURI = dataURI.split(',')[1];
    // Convert the data part to base64
    return splitDataURI;
  }
}
