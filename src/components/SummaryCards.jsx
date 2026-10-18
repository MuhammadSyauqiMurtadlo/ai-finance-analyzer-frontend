import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function SummaryCards({ summary, loading }) {
  const items = [
    {
      label: "Total Income",
      value: summary?.total_income,
      icon: TrendingUp,
      iconClass: "bg-emerald-50 text-emerald-600",
      valueClass: "text-slate-900",
    },
    {
      label: "Total Expense",
      value: summary?.total_expense,
      icon: TrendingDown,
      iconClass: "bg-rose-50 text-rose-600",
      valueClass: "text-slate-900",
    },
    {
      label: "Balance",
      value: summary?.balance,
      icon: Wallet,
      iconClass: "bg-indigo-50 text-indigo-600",
      valueClass: summary?.balance < 0 ? "text-rose-600" : "text-slate-900",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, iconClass, valueClass }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{label}</p>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
            >
              <Icon size={18} />
            </div>
          </div>

          {loading ? (
            <div className="mt-3 h-8 w-3/4 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <p
              className={`mt-3 break-words text-2xl font-semibold tabular-nums ${valueClass}`}
            >
              {formatRupiah(value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
