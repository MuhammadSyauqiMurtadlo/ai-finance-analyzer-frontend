import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatMonth, formatRupiah } from "../utils/format";
import ChartCard from "./ChartCard";

const tick = { fontSize: 12, fill: "#64748b" };

export default function IncomeExpenseChart({ data = [], loading }) {
  const empty = !data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <ChartCard
      title="Income vs Expense"
      subtitle="6 bulan terakhir"
      loading={loading}
      empty={empty}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tickLine={false}
              axisLine={false}
              tick={tick}
            />
            <YAxis
              tickFormatter={formatCompact}
              tickLine={false}
              axisLine={false}
              width={56}
              tick={tick}
            />
            <Tooltip
              formatter={(value) => formatRupiah(value)}
              labelFormatter={formatMonth}
              cursor={{ fill: "#f1f5f9" }}
            />
            <Legend iconType="circle" />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
