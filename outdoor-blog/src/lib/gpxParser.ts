import { gpx } from "@tmcw/togeojson";

export interface TrailPoint {
  lat: number;
  lng: number;
  elevation: number; // meters
  distanceKm: number; // accumulated distance
}

// Haversine formula to calculate real distance between two GPS coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parseGPXData(xmlString: string): TrailPoint[] {
  const dom = new DOMParser().parseFromString(xmlString, "text/xml");
  const geojson = gpx(dom);
  
  const parsedPoints: TrailPoint[] = [];
  let totalDistance = 0;

  // Extract coordinates from GeoJSON LineString
  const features = geojson.features;
  for (const feature of features) {
    if (feature.geometry.type === "LineString") {
      const coords = feature.geometry.coordinates;
      
      for (let i = 0; i < coords.length; i++) {
        const [lng, lat, elevation = 0] = coords[i];
        
        if (i > 0) {
          const prev = coords[i - 1];
          totalDistance += calculateDistance(prev[1], prev[0], lat, lng);
        }

        parsedPoints.push({
          lat,
          lng,
          elevation: Math.round(elevation),
          distanceKm: parseFloat(totalDistance.toFixed(2)),
        });
      }
    }
  }

  return parsedPoints;
}