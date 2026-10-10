import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../utils/categories";
import { formatRupiah } from "../utils/format";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, zona waktu lokal

const buildInitial = (t) =>
  t
    ? {
        type: t.type,
        amount: String(Number(t.amount)),
        category: t.category,
        date: t.date,
        note: t.note ?? "",
      }
    : { type: "", amount: "", category: "", date: today(), note: "" };

const validate = (f) => {
  const errors = {};
  const amount = Number(f.amount);

  if (!f.type) errors.type = "Pilih tipe transaksi.";
  if (f.amount === "" || Number.isNaN(amount) || amount <= 0)
    errors.amount = "Nominal harus berupa angka lebih dari 0.";
  if (!f.category) errors.category = "Pilih kategori.";
  if (!f.date) errors.date = "Tanggal wajib diisi.";

  return errors;
};

const inputClass = (hasError) =>
  `mt-1.5 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 ${
    hasError
      ? "border-rose-300 focus:ring-rose-200"
      : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
  }`;

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {children}
      </label>
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export default function TransactionModal({ transaction, onSubmit, onClose }) {
  const isEdit = Boolean(transaction);
  const [form, setForm] = useState(() => buildInitial(transaction));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, submitting]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleTypeChange = (type) => {
    // kategori income/expense berbeda, jadi reset saat tipe berganti
    setForm((f) => ({
      ...f,
      type,
      category: f.type === type ? f.category : "",
    }));
    setErrors((e) => ({ ...e, type: undefined, category: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        note: form.note.trim() || null,
      });
    } catch (err) {
      // err = { message, errors } dari interceptor Axios
      const fieldErrors = {};
      Object.entries(err.errors || {}).forEach(([field, msgs]) => {
        fieldErrors[field] = msgs[0];
      });
      setErrors(fieldErrors);
      setServerError(Object.keys(fieldErrors).length ? "" : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const amountNumber = Number(form.amount);
  const amountHint =
    amountNumber > 0
      ? `= ${formatRupiah(amountNumber)}`
      : "Masukkan nominal dalam Rupiah";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4"
      onMouseDown={(e) =>
        e.target === e.currentTarget && !submitting && onClose()
      }
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="tx-modal-title" className="text-base font-semibold">
              {isEdit ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? "Perbarui detail transaksi."
                : "Catat pemasukan atau pengeluaran baru."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {serverError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {serverError}
            </p>
          )}

          {/* Transaction Type */}
          <div>
            <span className="block text-sm font-medium text-slate-700">
              Transaction Type
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
              {["income", "expense"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={`rounded-md py-1.5 text-sm font-medium capitalize transition ${
                    form.type === t
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-600">{errors.type}</p>
            )}
          </div>

          <Field label="Amount" error={errors.amount} hint={amountHint}>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="9999999999999.99"
              step="any"
              value={form.amount}
              onChange={(e) => setField("amount", e.target.value)}
              placeholder="50000"
              className={inputClass(errors.amount)}
            />
          </Field>

          <Field label="Category" error={errors.category}>
            <select
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              disabled={!form.type}
              className={inputClass(errors.category)}
            >
              <option value="">
                {form.type ? "Select category" : "Pilih tipe terlebih dahulu"}
              </option>
              {(CATEGORIES[form.type] || []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date" error={errors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className={inputClass(errors.date)}
            />
          </Field>

          <Field label="Note (optional)" error={errors.note}>
            <textarea
              rows={2}
              maxLength={1000}
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
              placeholder="Contoh: makan siang"
              className={inputClass(errors.note)}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
