"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { TrailPoint } from "../lib/gpxParser";
import { TripPhoto } from "../lib/trip";

const startIcon = L.divIcon({
  className: "trail-endpoint-icon",
  html: '<span class="trail-endpoint trail-start">S</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const finishIcon = L.divIcon({
  className: "trail-endpoint-icon",
  html: '<span class="trail-endpoint trail-finish">F</span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface TripMapProps {
  trailPoints: TrailPoint[];
  activePointIndex: number | null;
  photos: TripPhoto[];
  activePhotoId: string;
  onSelectPhoto: (id: string) => void;
}

function AutoFitBounds({ points }: { points: TrailPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [54, 54], maxZoom: 13 });
    }
  }, [points, map]);
  return null;
}

export default function TripMap({
  trailPoints,
  activePointIndex,
  photos,
  activePhotoId,
  onSelectPhoto,
}: TripMapProps) {
  const photoIcons = useMemo(
    () =>
      Object.fromEntries(
        photos.map((photo, index) => [
          photo.id,
          L.divIcon({
            className: "photo-marker-icon",
            html: `<span class="photo-marker${photo.id === activePhotoId ? " selected" : ""}">${String(index + 1).padStart(2, "0")}</span>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          }),
        ]),
      ),
    [activePhotoId, photos],
  );

  if (trailPoints.length === 0) return <div className="map-loading">Loading route data…</div>;

  const polylinePositions = trailPoints.map((point) => [point.lat, point.lng] as [number, number]);
  const activePoint = activePointIndex !== null ? trailPoints[activePointIndex] : null;
  const startPoint = trailPoints[0];
  const finishPoint = trailPoints[trailPoints.length - 1];

  return (
    <MapContainer
      center={[startPoint.lat, startPoint.lng]}
      zoom={11}
      className="trip-map"
      zoomControl={false}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={polylinePositions}
        pathOptions={{ color: "#82e4e0", weight: 3, opacity: 0.92 }}
      />
      <AutoFitBounds points={trailPoints} />

      {activePoint && (
        <Marker
          position={[activePoint.lat, activePoint.lng]}
          icon={L.divIcon({
            className: "active-point-icon",
            html: '<span class="active-point-pulse"></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          })}
          zIndexOffset={1000}
          interactive={false}
        />
      )}
      <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon} />
      <Marker position={[finishPoint.lat, finishPoint.lng]} icon={finishIcon} />
      {photos.map((photo, index) => {
        if (photo.lat === null || photo.lng === null) return null;
        return (
          <Marker
            key={photo.id}
            position={[photo.lat, photo.lng]}
            icon={photoIcons[photo.id]}
            eventHandlers={{ click: () => onSelectPhoto(photo.id) }}
          >
            <Popup>
              <div className="map-photo-popup">
                <div
                  className="map-popup-image"
                  style={{ backgroundImage: `url("${photo.imageUrl}")` }}
                />
                <span className="map-popup-kicker">PHOTO {String(index + 1).padStart(2, "0")}</span>
                <strong>{photo.caption}</strong>
                {photo.distanceKm !== null && photo.elevation !== null && (
                  <span>{photo.distanceKm.toFixed(1)} km · {photo.elevation.toLocaleString()} m</span>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}