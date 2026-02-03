import React, { useState } from "react";
import { useAuth } from "../context/AppContext";
import { usersApi } from "../api";
import { Card, Input, Button, Toast, Badge } from "../components/UI";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    phoneNumber: user?.phoneNumber ?? "",
    email:       user?.email       ?? "",
    address:     user?.address     ?? "",
    userName:    user?.userName     ?? "",
  });

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [saving,  setSaving]  = useState(false);

  const change = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await usersApi.update(user!.userId, {
        phoneNumber: form.phoneNumber || undefined,
        email:       form.email       || undefined,
        address:     form.address     || undefined,
        userName:    form.userName     || undefined,
      });
      setUser(updated);
      setSuccess("Profile updated!");
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p style={{ color: "#f87171" }}>Not logged in.</p>;

  return (
    <div>
      <h2 style={s.pageTitle}>Profile</h2>

      {/* Read-only identity card */}
      <Card style={s.identityCard}>
        <div style={s.identityRow}>
          <div style={s.avatar}>{user.fullName?.[0] ?? "?"}</div>
          <div>
            <p style={s.identityName}>{user.fullName}</p>
            <p style={s.identitySub}>@{user.userName} · ID #{user.userId}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Badge variant={user.isActive ? "success" : "danger"}>{user.isActive ? "Active" : "Inactive"}</Badge>
            <Badge variant={user.twoFactorEnabled ? "info" : "neutral"}>2FA {user.twoFactorEnabled ? "On" : "Off"}</Badge>
          </div>
        </div>

        <div style={s.metaRow}>
          <MetaItem label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "—"} />
          <MetaItem label="Joined"        value={new Date(user.createdAt).toLocaleDateString()} />
        </div>
      </Card>

      {/* Editable fields */}
      <Card title="Edit Details" style={{ marginTop: 18 }}>
        <div style={s.editGrid}>
          <Input label="Username"     value={form.userName}    onChange={change("userName")}    placeholder="your_username" />
          <Input label="Email"        value={form.email}       onChange={change("email")}       placeholder="you@example.com" />
          <Input label="Phone Number" value={form.phoneNumber} onChange={change("phoneNumber")} placeholder="+370 ..." />
          <Input label="Address"      value={form.address}     onChange={change("address")}     placeholder="123 Main St" />
        </div>

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </Card>

      {error   && <Toast message={error}   type="error"   onClose={() => setError("")}   />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.6px", fontWeight: 600 }}>{label}</span>
      <p style={{ color: "#cbd5e1", fontSize: 14, margin: "3px 0 0", fontWeight: 500 }}>{value}</p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  pageTitle: {
    color:      "#f1f5f9",
    fontSize:   22,
    fontWeight: 700,
    margin:     "0 0 16px",
  },
  identityCard: {
    background: "linear-gradient(135deg, #151d2b 0%, #1a2636 100%)",
    borderColor: "rgba(56,189,248,0.2)",
  },
  identityRow: {
    display:    "flex",
    alignItems: "center",
    gap:        16,
    marginBottom: 20,
  },
  avatar: {
    width:          56,
    height:         56,
    borderRadius:   16,
    background:     "linear-gradient(135deg, #38bdf8, #6366f1)",
    color:          "#fff",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       24,
    fontWeight:     700,
    flexShrink:     0,
  },
  identityName: {
    color:      "#f1f5f9",
    fontSize:   20,
    fontWeight: 700,
    margin:     "0 0 3px",
  },
  identitySub: {
    color:    "#64748b",
    fontSize: 13,
    margin:   0,
  },
  metaRow: {
    display: "flex",
    gap:     40,
  },
  editGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 16,
  },
};
