"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TrailPoint } from "../lib/gpxParser";

// Fix for default Leaflet icon paths in Next.js
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface TripMapProps {
  trailPoints: TrailPoint[];
  activePointIndex: number | null;
}

// Helper to auto-center map bounds around the GPX trail
function AutoFitBounds({ points }: { points: TrailPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [points, map]);
  return null;
}

export default function TripMap({ trailPoints, activePointIndex }: TripMapProps) {
  if (!trailPoints || trailPoints.length === 0) return <div>Loading Map...</div>;

  const polylinePositions = trailPoints.map((p) => [p.lat, p.lng] as [number, number]);
  const activePoint = activePointIndex !== null ? trailPoints[activePointIndex] : null;

  return (
    <MapContainer
      center={[trailPoints[0].lat, trailPoints[0].lng]}
      zoom={12}
      className="h-[350px] w-full rounded-xl shadow-inner z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={polylinePositions} color="#dc2626" weight={4} opacity={0.8} />
      <AutoFitBounds points={trailPoints} />

      {/* Dynamic Marker that moves when user hovers over Elevation Chart */}
      {activePoint && (
        <Marker position={[activePoint.lat, activePoint.lng]} icon={customIcon}>
          <Popup>
            <div className="text-sm font-semibold">
              <p>Dist: {activePoint.distanceKm} km</p>
              <p>Elev: {activePoint.elevation} m</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}