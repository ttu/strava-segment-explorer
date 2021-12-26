import React from 'react';
import useSSR from 'use-ssr';
import 'leaflet/dist/leaflet.css';
import { MapSearchUpdateParams, MapSelection, SegmentExploreParams, StravaSegment } from './api/types';

const Map = ({
  segments,
  mapSelection,
  mapUpdateEvent,
}: {
  segments: StravaSegment[];
  mapSelection: MapSelection;
  mapUpdateEvent: (params: MapSearchUpdateParams) => void;
}) => {
  // NOTE: Build fails if leaflet is imported in the beginning of the file
  const { isServer } = useSSR();
  if (isServer) return <></>;

  // https://github.com/PaulLeCam/react-leaflet/issues/45
  // https://github.com/PaulLeCam/react-leaflet/issues/753#issuecomment-821707234

  const { MapContainer, TileLayer } = require('react-leaflet');

  return (
    <MapContainer
      center={mapSelection.center}
      zoom={mapSelection.zoom}
      scrollWheelZoom={false}
      style={{ height: 400, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerList segments={segments} />
      <SegmentUpdater mapUpdaveEvent={mapUpdateEvent} />
    </MapContainer>
  );
};

const MarkerList = ({ segments }: { segments: StravaSegment[] }) => {
  const { Marker, Popup } = require('react-leaflet');
  const L = require('leaflet');
  const icon = L.icon({ iconUrl: '/leaflet/marker-icon.png' });

  const markers = segments.map((segment) => (
    <Marker position={[segment.start_latlng[0], segment.start_latlng[1]]} icon={icon}>
      <Popup>{segment.name}</Popup>
    </Marker>
  ));

  return <>{markers}</>;
};

const SegmentUpdater = ({ mapUpdaveEvent }: { mapUpdaveEvent: (params: MapSearchUpdateParams) => void }) => {
  const { useMapEvents } = require('react-leaflet');

  const map = useMapEvents({
    moveend() {
      const b = map.getBounds();
      const center = b.getCenter();
      const zoom = map.getZoom();
      const extend = zoom / 1000;

      const params: MapSearchUpdateParams = {
        mapSelection: {
          center: [center.lat, center.lng],
          zoom,
        },
        searchParams: {
          northEastLng: b.getNorthEast().lng + extend,
          northEastLat: b.getNorthEast().lat + extend,
          southWestLng: b.getSouthWest().lng - extend,
          southWestLat: b.getSouthWest().lat - extend,
        },
      };
      mapUpdaveEvent(params);
    },
  });

  return <></>;
};

export default Map;
