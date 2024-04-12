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
        return 'Zeitung'
      case 'book':
        return 'Buch'
      case 'podcast':
        return 'Podcast'
      default:
        return 'undefined'
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

  // Function to convert data URI to base64
  static dataURItoBase64(dataURI: string): string {
    // Split the data URI to get the actual data part
    const splitDataURI = dataURI.split(',')[1];
    // Convert the data part to base64
    return splitDataURI;
  }
}