import { useState } from "react";
import { avatarColor } from "../../utils/helpers";

export function Avatar({ username, url, size = 40 }) {
  const [err, setErr] = useState(false);
  const bg = avatarColor(username);
  const letter = (username || "?")[0].toUpperCase();

  if (url && !err) {
    return (
      <img
        src={url}
        alt={username}
        onError={() => setErr(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.floor(size * 0.42),
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {letter}
    </div>
  );
}
