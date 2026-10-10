import { Pencil, Trash2, Inbox } from "lucide-react";
import { formatDate, formatRupiah } from "../utils/format";

const RECENT_LIMIT = 10;

function TypeBadge({ type }) {
  const styles =
    type === "income"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : "bg-rose-50 text-rose-700 ring-rose-600/20";

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${styles}`}
    >
      {type}
    </span>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 animate-pulse rounded-md bg-slate-100" />
      ))}
    </div>
  );
}

export default function TransactionTable({
  transactions,
  loading,
  onEdit,
  onDelete,
}) {
  const recent = transactions.slice(0, RECENT_LIMIT);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold">Recent Transactions</h2>
        <p className="text-sm text-slate-500">10 transaksi terbaru</p>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : recent.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-14 text-center">
          <Inbox size={32} className="text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Belum ada transaksi
          </p>
          <p className="text-sm text-slate-400">
            Klik "Add Transaction" untuk mulai mencatat.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Note
                </th>
                <th className="px-5 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium">
                    {t.category}
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-3.5 text-right font-medium tabular-nums ${
                      t.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatRupiah(t.amount)}
                  </td>
                  <td className="hidden max-w-[16rem] truncate px-5 py-3.5 text-slate-500 md:table-cell">
                    {t.note || "-"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(t)}
                      aria-label={`Edit transaksi ${t.category}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      aria-label={`Hapus transaksi ${t.category}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
