import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";
import { Spinner } from "../shared/Spinner";
import { api } from "../../utils/api";

export function PostListPage({
  endpoint,
  title,
  token,
  currentUser,
  nav,
  toast,
}) {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get(`${endpoint}?page=0&size=20`, token);
        if (!cancelled) setPosts(data);
      } catch (e) {
        if (!cancelled) {
          if (e.status === 401) nav("login");
          else toast(e.message, "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [endpoint, token]);

  useEffect(() => {
    let cancelled = false;

    async function checkNewPosts() {
      try {
        const latest = await api.get(
          `${endpoint}?page=0&size=20`,
          token
        );
        if (cancelled || posts.length === 0) return;

        const currentTopId = posts[0]?.id;
        const fresh = latest.filter((p) => p.id > currentTopId);
        if (fresh.length > 0) {
          setNewPosts(fresh);
        }
      } catch (e) {
        // ignore background polling errors
      }
    }

    const interval = setInterval(checkNewPosts, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [posts, endpoint, token]);

  async function handleDelete(pid) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.del(`/api/posts/${pid}`, token);
      setPosts((p) => p.filter((x) => x.id !== pid));
      toast("Post deleted", "success");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  return (
    <div>
      <PageHeader title={title} />
      <CreatePost
        token={token}
        currentUser={currentUser}
        onCreated={(p) => setPosts((prev) => [p, ...prev])}
        toast={toast}
      />
      {newPosts.length > 0 && (
        <div
          onClick={() => {
            setPosts((prev) => [...newPosts, ...prev]);
            setNewPosts([]);
          }}
          style={{
            padding: "10px",
            textAlign: "center",
            background: "#13233F",
            color: "#5B9FFF",
            cursor: "pointer",
            borderBottom: "1px solid #17172A",
            fontWeight: 600,
          }}
        >
          {newPosts.length} new post{newPosts.length > 1 ? "s" : ""}
        </div>
      )}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 52 }}>
          <Spinner size={28} />
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#484865",
          }}
        >
          <MessageCircle size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 16, margin: 0 }}>Nothing here yet</p>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            token={token}
            currentUser={currentUser}
            nav={nav}
            onDelete={handleDelete}
            toast={toast}
          />
        ))
      )}
    </div>
  );
}
