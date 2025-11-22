"use client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const data = [
    { name: "Jan", uv: 400, pv: 240, amt: 240 },
    { name: "Feb", uv: 300, pv: 139, amt: 221 },
    { name: "Mar", uv: 200, pv: 980, amt: 229 },
    { name: "Apr", uv: 278, pv: 390, amt: 200 },
    { name: "May", uv: 189, pv: 480, amt: 218 },
    { name: "Jun", uv: 239, pv: 380, amt: 250 },
  ];

  const pieData = [
    { name: "A", value: 400 },
    { name: "B", value: 300 },
    { name: "C", value: 300 },
    { name: "D", value: 200 },
  ];

  const pieColors = ["#60A5FA", "#A78BFA", "#F472B6", "#34D399"];

  return (
    <div className="animate-aurora min-h-screen w-full p-8 text-white">
      <h1 className="mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
        Dashboard Analytics
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LINE CHART */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
          <h2 className="mb-3 text-lg font-semibold">Line Chart</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="#ccc" dataKey="name" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="url(#gradientLine)"
                  strokeWidth={3}
                  dot={false}
                />
                <defs>
                  <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
          <h2 className="mb-3 text-lg font-semibold">Bar Chart</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="#ccc" dataKey="name" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 10,
                  }}
                />
                <Bar dataKey="pv" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AREA CHART */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
          <h2 className="mb-3 text-lg font-semibold">Area Chart</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="#ccc" dataKey="name" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 10,
                  }}
                />

                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#60A5FA"
                  fill="url(#areaGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
          <h2 className="mb-3 text-lg font-semibold">Pie Chart</h2>
          <div className="flex h-64 w-full items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 10,
                  }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
