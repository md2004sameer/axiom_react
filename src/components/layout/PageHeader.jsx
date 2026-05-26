import { ArrowLeft } from "lucide-react";

export function PageHeader({ title, onBack }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(6,6,9,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #17172A",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#EEEEF8",
            cursor: "pointer",
            padding: "4px 6px",
            borderRadius: 8,
            display: "flex",
          }}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <span
        className="ax-heading"
        style={{
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </span>
    </div>
  );
}
