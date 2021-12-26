export type MapSearchUpdateParams = {
  mapSelection: MapSelection;
  searchParams: SegmentExploreParams;
};

export type MapSelection = {
  center: [number, number];
  zoom: number;
}

export type SegmentExploreParams = {
  /** southwest corner latitutde */
  southWestLat: number;
  /** Southwest corner longitude */
  southWestLng: number;
  /** northeast corner latitude */
  northEastLat: number;
  /** northeast corner longitude */
  northEastLng: number;
};

export type SegmentExploreResponse = {
  segments: StravaSegment[];
};

// https://developers.strava.com/docs/reference/#api-Segments-exploreSegments
export type StravaSegment = {
  id: number;
  name: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  [key: string]: any;
};
