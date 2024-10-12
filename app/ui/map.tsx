import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  zoom: number;
}

const OpenStreetMap: React.FC<MapProps> = ({ center, zoom }) => {
  const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
  );

  const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
  );

  return (
    <div className='absolute z-0' style={{width: "100%", height: "calc(100% - 50px)", zIndex: "0", padding: "0 15px 15px 15px", borderRadius: "15px"}}>
      <MapContainer center={center} zoom={zoom} maxZoom={5} style={{width: "100%", height: "100%", zIndex: "0", borderRadius: "15px"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; Nanyang Nerds PSA Code Sprint 2024'
        />
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;