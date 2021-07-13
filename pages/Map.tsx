import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from "leaflet";
import 'leaflet/dist/leaflet.css'

// https://github.com/PaulLeCam/react-leaflet/issues/753#issuecomment-821707234

const icon = L.icon({ iconUrl: "/leaflet/marker-icon.png" });

const Map = ({segments}:{segments:any[]}) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: 400, width: "100%"}}>
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
  )
}

export default Map