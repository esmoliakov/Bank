import React from "react";
import { useAuth, useRouter } from "../context/AppContext";

// ─── Nav items rendered only while logged in ─────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard",    route: "dashboard"    as const },
  { label: "Accounts",     route: "accounts"     as const },
  { label: "Transactions", route: "transactions" as const },
  { label: "Profile",      route: "profile"      as const },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoggedIn } = useAuth();
  const { route, navigate }           = useRouter();

  const handleLogout = () => {
    setUser(null);
    navigate("start");
  };

  return (
    <div style={styles.shell}>
      {/* ── Top bar ── */}
      <header style={styles.header}>
        <span
          style={styles.brand}
          onClick={() => navigate(isLoggedIn ? "dashboard" : "start")}
        >
          <span style={styles.brandAccent}>My</span>Bank
        </span>

        {isLoggedIn && (
          <nav style={styles.nav}>
            {NAV_ITEMS.map(({ label, route: r }) => (
              <button
                key={r}
                onClick={() => navigate(r)}
                style={{
                  ...styles.navBtn,
                  ...(route === r ? styles.navBtnActive : {}),
                }}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        {isLoggedIn && (
          <div style={styles.userBar}>
            <span style={styles.userGreet}>Hi, <strong>{user?.fullName?.split(" ")[0]}</strong></span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f1420",
    color: "#e2e8f0",
    fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "14px 32px",
    background: "linear-gradient(135deg, #141e2e 0%, #1a2636 100%)",
    borderBottom: "1px solid #1e3048",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f5f9",
    cursor: "pointer",
    letterSpacing: "-0.5px",
    userSelect: "none",
  },
  brandAccent: {
    color: "#38bdf8",
  },
  nav: {
    display: "flex",
    gap: 4,
    marginLeft: "auto",
  },
  navBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
    padding: "7px 14px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  },
  navBtnActive: {
    background: "rgba(56,189,248,0.12)",
    color: "#38bdf8",
  },
  userBar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginLeft: 24,
  },
  userGreet: {
    fontSize: 13,
    color: "#cbd5e1",
  },
  logoutBtn: {
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#f87171",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "28px 32px",
    maxWidth: 1100,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
};
