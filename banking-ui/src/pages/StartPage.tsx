import React from "react";
import { useRouter } from "../context/AppContext";

export default function StartPage() {
  const { navigate } = useRouter();

  return (
    <div style={styles.page}>
      {/* Subtle animated gradient orb background */}
      <div style={styles.orbA} />
      <div style={styles.orbB} />

      <div style={styles.container}>
        {/* Logo mark */}
        <div style={styles.logoMark}>
          <span style={styles.logoAccent}>My</span>
          <span style={styles.logoMain}>Bank</span>
        </div>

        <p style={styles.tagline}>Your trusted online banking solution</p>

        <div style={styles.actions}>
          <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => navigate("login")}>
            Login
          </button>
          <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => navigate("register")}>
            Register
          </button>
        </div>

        <p style={styles.footer}>
          Secure · Fast · Reliable &nbsp;|&nbsp; © 2025 MyBank
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight:      "100vh",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     "#0f1420",
    position:       "relative",
    overflow:       "hidden",
    fontFamily:     "'Sora', 'Segoe UI', system-ui, sans-serif",
  },
  orbA: {
    position:   "absolute",
    width:      500,
    height:     500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
    top:        "-120px",
    left:       "-100px",
    filter:     "blur(40px)",
  },
  orbB: {
    position:   "absolute",
    width:      420,
    height:     420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
    bottom:     "-80px",
    right:      "-80px",
    filter:     "blur(50px)",
  },
  container: {
    position:       "relative",
    zIndex:         1,
    textAlign:      "center" as const,
    padding:        40,
    background:     "rgba(21,29,43,0.7)",
    backdropFilter: "blur(18px)",
    border:         "1px solid rgba(56,189,248,0.12)",
    borderRadius:   24,
    boxShadow:      "0 8px 40px rgba(0,0,0,0.4)",
    maxWidth:       420,
    width:          "100%",
  },
  logoMark: {
    fontSize:   48,
    fontWeight: 800,
    color:      "#f1f5f9",
    letterSpacing: "-1.5px",
    marginBottom: 8,
  },
  logoAccent: {
    color: "#38bdf8",
  },
  logoMain: {
    color: "#f1f5f9",
  },
  tagline: {
    color:      "#64748b",
    fontSize:   15,
    margin:     "0 0 36px",
    fontWeight: 400,
  },
  actions: {
    display:        "flex",
    flexDirection:  "column" as const,
    gap:            12,
    alignItems:     "center",
  },
  btn: {
    width:        "100%",
    maxWidth:     260,
    fontSize:     15,
    fontWeight:   700,
    padding:      "13px 0",
    borderRadius: 10,
    border:       "none",
    cursor:       "pointer",
    transition:   "transform 0.15s, box-shadow 0.15s",
    letterSpacing: "0.3px",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
    color:      "#fff",
    boxShadow:  "0 4px 18px rgba(56,189,248,0.35)",
  },
  btnSecondary: {
    background: "transparent",
    color:      "#38bdf8",
    border:     "1.5px solid rgba(56,189,248,0.4)",
  },
  footer: {
    marginTop: 32,
    fontSize:  12,
    color:     "#475569",
  },
};
