import React, { useEffect, useState } from "react";
import { useAuth, useRouter } from "../context/AppContext";
import { accountsApi } from "../api";
import { AccountResponse, AccountType, Currency } from "../types";
import { Card, Badge, Spinner, Toast, Button, Input, Select } from "../components/UI";

export default function AccountsPage() {
  const { user }     = useAuth();
  const { navigate } = useRouter();

  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const [form, setForm] = useState({
    accountType:    AccountType.Checking as string,
    currency:       Currency.USD         as string,
    initialDeposit: "",
  });

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchAccounts = async () => {
    try {
      const data = await accountsApi.getAll();
      setAccounts(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  // ── create ─────────────────────────────────────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await accountsApi.create({
        userId:        user!.userId,
        accountType:    form.accountType as AccountType,
        currency:       form.currency    as Currency,
        initialDeposit: Number(form.initialDeposit),
      });
      setSuccess("Account created!");
      setShowForm(false);
      setForm({ accountType: AccountType.Checking, currency: Currency.USD, initialDeposit: "" });
      await fetchAccounts();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── toggle active ─────────────────────────────────────────────────────────

  const toggleActive = async (acc: AccountResponse) => {
    try {
      await accountsApi.update(acc.accountId, { isActive: !acc.isActive });
      await fetchAccounts();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Soft-delete this account?")) return;
    try {
      await accountsApi.delete(id);
      setSuccess("Account deleted.");
      await fetchAccounts();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><Spinner size={36} /></div>;

  return (
    <div>
      {/* Header */}
      <div style={s.pageHead}>
        <h2 style={s.pageTitle}>Accounts</h2>
        <Button variant="primary" onClick={() => setShowForm(prev => !prev)}>
          {showForm ? "Cancel" : "+ New Account"}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card style={{ marginBottom: 20 }} title="New Account">
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, alignItems: "flex-end" }}>
            <Select
              label="Account Type"
              value={form.accountType}
              onChange={e => setForm(p => ({ ...p, accountType: e.target.value }))}
              options={Object.values(AccountType).map(v => ({ label: v, value: v }))}
              required
            />
            <Select
              label="Currency"
              value={form.currency}
              onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
              options={Object.values(Currency).map(v => ({ label: v, value: v }))}
              required
            />
            <Input
              label="Initial Deposit"
              type="number"
              value={form.initialDeposit}
              onChange={e => setForm(p => ({ ...p, initialDeposit: e.target.value }))}
              placeholder="0.00"
            />
            <Button type="submit" variant="primary">Create</Button>
          </form>
        </Card>
      )}

      {/* Account list */}
      {accounts.length === 0 ? (
        <Card><p style={{ color: "#64748b", fontSize: 14, textAlign: "center" as const }}>No accounts yet. Click <strong style={{ color: "#38bdf8" }}>+ New Account</strong> above.</p></Card>
      ) : (
        <div style={s.list}>
          {accounts.map(acc => (
            <div key={acc.accountId} style={s.row}>
              {/* Icon */}
              <div style={s.icon}>{acc.accountType[0]}</div>

              {/* Info */}
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => navigate("account-detail", { id: String(acc.accountId) })}>
                <p style={s.name}>{acc.accountType} · <span style={{ fontWeight: 400, color: "#64748b" }}>#{String(acc.accountNumber).slice(-6)}</span></p>
                <p style={s.sub}>Created {new Date(acc.createdAt).toLocaleDateString()} · {acc.currency}</p>
              </div>

              {/* Balance */}
              <p style={s.balance}>${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>

              {/* Status toggle */}
              <Badge variant={acc.isActive ? "success" : "danger"}>{acc.isActive ? "Active" : "Inactive"}</Badge>

              {/* Actions */}
              <div style={s.actions}>
                <button style={s.smallBtn} onClick={() => toggleActive(acc)} title={acc.isActive ? "Deactivate" : "Activate"}>
                  {acc.isActive ? "⏸" : "▶"}
                </button>
                <button style={{ ...s.smallBtn, color: "#f87171" }} onClick={() => handleDelete(acc.accountId)} title="Delete">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error   && <Toast message={error}   type="error"   onClose={() => setError("")}   />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}
    </div>
  );
}

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
  list: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           10,
  },
  row: {
    display:      "flex",
    alignItems:   "center",
    gap:          16,
    background:   "#151d2b",
    border:       "1px solid #1e3048",
    borderRadius: 12,
    padding:      "14px 18px",
    transition:   "border-color 0.2s",
  },
  icon: {
    width:          44,
    height:         44,
    borderRadius:   12,
    background:     "rgba(56,189,248,0.1)",
    color:          "#38bdf8",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontWeight:     700,
    fontSize:       20,
  },
  name: {
    color:      "#e2e8f0",
    fontSize:   15,
    fontWeight: 600,
    margin:     "0 0 3px",
  },
  sub: {
    color:    "#64748b",
    fontSize: 12,
    margin:   0,
  },
  balance: {
    color:      "#38bdf8",
    fontSize:   17,
    fontWeight: 700,
    margin:     0,
    minWidth:   100,
    textAlign:  "right" as const,
  },
  actions: {
    display: "flex",
    gap:     6,
  },
  smallBtn: {
    background:   "transparent",
    border:       "1px solid #1e3048",
    color:        "#94a3b8",
    width:        32,
    height:       32,
    borderRadius: 6,
    cursor:       "pointer",
    fontSize:     14,
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
  },
};
