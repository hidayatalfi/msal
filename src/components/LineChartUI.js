"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LineChartUI({
  data = [],
  lines = [], // [{ key: 'users', color: '#xxxxx' }]
  height = 300,
  title = "Title Here",
}) {
  return (
    <div className="w-full rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.03)] p-4 shadow-md backdrop-blur-md hover:shadow-lg">
      <div className="relative pb-5">
        <h1 className="text-lg font-semibold text-black">{title}</h1>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* Grid aesthetic */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#000", fontSize: 12 }}
              axisLine={{ stroke: "#000" }}
            />

            <YAxis
              tick={{ fill: "#00", fontSize: 12 }}
              axisLine={{ stroke: "#000" }}
            />

            {/* Tooltip UI premium */}
            <Tooltip
              contentStyle={{
                background: "rgba(100,100,100,0.2)",
                borderRadius: 12,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F3F4F6",
              }}
              labelStyle={{ color: "#A78BFA", fontWeight: 600 }}
              itemStyle={{ color: "#fff" }}
            />

            {/* Generate lines dynamically */}
            {lines.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#e2e8f0",
                  stroke: line.color,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 7, stroke: "#fff" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
