import React, { useEffect, useState } from "react";
import { useAuth, useRouter } from "../context/AppContext";
import { accountsApi, transactionsApi } from "../api";
import { AccountResponse, TransactionResponse } from "../types";
import { Card, Badge, Spinner } from "../components/UI";

export default function DashboardPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [accounts,     setAccounts]     = useState<AccountResponse[]>([]);
  const [lastTxn,      setLastTxn]      = useState<TransactionResponse | null>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const accs = await accountsApi.getAll();
        setAccounts(accs);

        // Grab a recent transaction from the first account (demo)
        if (accs.length > 0) {
          // We don't have a "get all transactions" endpoint; fetch by ID 1 as sample
          try {
            const txn = await transactionsApi.getById(1);
            setLastTxn(txn);
          } catch {
            /* no transaction yet */
          }
        }
      } catch {
        /* handled gracefully */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const activeCount  = accounts.filter(a => a.isActive).length;

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><Spinner size={36} /></div>;

  return (
    <div>
      {/* Greeting */}
      <h2 style={s.greeting}>
        Good morning, <span style={{ color: "#38bdf8" }}>{user?.fullName?.split(" ")[0]}</span> 👋
      </h2>

      {/* Summary row */}
      <div style={s.summaryRow}>
        <Card style={s.summaryCard}>
          <p style={s.statLabel}>Total Balance</p>
          <p style={{ ...s.statValue, color: "#38bdf8" }}>${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </Card>

        <Card style={s.summaryCard}>
          <p style={s.statLabel}>Active Accounts</p>
          <p style={{ ...s.statValue, color: "#4ade80" }}>{activeCount}</p>
        </Card>

        <Card style={s.summaryCard}>
          <p style={s.statLabel}>Total Accounts</p>
          <p style={{ ...s.statValue, color: "#facc15" }}>{accounts.length}</p>
        </Card>
      </div>

      {/* Quick-action cards */}
      <div style={s.actionRow}>
        <ActionCard title="Open Account" desc="Create a new checking or savings account" color="#38bdf8" onClick={() => navigate("accounts")} />
        <ActionCard title="Send Money"   desc="Transfer funds between your accounts"     color="#a78bfa" onClick={() => navigate("transactions")} />
        <ActionCard title="View History" desc="Check your recent transaction history"    color="#4ade80" onClick={() => navigate("transactions")} />
      </div>

      {/* Recent activity */}
      <Card title="Recent Activity" style={{ marginTop: 24 }}>
        {accounts.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 14 }}>No accounts yet. <span style={{ color: "#38bdf8", cursor: "pointer" }} onClick={() => navigate("accounts")}>Create one →</span></p>
        ) : (
          <div style={s.accountList}>
            {accounts.slice(0, 4).map(acc => (
              <div key={acc.accountId} style={s.accountRow} onClick={() => navigate("account-detail", { id: String(acc.accountId) })}>
                <div style={s.accountIcon}>{acc.accountType[0]}</div>
                <div style={{ flex: 1 }}>
                  <p style={s.accountName}>{acc.accountType} · #{String(acc.accountNumber).slice(-4)}</p>
                  <p style={s.accountSub}>{acc.currency}</p>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <p style={s.accountBal}>${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  <Badge variant={acc.isActive ? "success" : "danger"}>{acc.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {lastTxn && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1e3048" }}>
            <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.6px" }}>Latest Transaction</p>
            <div style={s.accountRow}>
              <div style={{ ...s.accountIcon, background: lastTxn.transactionType === "Deposit" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", color: lastTxn.transactionType === "Deposit" ? "#4ade80" : "#f87171" }}>
                {lastTxn.transactionType === "Deposit" ? "↓" : "↑"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={s.accountName}>{lastTxn.transactionType} · {lastTxn.description || "—"}</p>
                <p style={s.accountSub}>{new Date(lastTxn.createdAt).toLocaleDateString()}</p>
              </div>
              <p style={{ ...s.accountBal, color: lastTxn.transactionType === "Deposit" ? "#4ade80" : "#f87171" }}>
                {lastTxn.transactionType === "Deposit" ? "+" : "−"}${lastTxn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function ActionCard({ title, desc, color, onClick }: { title: string; desc: string; color: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex:           1,
        background:     "rgba(21,29,43,0.6)",
        border:         `1px solid ${color}33`,
        borderRadius:   14,
        padding:        20,
        cursor:         "pointer",
        transition:     "border-color 0.2s, transform 0.15s",
        minWidth:       180,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${color}33`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      <p style={{ color, fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{title}</p>
      <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  greeting: {
    color:      "#f1f5f9",
    fontSize:   24,
    fontWeight: 700,
    margin:     "0 0 20px",
  },
  summaryRow: {
    display: "flex",
    gap:     16,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: 140,
  },
  statLabel: {
    color:      "#64748b",
    fontSize:   13,
    margin:     "0 0 6px",
    fontWeight: 500,
  },
  statValue: {
    fontSize:   28,
    fontWeight: 700,
    margin:     0,
  },
  actionRow: {
    display: "flex",
    gap:     14,
  },
  accountList: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           2,
  },
  accountRow: {
    display:    "flex",
    alignItems: "center",
    gap:        14,
    padding:    "10px 8px",
    borderRadius: 10,
    cursor:     "pointer",
    transition: "background 0.2s",
  },
  accountIcon: {
    width:          40,
    height:         40,
    borderRadius:   10,
    background:     "rgba(56,189,248,0.12)",
    color:          "#38bdf8",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontWeight:     700,
    fontSize:       18,
  },
  accountName: {
    color:      "#e2e8f0",
    fontSize:   14,
    fontWeight: 600,
    margin:     "0 0 2px",
  },
  accountSub: {
    color:    "#64748b",
    fontSize: 12,
    margin:   0,
  },
  accountBal: {
    color:      "#f1f5f9",
    fontSize:   16,
    fontWeight: 700,
    margin:     "0 0 4px",
  },
};
