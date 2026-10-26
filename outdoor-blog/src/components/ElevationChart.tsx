"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { TrailPoint } from "../lib/gpxParser";

interface ChartProps {
  trailPoints: TrailPoint[];
  onHoverPoint: (index: number | null) => void;
}

export default function ElevationChart({ trailPoints, onHoverPoint }: ChartProps) {
  if (trailPoints.length === 0) {
    return <div className="chart-loading">Waiting for GPX elevation data…</div>;
  }

  return (
    <div className="elevation-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trailPoints}
          margin={{ top: 10, right: 5, bottom: 0, left: 0 }}
          onMouseMove={(state) => {
            if (state && typeof state.activeTooltipIndex === "number") {
              onHoverPoint(state.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => onHoverPoint(null)}
        >
          <defs>
            <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="4%" stopColor="#8be6df" stopOpacity={0.34} />
              <stop offset="100%" stopColor="#8be6df" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="distanceKm"
            type="number"
            scale="linear"
            domain={["dataMin", "dataMax"]}
            tickCount={6}
            tickFormatter={(value: number) => `${Math.round(value)} km`}
            stroke="#586b78"
            tick={{ fontSize: 10, fill: "#82919b" }}
            tickLine={false}
            axisLine={false}
            minTickGap={38}
          />
          <YAxis
            domain={["dataMin - 80", "dataMax + 80"]}
            tickFormatter={(value: number) => `${(value).toFixed(0)}`}
            stroke="#586b78"
            tick={{ fontSize: 10, fill: "#82919b" }}
            tickLine={false}
            axisLine={false}
            width={38}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TrailPoint;
                return (
                  <div className="chart-tooltip">
                    <span>{data.distanceKm.toFixed(1)} KM</span>
                    <strong>{Math.round(data.elevation).toLocaleString()} M</strong>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: "#d5f4ef", strokeDasharray: "3 4", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="#8be6df"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#elevationGrad)"
            activeDot={{ r: 4, fill: "#d8fffb", stroke: "#375c61", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}