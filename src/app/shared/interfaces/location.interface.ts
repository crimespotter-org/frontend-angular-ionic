/**
 * Represents a geographic location.
 */
export interface Location {
    /**
     * The latitude of the location.
     */
    latitude: number;

    /**
     * The longitude of the location.
     */
    longitude: number;
}

/**
 * Represents the user's location.
 */
export interface UserLocation {
    /**
     * Indicates whether access to the user's location is denied.
     */
    access_denied: boolean;

    /**
     * The user's location.
     */
    location: Location;
}
