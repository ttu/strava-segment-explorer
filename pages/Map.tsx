import useSSR from 'use-ssr';

import 'leaflet/dist/leaflet.css';

const Map = ({ segments }: { segments: any[] }) => {
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
    </MapContainer>
  );
};

export default Map;
