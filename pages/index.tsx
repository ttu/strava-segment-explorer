import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { getStravaAthlete, getStravaUrl } from './api/strava';
import StarvaConnect from '../public/strava_connect.svg';
import PoweredByStrava from '../public/powered_by_strava.svg';
import dynamic from 'next/dynamic';
import { SegmentExploreParams } from './api/types';

type Token = {
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
};

type User = {
  name: string;
  token: Token;
};

const DISCLAIMER = `Site doesn't store any of your personal information from Strava. Close the tab or refresh and all information is gone`;

const MapWithNoSSR = dynamic(() => import('./Map'), { ssr: false });

const Home = ({ stravaLoginUrl, stravaUser }: any) => {
  const [user] = useState<User>({
    name: stravaUser ? stravaUser.name : '',
    token: stravaUser ? stravaUser.token : '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [segments, setSegments] = useState<any[]>([]);
  const router = useRouter();

  console.log('Strava user:', stravaUser);

  useEffect(() => {
    // Remove query params
    router.push('/', undefined, { shallow: true });
  }, []);

  const login = () => {
    setLoading(true);
    location.href = stravaLoginUrl;
  };

  const fetchSegments = async () => {
    setLoading(true);

    const params: SegmentExploreParams = {
      southWestLat: 37.821362,
      southWestLng: -122.505373,
      northEastLat: 37.842038,
      northEastLng: -122.465977,
    };

    const segmentResponse = await fetch('/api/strava', {
      method: 'POST',
      headers: { Authorization: user.token.access_token },
      body: JSON.stringify(params),
    });

    const data = await segmentResponse.json();
    console.log(data.segments);

    setSegments(data.segments);
    setLoading(false);
  };

  const mainContent = loading ? (
    <LoadingComponent />
  ) : (
    <>
      <h3 className={styles.title}>Welcome {user.name}</h3>
      {!user.token && <StravaLoginButton loginAction={() => login()} />}
      {user.token && <Segments fetchAction={fetchSegments} segments={segments} />}
    </>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Strava Segment Explorer</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{mainContent}</main>

      <MapWithNoSSR segments={[]} />

      <div>{DISCLAIMER}</div>

      <footer style={{ width: '30%' }}>
        <PoweredByStrava />
      </footer>
    </div>
  );
};

const LoadingComponent = () => (
  <div>
    <h2>Loading...</h2>
  </div>
);

const StravaLoginButton = ({ loginAction }: { loginAction: () => void }) => (
  <div onClick={() => loginAction()} style={{ cursor: 'pointer' }}>
    <StarvaConnect />
  </div>
);

const Segments = ({ fetchAction, segments }: { fetchAction: () => void; segments: any[] }) => (
  <div style={{ paddingTop: '50px' }}>
    <div onClick={() => fetchAction()} style={{ cursor: 'pointer' }}>
      Fetch
    </div>
    <div>
      {/* <MapWithNoSSR segments={segments} /> */}
      {/* {segments.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))} */}
    </div>
  </div>
);

// Need to return null instead of undefined
// Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value.
const stravaAtheleteToUser = (stravaAthlete: any): User | null =>
  stravaAthlete
    ? {
        name: stravaAthlete.athlete.firstname,
        token: {
          expires_at: stravaAthlete.expires_at,
          expires_in: stravaAthlete.expires_in,
          access_token: stravaAthlete.access_token,
          refresh_token: stravaAthlete.refresh_token,
        },
      }
    : null;

export const getServerSideProps = async (context: any) => {
  const stravaLoginUrl = getStravaUrl();
  const stravaAthlete = context.query.code ? await getStravaAthlete(context.query.code.toString()) : null;
  const stravaUser = stravaAtheleteToUser(stravaAthlete);

  return {
    props: {
      stravaLoginUrl,
      stravaUser,
    },
  };
};

export default Home;
