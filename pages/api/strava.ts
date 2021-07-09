import type { NextApiRequest, NextApiResponse } from 'next';
import strava from 'strava-v3';

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

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return req.method === 'POST' ? handleGetSegments(req, res) : res.status(405);
};

const handleGetSegments = async (req: NextApiRequest, res: NextApiResponse) => {
  const access_token = req.headers['authorization']?.toString() ?? '';
  const { southWestLat, southWestLng, northEastLat, northEastLng } = JSON.parse(req.body);
  const params: SegmentExploreParams = {
    southWestLat: southWestLat,
    southWestLng: southWestLng,
    northEastLat: northEastLat,
    northEastLng: northEastLng,
  };
  const segmentsResponse = await getSegments(access_token, params);
  res.send({ segments: segmentsResponse.segments });
};

// NOTE: Done during SSR
const handleGetStravaAthlete = async (req: NextApiRequest, res: NextApiResponse) => {
  const stravaAthlete = await getStravaAthlete(req.body);
  res.status(200).json({ name: stravaAthlete.athlete.firstname, data: stravaAthlete });
};

// NOTE: Done during SSR
const handleGetStravaUrl = (req: NextApiRequest, res: NextApiResponse) => {
  res.send({ url: getStravaUrl() });
};

export const getSegments = (accessToken: string, query: SegmentExploreParams) => {
  const params = {
    access_token: accessToken,
    bounds: `${query.southWestLat},${query.southWestLng},${query.northEastLat},${query.northEastLng}`, // e.g. '37.821362,-122.505373,37.842038,-122.465977'
    activity_type: 'Ride',
  };
  return strava.segments.explore(params);
};

export const getStravaAthlete = (code: string) => strava.oauth.getToken(code);

export const getStravaUrl = () => {
  const url = new URL('http://www.strava.com/oauth/authorize');
  url.search = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID ?? '',
    response_type: 'code',
    redirect_uri: process.env.STRAVA_CALLBACK_URL ?? '',
    approval_prompt: 'auto',
    scope: 'read,activity:read',
  }).toString();
  return url.toString();
};

export default handler;
