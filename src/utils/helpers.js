import { AVATAR_COLORS } from "../constants/config";

export function timeAgo(str) {
  if (!str) return "";
  const s = (Date.now() - new Date(str).getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(str).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

export function avatarColor(name) {
  return AVATAR_COLORS[(name || "?").charCodeAt(0) % AVATAR_COLORS.length];
}
