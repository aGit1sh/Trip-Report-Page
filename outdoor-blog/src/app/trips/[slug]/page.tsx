"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { parseGPXData, TrailPoint } from "../../../lib/gpxParser";
import ElevationChart from "../../../components/ElevationChart";

// Dynamically import Leaflet map to bypass Server-Side Rendering (SSR) errors
const TripMap = dynamic(() => import("../../../components/TripMap"), { ssr: false });

export default function TripReportPage() {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  // Sample raw GPX loader (Replace this path with your uploaded GPX file URL)
  useEffect(() => {
    async function loadGPX() {
      try {
        const response = await fetch("/routes/overlord-mountain.gpx");
        const gpxText = await response.text();
        const parsed = parseGPXData(gpxText);
        setTrailPoints(parsed);
      } catch (err) {
        console.error("Failed to load GPX track:", err);
      }
    }
    loadGPX();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6">
        <span className="text-sky-400 text-sm font-mono tracking-wider uppercase">
          Canadian Rockies &bull; Scramble
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 text-white">
          Mt. Assiniboine Circuit
        </h1>
        <p className="text-slate-400 text-sm mt-2">Hiked on August 14 &bull; 42 km &bull; 1,850 m Gain</p>
      </header>

      {/* TWO-COLUMN SPLIT LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Narrative & Report Prose (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-lg">
          <div className="grid grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center text-sm font-mono mb-6">
            <div>
              <p className="text-slate-500 uppercase text-xs">Distance</p>
              <p className="text-xl font-bold text-white mt-1">42.5 km</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">Elevation Gain</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">+1,850 m</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase text-xs">Max Altitude</p>
              <p className="text-xl font-bold text-sky-400 mt-1">2,860 m</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">Route Summary & Approach</h2>
          <p>
            The trail begins along the clear waters of Spray Lakes before making a steady ascent up toward Assiniboine Pass. 
            Visibility was crystal clear during the morning approach, giving a unhindered view of the surrounding peaks.
          </p>

          {/* Photo Container Example */}
          <div className="my-6">
            <div className="aspect-video relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
              {/* Replace with actual image tag once configured */}
              <div className="flex items-center justify-center h-full text-slate-500 italic">
                [High-Res Ridge Photo / Drone Shot Placeholder]
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 italic text-center">
              Looking south toward Lake Magog from the lower ridge line.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">The Ridge Scramble</h2>
          <p>
            Beyond the pass, the terrain turns into loose scree and exposed limestone blocks. Care must be taken to navigate 
            the upper notch without dislodging rocks toward hikers below...
          </p>
        </div>

        {/* RIGHT COLUMN: Sticky Map & Data Visuals (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 space-y-6">
            {/* Interactive OpenStreetMap */}
            <div className="bg-slate-900 p-3 border border-slate-800 rounded-2xl shadow-xl">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 pl-1">
                Interactive GPS Track
              </h3>
              <TripMap trailPoints={trailPoints} activePointIndex={activePointIndex} />
            </div>

            {/* Synchronized Elevation Chart */}
            <ElevationChart trailPoints={trailPoints} onHoverPoint={setActivePointIndex} />
          </div>
        </div>

      </div>
    </main>
  );
}