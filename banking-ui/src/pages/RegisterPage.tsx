import React, { useState } from "react";
import { useRouter } from "../context/AppContext";
import { usersApi } from "../api";
import { Input, Button, Toast, Spinner } from "../components/UI";

export default function RegisterPage() {
  const { navigate } = useRouter();

  const [form, setForm] = useState({
    fullName:    "",
    dateOfBirth: "",
    userName:    "",
    email:       "",
    phoneNumber: "",
    address:     "",
    password:    "",
    confirmPass: "",
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const change = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await usersApi.create({
        fullName:    form.fullName,
        dateOfBirth: form.dateOfBirth,
        userName:    form.userName,
        email:       form.email,
        phoneNumber: form.phoneNumber,
        address:     form.address,
        password:    form.password,
      });

      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("login"), 1800);
    } catch (err: unknown) {
      setError((err as Error).message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyles.wrap}>
      <div style={pageStyles.card}>
        <h1 style={pageStyles.title}>Create Account</h1>
        <p style={pageStyles.sub}>Fill in the details below to get started</p>

        <form onSubmit={handleSubmit} style={pageStyles.form}>
          <div style={pageStyles.row}>
            <Input label="Full Name" value={form.fullName} onChange={change("fullName")} placeholder="Jane Doe" required style={{ flex: 1 }} />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={change("dateOfBirth")} required style={{ flex: 1 }} />
          </div>
          <div style={pageStyles.row}>
            <Input label="Username" value={form.userName} onChange={change("userName")} placeholder="jane_doe" required style={{ flex: 1 }} />
            <Input label="Email" type="email" value={form.email} onChange={change("email")} placeholder="jane@example.com" required style={{ flex: 1 }} />
          </div>
          <div style={pageStyles.row}>
            <Input label="Phone Number" value={form.phoneNumber} onChange={change("phoneNumber")} placeholder="+370 ..." style={{ flex: 1 }} />
            <Input label="Address" value={form.address} onChange={change("address")} placeholder="123 Main St" style={{ flex: 1 }} />
          </div>
          <div style={pageStyles.row}>
            <Input label="Password" type="password" value={form.password} onChange={change("password")} placeholder="••••••••" required style={{ flex: 1 }} />
            <Input label="Confirm Password" type="password" value={form.confirmPass} onChange={change("confirmPass")} placeholder="••••••••" required style={{ flex: 1 }} />
          </div>

          <Button type="submit" variant="primary" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? <Spinner size={18} /> : "Register"}
          </Button>
        </form>

        <p style={pageStyles.link}>
          Already have an account?{" "}
          <span style={{ color: "#38bdf8", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("login")}>
            Sign In
          </span>
        </p>
      </div>

      {error   && <Toast message={error}   type="error"   onClose={() => setError("")}   />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}
    </div>
  );
}

const pageStyles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight:      "100vh",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     "#0f1420",
    fontFamily:     "'Sora', 'Segoe UI', system-ui, sans-serif",
    padding:        24,
  },
  card: {
    background:     "rgba(21,29,43,0.85)",
    backdropFilter: "blur(18px)",
    border:         "1px solid #1e3048",
    borderRadius:   20,
    padding:        40,
    width:          "100%",
    maxWidth:       680,
    boxShadow:      "0 8px 40px rgba(0,0,0,0.4)",
  },
  title: {
    color:      "#f1f5f9",
    fontSize:   26,
    fontWeight: 700,
    margin:     "0 0 6px",
  },
  sub: {
    color:      "#64748b",
    fontSize:   14,
    margin:     "0 0 28px",
  },
  form: {
    display:       "flex",
    flexDirection: "column" as const,
    gap:           16,
  },
  row: {
    display: "flex",
    gap:     14,
  },
  link: {
    marginTop: 24,
    fontSize:  13,
    color:     "#64748b",
    textAlign: "center" as const,
  },
};
