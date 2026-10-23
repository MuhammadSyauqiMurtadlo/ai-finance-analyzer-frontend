import { useCallback, useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { getDashboard } from "./api/dashboard";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "./api/transactions";
import AiAnalysisPanel from "./components/AiAnalysisPanel";
import CategoryDonutChart from "./components/CategoryDonutChart";
import ConfirmDialog from "./components/ConfirmDialog";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import SummaryCards from "./components/SummaryCards";
import Toast from "./components/Toast";
import TransactionModal from "./components/TransactionModal";
import TransactionTable from "./components/TransactionTable";

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0); // naik setiap data transaksi berubah

  const [modal, setModal] = useState({ open: false, transaction: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    (type, message) => setToast({ type, message }),
    [],
  );
  const closeToast = useCallback(() => setToast(null), []);

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);
      setDashboard(await getDashboard());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const openAdd = () => setModal({ open: true, transaction: null });
  const openEdit = (transaction) => setModal({ open: true, transaction });
  const closeModal = useCallback(
    () => setModal({ open: false, transaction: null }),
    [],
  );
  const closeConfirm = useCallback(() => setToDelete(null), []);

  const handleSave = async (payload) => {
    const isEdit = Boolean(modal.transaction);

    if (isEdit) {
      await updateTransaction(modal.transaction.id, payload);
    } else {
      await createTransaction(payload);
    }

    setDataVersion((v) => v + 1);
    await loadDashboard();
    closeModal();
    showToast(
      "success",
      isEdit
        ? "Transaksi berhasil diperbarui."
        : "Transaksi berhasil ditambahkan.",
    );
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(toDelete.id);
      setDataVersion((v) => v + 1);
      await loadDashboard();
      showToast("success", "Transaksi berhasil dihapus.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Wallet size={18} />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">
                AI Finance Analyzer
              </h1>
              <p className="text-xs text-slate-500">
                Personal finance dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadDashboard}
              className="shrink-0 font-medium underline underline-offset-2"
            >
              Coba lagi
            </button>
          </div>
        )}

        {(loading || dashboard) && (
          <>
            <SummaryCards summary={dashboard?.summary} loading={loading} />

            <AiAnalysisPanel dataVersion={dataVersion} />

            <IncomeExpenseChart
              data={dashboard?.income_vs_expense}
              loading={loading}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryDonutChart
                title="Expense by Category"
                subtitle="Semua pengeluaran"
                data={dashboard?.expense_by_category}
                loading={loading}
              />
              <CategoryDonutChart
                title="Income by Type"
                subtitle="Semua pemasukan"
                data={dashboard?.income_by_category}
                loading={loading}
              />
            </div>

            <TransactionTable
              transactions={dashboard?.recent_transactions ?? []}
              loading={loading}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          </>
        )}
      </main>

      {modal.open && (
        <TransactionModal
          transaction={modal.transaction}
          onSubmit={handleSave}
          onClose={closeModal}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Hapus transaksi ini?"
          message={`Transaksi ${toDelete.category} akan dihapus permanen dan tidak bisa dikembalikan.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={closeConfirm}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
