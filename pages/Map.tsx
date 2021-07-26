import useSSR from 'use-ssr';

import 'leaflet/dist/leaflet.css';
import { SegmentExploreParams } from './api/types';

const Map = ({
  segments,
  updateSegments,
}: {
  segments: any[];
  updateSegments: (params: SegmentExploreParams) => void;
}) => {
  // NOTE: Build fails if leaflet is imported in the beginning of the file
  const { isServer } = useSSR();
  if (isServer) return <></>;

  // https://github.com/PaulLeCam/react-leaflet/issues/45
  // https://github.com/PaulLeCam/react-leaflet/issues/753#issuecomment-821707234

  const { MapContainer, Marker, Popup, TileLayer } = require('react-leaflet');
  const L = require('leaflet');
  const icon = L.icon({ iconUrl: '/leaflet/marker-icon.png' });

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: 400, width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]} icon={icon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <SegmentList updateSegments={updateSegments} />
    </MapContainer>
  );
};

const SegmentList = ({ updateSegments }: { updateSegments: (params: SegmentExploreParams) => void }) => {
  const { useMapEvents } = require('react-leaflet');

  const map = useMapEvents({
    moveend() {
      getSegments();
    },
  });

  const getSegments = () => {
    const b = map.getBounds();
    const extend = map.getZoom() / 1000;
    const params: SegmentExploreParams = {
      northEastLng: b.getNorthEast().lng + extend,
      northEastLat: b.getNorthEast().lat + extend,
      southWestLng: b.getSouthWest().lng - extend,
      southWestLat: b.getSouthWest().lat - extend,
    };
    updateSegments(params);
  };

  return <></>;
};

export default Map;
