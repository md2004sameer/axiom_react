import { TOAST_COLORS } from "../../constants/config";

export function Toasts({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="ax-slideIn"
          style={{
            background: TOAST_COLORS[t.type]?.bg || "#111",
            border: `1px solid ${TOAST_COLORS[t.type]?.bar}33`,
            borderLeft: `3px solid ${TOAST_COLORS[t.type]?.bar}`,
            borderRadius: 10,
            padding: "11px 18px",
            fontSize: 14,
            color: "#EEEEF8",
            maxWidth: 300,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            pointerEvents: "auto",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
