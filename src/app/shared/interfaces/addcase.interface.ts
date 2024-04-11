import { FurtherLink } from "./further-link.interface";

export interface AddCase {
    title: string;
    summary: string;
    longitude: number;
    latitude: number;
    placeName: string;
    zipCode: number;
    caseType: string;
    crimeDateTime: string;
    status: string;
    links: FurtherLink[];
}