import * as L from 'leaflet';

export const defaultMarker = new L.Icon({
    iconUrl: '../../assets/images/marker-default.svg',
    iconSize: [25, 30],
    iconAnchor: [12.5, 30],
    popupAnchor: [2, -30]
});

export const murderMarker = new L.Icon({
    iconUrl: '../../assets/images/marker-murder.svg',
    iconSize: [25, 30],
    iconAnchor: [12.5, 30]
});