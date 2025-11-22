import { PieChart, Pie, Cell, Tooltip } from "recharts";

// label custom agar teks tampil langsung
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="#F3F4F6" // text-gray-100
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartUI({ data, colors }) {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <PieChart width={330} height={330}>
        <Tooltip
          contentStyle={{
            background: "rgba(15,15,22,0.85)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#E5E7EB",
          }}
          labelStyle={{ color: "#A78BFA", fontWeight: 600 }}
          itemStyle={{ color: "#fff" }}
        />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={4}
          label={renderLabel} // label langsung tampil!
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
