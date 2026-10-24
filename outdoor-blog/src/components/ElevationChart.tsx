"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { TrailPoint } from "../lib/gpxParser";

interface ChartProps {
  trailPoints: TrailPoint[];
  onHoverPoint: (index: number | null) => void;
}

export default function ElevationChart({ trailPoints, onHoverPoint }: ChartProps) {
  return (
    <div className="w-full h-[220px] bg-slate-900/90 p-4 rounded-xl shadow-lg border border-slate-800">
      <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
        Elevation Profile (Meters vs. Kilometers)
      </p>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={trailPoints}
          onMouseMove={(state) => {
            if (state && typeof state.activeTooltipIndex === "number") {
              onHoverPoint(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => onHoverPoint(null)}
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="distanceKm" unit="km" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis domain={['dataMin - 100', 'dataMax + 100']} stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TrailPoint;
                return (
                  <div className="bg-slate-950 border border-slate-700 p-2 rounded text-xs text-slate-100">
                    <p>Distance: <span className="text-sky-400 font-bold">{data.distanceKm} km</span></p>
                    <p>Elevation: <span className="text-emerald-400 font-bold">{data.elevation} m</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="elevation" stroke="#38bdf8" fillOpacity={1} fill="url(#elevationGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}