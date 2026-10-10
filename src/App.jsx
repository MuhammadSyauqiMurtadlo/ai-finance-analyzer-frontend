import { useCallback, useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./api/transactions";
import ConfirmDialog from "./components/ConfirmDialog";
import TransactionModal from "./components/TransactionModal";
import TransactionTable from "./components/TransactionTable";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, transaction: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      setError(null);
      setTransactions(await getTransactions());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const openAdd = () => setModal({ open: true, transaction: null });
  const openEdit = (transaction) => setModal({ open: true, transaction });
  const closeModal = useCallback(
    () => setModal({ open: false, transaction: null }),
    [],
  );
  const closeConfirm = useCallback(() => setToDelete(null), []);

  // Error dilempar balik ke modal supaya ditampilkan di form
  const handleSave = async (payload) => {
    if (modal.transaction) {
      await updateTransaction(modal.transaction.id, payload);
    } else {
      await createTransaction(payload);
    }
    await loadTransactions();
    closeModal();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(toDelete.id);
      await loadTransactions();
    } catch (err) {
      setError(err.message);
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

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadTransactions}
              className="font-medium underline underline-offset-2"
            >
              Coba lagi
            </button>
          </div>
        )}

        <TransactionTable
          transactions={transactions}
          loading={loading}
          onEdit={openEdit}
          onDelete={setToDelete}
        />
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
    </div>
  );
}
