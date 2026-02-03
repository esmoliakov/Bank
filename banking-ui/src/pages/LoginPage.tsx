import React, { useState } from "react";
import { useAuth, useRouter } from "../context/AppContext";
import { usersApi } from "../api";
import { Input, Button, Toast } from "../components/UI";
import { Spinner } from "../components/UI";

export default function LoginPage() {
  const { setUser } = useAuth();
  const { navigate } = useRouter();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Fetch all users and match by userName (simulated login)
      const users = await usersApi.getAll();
      const found = users.find(u => u.userName === userName);

      if (!found) {
        setError("Invalid username or password.");
        return;
      }

      // In production you'd POST to an /auth/login endpoint and verify the password hash.
      // Here we just accept any non-empty password for demo purposes.
      if (!password) {
        setError("Password is required.");
        return;
      }

      setUser(found);
      navigate("dashboard");
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyles.wrap}>
      <div style={pageStyles.card}>
        <h1 style={pageStyles.title}>Welcome back</h1>
        <p style={pageStyles.sub}>Sign in to your MyBank account</p>

        <form onSubmit={handleSubmit} style={pageStyles.form}>
          <Input label="Username" value={userName} onChange={e => setUserName(e.target.value)} placeholder="your_username" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

          <Button type="submit" variant="primary" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
            {loading ? <Spinner size={18} /> : "Sign In"}
          </Button>
        </form>

        <p style={pageStyles.link}>
          Don't have an account?{" "}
          <span style={{ color: "#38bdf8", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("register")}>
            Register
          </span>
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
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
  },
  card: {
    background:     "rgba(21,29,43,0.85)",
    backdropFilter: "blur(18px)",
    border:         "1px solid #1e3048",
    borderRadius:   20,
    padding:        40,
    width:          "100%",
    maxWidth:       400,
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
  link: {
    marginTop: 24,
    fontSize:  13,
    color:     "#64748b",
    textAlign: "center" as const,
  },
};
