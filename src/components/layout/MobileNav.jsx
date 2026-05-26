import { Home, Rss, User, LogOut } from "lucide-react";

export function MobileNav({ activePage, nav, currentUser, onLogout }) {
  const links = [
    { page: "home", icon: Home },
    { page: "feed", icon: Rss },
    { page: "profile", icon: User, params: { username: currentUser } },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "#060609",
        borderTop: "1px solid #17172A",
        display: "flex",
        zIndex: 100,
        alignItems: "stretch",
      }}
    >
      {links.map(({ page, icon: Icon, params }) => (
        <button
          key={page}
          onClick={() => nav(page, params || {})}
          className="ax-nav-btn"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: activePage === page ? "#3B82F6" : "#555570",
            borderRadius: 0,
          }}
        >
          <Icon size={22} />
        </button>
      ))}
      <button
        onClick={onLogout}
        className="ax-nav-btn"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#EF4444",
          borderRadius: 0,
        }}
      >
        <LogOut size={22} />
      </button>
    </div>
  );
}
