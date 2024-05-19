import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from "react-leaflet";
import '../../../assets/css/Servicio.css';
import '../../../assets/css/maps.css';
import "leaflet/dist/leaflet.css";
import Markers from "./Markers";

const MapsViews = ({ center }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Accessing the Leaflet map instance and updating its view
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }, [center]);

  return (
    <MapContainer center={center} zoom={16} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Markers />
    </MapContainer>
  );
};

export default MapsViews;
