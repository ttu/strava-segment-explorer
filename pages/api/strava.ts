import type { NextApiRequest, NextApiResponse } from 'next';
import strava from 'strava-v3';

type Data = {
  name: string;
  data: any;
};

// NOTE: All backend requests are now done during SSR
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  return req.method === 'POST' ? handleGetStravaAthlete(req, res) : handleGetStravaUrl(req, res);
};

const handleGetStravaAthlete = async (req: NextApiRequest, res: NextApiResponse) => {
  const stravaAthlete = await getStravaAthlete(req.body);
  res.status(200).json({ name: stravaAthlete.athlete.firstname, data: stravaAthlete });
};

const handleGetStravaUrl = (req: NextApiRequest, res: NextApiResponse) => {
  res.send({ url: getStravaUrl() });
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
