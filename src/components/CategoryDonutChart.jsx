import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS } from "../utils/categories";
import { formatRupiah } from "../utils/format";
import ChartCard from "./ChartCard";

const colorOf = (category) => CATEGORY_COLORS[category] ?? "#94a3b8";

export default function CategoryDonutChart({
  title,
  subtitle,
  data = [],
  loading,
}) {
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      loading={loading}
      empty={data.length === 0}
    >
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.category} fill={colorOf(d.category)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatRupiah(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {data.map((d) => (
          <li
            key={d.category}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colorOf(d.category) }}
              />
              {d.category}
            </span>
            <span className="tabular-nums text-slate-900">
              {formatRupiah(d.total)}{" "}
              <span className="text-slate-400">
                ({Math.round((d.total / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
