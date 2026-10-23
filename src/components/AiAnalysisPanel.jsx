import { useState } from "react";
import {
  CircleAlert,
  Lightbulb,
  ListChecks,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";
import { analyzeFinances } from "../api/ai";

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

function BulletList({ icon: Icon, title, items, iconClass }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AiAnalysisPanel({ dataVersion }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [analyzedAt, setAnalyzedAt] = useState(null);
  const [analyzedVersion, setAnalyzedVersion] = useState(null);

  const handleAnalyze = async () => {
    const versionAtRequest = dataVersion;
    setStatus("loading");
    setError("");

    try {
      const data = await analyzeFinances();
      setResult(data);
      setAnalyzedAt(new Date());
      setAnalyzedVersion(versionAtRequest);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const loading = status === "loading";
  const stale = status === "success" && analyzedVersion !== dataVersion;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Sparkles size={18} className="text-indigo-600" />
            AI Financial Analysis
          </h2>
          <p className="text-sm text-slate-500">
            AI membaca data transaksimu dan memberi ringkasan, insight, dan
            saran.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? "Analyzing..." : "Analyze My Finances with AI"}
        </button>
      </div>

      {status === "loading" && (
        <div className="mt-5 space-y-3" aria-live="polite">
          <p className="text-sm text-slate-500">
            Menganalisis data keuanganmu, mohon tunggu...
          </p>
          <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <div>
            <p>{error}</p>
            <button
              type="button"
              onClick={handleAnalyze}
              className="mt-1 font-medium underline underline-offset-2"
            >
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {status === "success" && result && (
        <div className="mt-5 space-y-4">
          {stale && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Data transaksi berubah sejak analisis ini dibuat. Klik tombol di
              atas untuk memperbarui hasilnya.
            </p>
          )}
          <div className="rounded-xl bg-indigo-50/60 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Ringkasan
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {result.summary}
            </p>
          </div>

          <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
            <Tag size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold">
                Kategori Pengeluaran Terbesar
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {result.top_category}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <BulletList
              icon={Lightbulb}
              title="Insight"
              items={result.insights}
              iconClass="text-amber-500"
            />
            <BulletList
              icon={ListChecks}
              title="Saran"
              items={result.suggestions}
              iconClass="text-emerald-600"
            />
          </div>

          <p className="text-xs text-slate-400">
            Dianalisis pada {formatDateTime(analyzedAt)}. Dibuat oleh AI
            berdasarkan data transaksimu, bukan saran keuangan profesional.
          </p>
        </div>
      )}
    </section>
  );
}
