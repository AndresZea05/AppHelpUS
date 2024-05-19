import React from "react";
import { Marker } from "react-leaflet";
import data from '../../../assets/data/data.json';

const Markers = () => {
  return (
    <>
      {data.places.map((place, index) => (
        <Marker key={index} position={place.geometry} />
      ))}
    </>
  );
};

export default Markers;