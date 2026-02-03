import React, { useEffect, useState } from "react";
import { useRouter } from "../context/AppContext";
import { accountsApi } from "../api";
import { AccountResponse } from "../types";
import { Card, Badge, Spinner, Toast, Button } from "../components/UI";

export default function AccountDetailPage() {
  const { route, params, navigate } = useRouter();
  const accountId = Number(params.id);

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await accountsApi.getById(accountId);
        setAccount(data);
      } catch (e: unknown) {
        setError((e as Error).message || "Account not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId]);

  const toggleActive = async () => {
    if (!account) return;
    try {
      const updated = await accountsApi.update(accountId, { isActive: !account.isActive });
      setAccount(updated);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Soft-delete this account?")) return;
    try {
      await accountsApi.delete(accountId);
      navigate("accounts");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  if (loading) return <div style={{ textAlign: "center", paddingTop: 80 }}><Spinner size={36} /></div>;
  if (!account) return <p style={{ color: "#f87171" }}>Account not found.</p>;

  return (
    <div>
      {/* Back link */}
      <button style={s.backBtn} onClick={() => navigate("accounts")}>← Back to Accounts</button>

      {/* Hero card */}
      <Card style={s.heroCard}>
        <div style={s.heroTop}>
          <div>
            <p style={s.heroLabel}>Account Type</p>
            <h2 style={s.heroTitle}>{account.accountType}</h2>
            <p style={s.heroNumber}>Account # {account.accountNumber}</p>
          </div>
          <Badge variant={account.isActive ? "success" : "danger"} >{account.isActive ? "Active" : "Inactive"}</Badge>
        </div>

        <p style={s.balanceLabel}>Balance</p>
        <p style={s.balanceValue}>${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      </Card>

      {/* Details grid */}
      <Card title="Details" style={{ marginTop: 16 }}>
        <div style={s.detailGrid}>
          <DetailRow label="Currency"   value={account.currency} />
          <DetailRow label="Created At" value={new Date(account.createdAt).toLocaleString()} />
          <DetailRow label="Account ID" value={String(account.accountId)} />
          <DetailRow label="Status"     value={account.isActive ? "Active" : "Inactive"} />
        </div>
      </Card>

      {/* Actions */}
      <div style={s.actionBar}>
        <Button variant="primary" onClick={() => navigate("transactions")}>💰 Deposit / Withdraw</Button>
        <Button variant="secondary" onClick={toggleActive}>{account.isActive ? "⏸ Deactivate" : "▶ Activate"}</Button>
        <Button variant="danger" onClick={handleDelete}>🗑 Delete Account</Button>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
      <span style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.7px", fontWeight: 600 }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  backBtn: {
    background: "transparent",
    border:     "none",
    color:      "#38bdf8",
    fontSize:   14,
    cursor:     "pointer",
    padding:    0,
    marginBottom: 16,
    fontWeight: 600,
  },
  heroCard: {
    background: "linear-gradient(135deg, #151d2b 0%, #1a2636 100%)",
    borderColor: "rgba(56,189,248,0.2)",
  },
  heroTop: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   24,
  },
  heroLabel: {
    color:      "#64748b",
    fontSize:   12,
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    margin:     "0 0 4px",
  },
  heroTitle: {
    color:      "#f1f5f9",
    fontSize:   26,
    fontWeight: 700,
    margin:     "0 0 4px",
  },
  heroNumber: {
    color:      "#475569",
    fontSize:   13,
    margin:     0,
  },
  balanceLabel: {
    color:      "#64748b",
    fontSize:   13,
    margin:     "0 0 4px",
  },
  balanceValue: {
    color:      "#38bdf8",
    fontSize:   38,
    fontWeight: 800,
    margin:     0,
    letterSpacing: "-1px",
  },
  detailGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 18,
  },
  actionBar: {
    display: "flex",
    gap:     10,
    marginTop: 20,
    flexWrap: "wrap" as const,
  },
};
