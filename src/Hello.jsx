import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";
import { Toasts } from "./components/shared/Toasts";
import { AuthPage } from "./components/auth/AuthPage";
import { PostListPage } from "./components/posts/PostListPage";
import { PostDetailPage } from "./components/posts/PostDetailPage";
import { ProfilePage } from "./components/profile/ProfilePage";
import { useToast } from "./hooks/useToast";
import { injectStyles } from "./utils/styles";
import { api } from "./utils/api";
import { SIDEBAR_W } from "./constants/config";

export default function Hello() {
  useEffect(() => {
    injectStyles();
  }, []);

  // Token lives in the httpOnly cookie — we only track the username in state.
  const [currentUser, setCurrentUser] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage] = useState({ name: "login", params: {} });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const { toasts, add: toast } = useToast();

  // On mount: ask the backend if we already have a valid session cookie.
  useEffect(() => {
    api.get("/api/auth/me")
      .then(({ username }) => {
        setCurrentUser(username);
        setPage({ name: "home", params: {} });
      })
      .catch(() => {
        // 401 = not logged in, stay on login page
      })
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const nav = useCallback((name, params = {}) => {
    setPage({ name, params });
  }, []);

  function handleLogin(username) {
    setCurrentUser(username);
    setPage({ name: "home", params: {} });
  }

  async function handleLogout() {
    try {
      await api.post("/api/auth/logout", {});
    } catch {}
    setCurrentUser("");
    setPage({ name: "login", params: {} });
  }

  // Don't render anything until the session check resolves — avoids a
  // login-page flash for users who are already authenticated.
  if (!authChecked) return null;

  const isAuthed = !["login", "signup"].includes(page.name);

  let content;
  switch (page.name) {
    case "login":
    case "signup":
      content = (
        <AuthPage mode={page.name} onLogin={handleLogin} nav={nav} toast={toast} />
      );
      break;
    case "home":
      content = (
        <PostListPage
          endpoint="/api/posts"
          title="Home"
          currentUser={currentUser}
          nav={nav}
          toast={toast}
        />
      );
      break;
    case "feed":
      content = (
        <PostListPage
          endpoint="/api/posts/feed"
          title="Feed"
          currentUser={currentUser}
          nav={nav}
          toast={toast}
        />
      );
      break;
    case "post":
      content = (
        <PostDetailPage
          postId={page.params.postId}
          currentUser={currentUser}
          nav={nav}
          toast={toast}
        />
      );
      break;
    case "profile":
      content = (
        <ProfilePage
          username={page.params.username}
          currentUser={currentUser}
          nav={nav}
          toast={toast}
        />
      );
      break;
    default:
      content = null;
  }

  return (
    <div className="ax-root">
      {isAuthed && !isMobile && (
        <Sidebar
          activePage={page.name}
          nav={nav}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main
        style={{
          marginLeft: isAuthed && !isMobile ? SIDEBAR_W : 0,
          maxWidth: isAuthed ? (isMobile ? "100%" : 600) : "100%",
          minHeight: "100vh",
          borderRight: isAuthed && !isMobile ? "1px solid #17172A" : "none",
          paddingBottom: isAuthed && isMobile ? 64 : 0,
        }}
      >
        {content}
      </main>

      {isAuthed && isMobile && (
        <MobileNav
          activePage={page.name}
          nav={nav}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <Toasts toasts={toasts} />
    </div>
  );
}