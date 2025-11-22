"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function BarChartUI({
  data = [],
  height = 300,
  bars = [], // [{ dataKey: "...", color: "#..." }]
  xAxisColor = "#000",
  yAxisColor = "#000",
  showGrid = true,
  title = "Title Here",
}) {
  return (
    <div className="w-full rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.03)] p-4 shadow-md backdrop-blur-md hover:shadow-lg">
      <div className="relative pb-5">
        <h1 className="text-lg font-semibold text-black">{title}</h1>
      </div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barRadius={[8, 8, 0, 0]}>
            {/* Grid */}
            {showGrid && (
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            )}

            {/* X Axis */}
            <XAxis
              dataKey="name"
              tick={{ fill: xAxisColor, fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: xAxisColor }}
              tickLine={{ stroke: xAxisColor }}
            />

            {/* Y Axis */}
            <YAxis
              tick={{ fill: yAxisColor, fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: yAxisColor }}
              tickLine={{ stroke: yAxisColor }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
              cursor={{
                fill: "rgba(22, 22, 22, 0.1)", // warna elemen belakang bar saat hover
              }}
            />

            {/* Dynamic Bars */}
            {bars.map((bar, i) => (
              <Bar
                key={i}
                dataKey={bar.dataKey}
                fill={bar.color || "#6366F1"}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
