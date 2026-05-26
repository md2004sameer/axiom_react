// In dev, Vite proxies /api → localhost:8080, so BASE is empty (same origin).
// In production, set VITE_API_URL to your backend's full URL.
export const BASE = import.meta.env.VITE_API_URL || "";

export const AVATAR_COLORS = [
  "#3B74F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#F97316",
];

export const TOAST_COLORS = {
  info: { bar: "#3B82F6", bg: "#0F1729" },
  success: { bar: "#10B981", bg: "#071F17" },
  error: { bar: "#EF4444", bg: "#1F0707" },
};

export const INPUT_STYLE = {
  width: "100%",
  background: "#0E0E1A",
  border: "1px solid #232338",
  borderRadius: 12,
  padding: "12px 15px",
  color: "#EEEEF8",
  fontSize: 15,
  fontFamily: "DM Sans, sans-serif",
};

export const SIDEBAR_W = 248;