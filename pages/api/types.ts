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
  [key: string]: any;
};
