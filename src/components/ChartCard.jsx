export default function ChartCard({
  title,
  subtitle,
  loading,
  empty,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>

      <div className="mt-4">
        {loading ? (
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        ) : empty ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            Belum ada data
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
