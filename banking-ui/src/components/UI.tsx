import React, { useEffect } from "react";

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  style,
  title,
}: {
  children: React.ReactNode;
  style?:   React.CSSProperties;
  title?:   string;
}) {
  return (
    <div style={{ ...cardBase, ...style }}>
      {title && <h3 style={cardTitle}>{title}</h3>}
      {children}
    </div>
  );
}

const cardBase: React.CSSProperties = {
  background:    "#151d2b",
  border:        "1px solid #1e3048",
  borderRadius:  14,
  padding:       24,
  boxShadow:     "0 2px 12px rgba(0,0,0,0.25)",
};

const cardTitle: React.CSSProperties = {
  fontSize:      15,
  fontWeight:    600,
  color:         "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  margin:        "0 0 16px",
  paddingBottom: 12,
  borderBottom:  "1px solid #1e3048",
};

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
  warning: { bg: "rgba(250,204,21,0.12)",  text: "#facc15" },
  danger:  { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
  info:    { bg: "rgba(56,189,248,0.12)",  text: "#38bdf8" },
  neutral: { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
};

export function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  const c = BADGE_COLORS[variant];
  return (
    <span style={{
      display: "inline-block",
      background: c.bg,
      color: c.text,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      letterSpacing: "0.4px",
    }}>
      {children}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: size, height: size,
        border: `3px solid #1e3048`,
        borderTop: `3px solid #38bdf8`,
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
        margin: "0 auto",
      }} />
    </>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({
  message,
  type = "error",
  onClose,
}: {
  message: string;
  type?:   "error" | "success";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)";
  const border = type === "success" ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)";
  const color  = type === "success" ? "#4ade80" : "#f87171";

  return (
    <div style={{
      position:   "fixed",
      bottom:     28,
      left:       "50%",
      transform:  "translateX(-50%)",
      background: bg,
      border:     `1px solid ${border}`,
      color,
      padding:    "12px 24px",
      borderRadius: 10,
      fontSize:   14,
      fontWeight: 500,
      zIndex:     999,
      boxShadow:  "0 4px 20px rgba(0,0,0,0.4)",
      animation: "slideUp 0.25s ease",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); }}`}</style>
      {message}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  style,
}: {
  label?:       string;
  value:        string | number;
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?:        string;
  placeholder?: string;
  required?:    boolean;
  style?:       React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      {label && <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          background:   "#0f1420",
          border:       "1px solid #1e3048",
          borderRadius: 8,
          padding:      "10px 14px",
          color:        "#f1f5f9",
          fontSize:     14,
          outline:      "none",
          transition:   "border-color 0.2s",
        }}
        onFocus={e => (e.target.style.borderColor = "#38bdf8")}
        onBlur  ={e => (e.target.style.borderColor = "#1e3048")}
      />
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label?:    string;
  value:     string;
  onChange:  (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options:   { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px" }}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        required={required}
        style={{
          background:   "#0f1420",
          border:       "1px solid #1e3048",
          borderRadius: 8,
          padding:      "10px 14px",
          color:        "#f1f5f9",
          fontSize:     14,
          outline:      "none",
          appearance:   "none",
          cursor:       "pointer",
        }}
        onFocus={e => (e.target.style.borderColor = "#38bdf8")}
        onBlur  ={e => (e.target.style.borderColor = "#1e3048")}
      >
        {options.map(o => <option key={o.value} value={o.value} style={{ background: "#151d2b" }}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  style,
  type = "button",
}: {
  children:  React.ReactNode;
  onClick?:  () => void;
  variant?:  "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?:    React.CSSProperties;
  type?:     "button" | "submit";
}) {
  const palettes = {
    primary:   { bg: "#38bdf8", hover: "#7dd3fc", text: "#0f1420" },
    secondary: { bg: "transparent", hover: "rgba(56,189,248,0.1)", text: "#38bdf8" },
    danger:    { bg: "rgba(248,113,113,0.15)", hover: "rgba(248,113,113,0.28)", text: "#f87171" },
  };
  const p = palettes[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        background:   p.bg,
        border:       variant === "secondary" ? "1px solid rgba(56,189,248,0.3)" : "none",
        color:        p.text,
        fontSize:     14,
        fontWeight:   600,
        padding:      "10px 22px",
        borderRadius: 8,
        cursor:       disabled ? "not-allowed" : "pointer",
        opacity:      disabled ? 0.5 : 1,
        transition:   "background 0.2s",
        ...style,
      }}
      onMouseEnter={e => !disabled && ((e.target as HTMLButtonElement).style.background = p.hover)}
      onMouseLeave={e => ((e.target as HTMLButtonElement).style.background = p.bg)}
    >
      {children}
    </button>
  );
}
