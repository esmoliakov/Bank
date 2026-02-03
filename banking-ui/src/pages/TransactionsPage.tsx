import React, { useEffect, useState } from "react";
import { accountsApi, transactionsApi } from "../api";
import { AccountResponse, TransactionResponse, TransactionType } from "../types";
import { Card, Badge, Spinner, Toast, Button, Input, Select } from "../components/UI";

export default function TransactionsPage() {
  const [accounts,    setAccounts]    = useState<AccountResponse[]>([]);
  const [history,     setHistory]     = useState<TransactionResponse[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [lookupId,    setLookupId]    = useState("");
  const [lookedUp,    setLookedUp]    = useState<TransactionResponse | null>(null);

  const [form, setForm] = useState({
    fromAccountId:  "" as string,
    toAccountId:    "" as string,
    amount:         "",
    transactionType: TransactionType.Deposit as string,
    description:    "",
  });

  // ── fetch accounts ────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const accs = await accountsApi.getAll();
        setAccounts(accs);
      } catch (e: unknown) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── create transaction ────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const txn = await transactionsApi.create({
        fromAccountId:  Number(form.fromAccountId),
        toAccountId:    form.transactionType === TransactionType.Transfer ? Number(form.toAccountId) : undefined,
        amount:         Number(form.amount),
        transactionType: form.transactionType as TransactionType,
        description:    form.description || undefined,
      });
      setSuccess("Transaction created!");
      setHistory(prev => [txn, ...prev]);
      setForm({ fromAccountId: form.fromAccountId, toAccountId: "", amount: "", transactionType: TransactionType.Deposit, description: "" });
      setShowForm(false);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── lookup by ID ──────────────────────────────────────────────────────────

  const handleLookup = async () => {
    setLookedUp(null);
    setError("");
    try {
      const txn = await transactionsApi.getById(Number(lookupId));
      setLookedUp(txn);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await transactionsApi.delete(id);
      setSuccess("Transaction deleted.");
      setHistory(prev => prev.filter(t => t.transactionId !== id));
      if (lookedUp?.transactionId === id) setLookedUp(null);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><Spinner size={36} /></div>;

  const accOptions = accounts.map(a => ({
    label: `${a.accountType} · #${String(a.accountNumber).slice(-4)} (${a.currency})`,
    value: String(a.accountId),
  }));

  const txnTypeOptions = Object.values(TransactionType).map(v => ({ label: v, value: v }));

  return (
    <div>
      {/* Header */}
      <div style={s.pageHead}>
        <h2 style={s.pageTitle}>Transactions</h2>
        <Button variant="primary" onClick={() => setShowForm(prev => !prev)}>
          {showForm ? "Cancel" : "+ New Transaction"}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card title="New Transaction" style={{ marginBottom: 20 }}>
          <form onSubmit={handleCreate} style={s.formGrid}>
            <Select label="From Account" value={form.fromAccountId} onChange={e => setForm(p => ({ ...p, fromAccountId: e.target.value }))} options={[{ label: "Select…", value: "" }, ...accOptions]} required />
            <Select label="Transaction Type" value={form.transactionType} onChange={e => setForm(p => ({ ...p, transactionType: e.target.value }))} options={txnTypeOptions} required />
            {form.transactionType === TransactionType.Transfer && (
              <Select label="To Account" value={form.toAccountId} onChange={e => setForm(p => ({ ...p, toAccountId: e.target.value }))} options={[{ label: "Select…", value: "" }, ...accOptions]} required />
            )}
            <Input label="Amount" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" required />
            <Input label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional note" />
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 4 }}>
              <Button type="submit" variant="primary">Submit</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lookup by ID */}
      <Card title="Lookup Transaction by ID" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <Input label="Transaction ID" type="number" value={lookupId} onChange={e => setLookupId(e.target.value)} placeholder="e.g. 1" style={{ flex: 1 }} />
          <Button variant="secondary" onClick={handleLookup} disabled={!lookupId}>Search</Button>
        </div>
        {lookedUp && (
          <div style={{ marginTop: 16 }}>
            <TxnRow txn={lookedUp} onDelete={handleDelete} />
          </div>
        )}
      </Card>

      {/* Session history */}
      {history.length > 0 && (
        <Card title="Session History">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {history.map(t => <TxnRow key={t.transactionId} txn={t} onDelete={handleDelete} />)}
          </div>
        </Card>
      )}

      {error   && <Toast message={error}   type="error"   onClose={() => setError("")}   />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function TxnRow({ txn, onDelete }: { txn: TransactionResponse; onDelete: (id: number) => void }) {
  const isCredit = txn.transactionType === TransactionType.Deposit;

  return (
    <div style={s.txnRow}>
      <div style={{
        ...s.txnIcon,
        background: isCredit ? "rgba(74,222,128,0.12)" : txn.transactionType === TransactionType.Transfer ? "rgba(167,139,250,0.12)" : "rgba(248,113,113,0.12)",
        color:      isCredit ? "#4ade80" : txn.transactionType === TransactionType.Transfer ? "#a78bfa" : "#f87171",
      }}>
        {isCredit ? "↓" : txn.transactionType === TransactionType.Transfer ? "⇄" : "↑"}
      </div>

      <div style={{ flex: 1 }}>
        <p style={s.txnTitle}>{txn.transactionType} {txn.description ? `· ${txn.description}` : ""}</p>
        <p style={s.txnSub}>
          #{txn.transactionId} · From Acc {txn.fromAccountId}
          {txn.toAccountId ? ` → Acc ${txn.toAccountId}` : ""}
          · {new Date(txn.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={{ textAlign: "right" as const }}>
        <p style={{ ...s.txnAmt, color: isCredit ? "#4ade80" : "#f87171" }}>
          {isCredit ? "+" : "−"}${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <p style={s.txnSub}>Balance after: ${txn.balanceAfter.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <Badge variant={txn.status === "Completed" ? "success" : "warning"}>{txn.status}</Badge>
        <button style={s.delBtn} onClick={() => onDelete(txn.transactionId)} title="Delete">🗑</button>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  pageHead: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   20,
  },
  pageTitle: {
    color:      "#f1f5f9",
    fontSize:   22,
    fontWeight: 700,
    margin:     0,
  },
  formGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 14,
  },
  txnRow: {
    display:      "flex",
    alignItems:   "center",
    gap:          14,
    background:   "#0f1420",
    border:       "1px solid #1e3048",
    borderRadius: 10,
    padding:      "12px 14px",
  },
  txnIcon: {
    width:          40,
    height:         40,
    borderRadius:   10,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontWeight:     700,
    fontSize:       18,
    flexShrink:     0,
  },
  txnTitle: {
    color:      "#e2e8f0",
    fontSize:   14,
    fontWeight: 600,
    margin:     "0 0 2px",
  },
  txnSub: {
    color:    "#64748b",
    fontSize: 11,
    margin:   0,
  },
  txnAmt: {
    fontSize:   17,
    fontWeight: 700,
    margin:     "0 0 2px",
  },
  delBtn: {
    background:   "transparent",
    border:       "1px solid #1e3048",
    color:        "#f87171",
    width:        30,
    height:       30,
    borderRadius: 6,
    cursor:       "pointer",
    fontSize:     13,
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
  },
};
