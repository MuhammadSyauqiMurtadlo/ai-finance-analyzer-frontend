import { useEffect, useState } from "react";
import { getTransactions } from "./api/transactions";
import { formatDate, formatRupiah } from "./utils/format";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">AI Finance Analyzer</h1>
      <p className="mt-1 text-sm text-slate-500">Tes koneksi React ↔ Laravel</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading && <p className="text-slate-500">Memuat data...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <p className="text-slate-500">Belum ada transaksi.</p>
        )}

        <ul className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(t.date)} · {t.note || "-"}
                </p>
              </div>
              <span
                className={
                  t.type === "income" ? "text-emerald-600" : "text-rose-600"
                }
              >
                {t.type === "income" ? "+" : "-"}
                {formatRupiah(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
