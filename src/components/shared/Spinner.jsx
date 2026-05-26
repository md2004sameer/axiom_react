import { Loader2 } from "lucide-react";

export function Spinner({ size = 18, color = "#3B82F6" }) {
  return (
    <Loader2
      size={size}
      className="ax-spin"
      style={{ color, flexShrink: 0 }}
    />
  );
}
