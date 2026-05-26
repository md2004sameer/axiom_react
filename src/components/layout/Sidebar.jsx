import { Home, Rss, User, LogOut, Zap } from "lucide-react";
import { Avatar } from "../shared/Avatar";

export function Sidebar({ activePage, nav, currentUser, onLogout }) {
  const links = [
    { page: "home", label: "Home", icon: Home },
    { page: "feed", label: "Feed", icon: Rss },
    { page: "profile", label: "Profile", icon: User, params: { username: currentUser } },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 248,
        height: "100vh",
        borderRight: "1px solid #17172A",
        background: "#060609",
        display: "flex",
        flexDirection: "column",
        padding: "18px 10px",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "6px 14px 26px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "#3B74F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={19} color="#fff" fill="#fff" />
        </div>
        <span
          className="ax-heading"
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Axiom
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        {links.map(({ page, label, icon: Icon, params }) => (
          <button
            key={page}
            onClick={() => nav(page, params || {})}
            className={`ax-nav-btn${activePage === page ? " ax-active" : ""}`}
            style={{
              width: "100%",
              borderRadius: 12,
              padding: "11px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: activePage === page ? "#5B9FFF" : "#8888A8",
              fontSize: 16,
              fontWeight: activePage === page ? 600 : 400,
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid #17172A", paddingTop: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 14px 10px",
          }}
        >
          <Avatar username={currentUser} size={34} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentUser}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="ax-nav-btn"
          style={{
            width: "100%",
            borderRadius: 12,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#EF4444",
            fontSize: 15,
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
