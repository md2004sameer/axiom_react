import { useEffect, useState } from "react";
import { Heart, Trash2, Send } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";
import { Avatar } from "../shared/Avatar";
import { Spinner } from "../shared/Spinner";
import { INPUT_STYLE } from "../../constants/config";
import { timeAgo } from "../../utils/helpers";
import { api } from "../../utils/api";

export function PostDetailPage({
  postId,
  currentUser,
  nav,
  toast,
}) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cText, setCText] = useState("");
  const [cBusy, setCBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const d = await api.get(`/api/posts/${postId}`);
        if (!cancelled) setPost(d);
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
  }, [postId]);

  async function toggleLike() {
    const liked = post.likedBy?.includes(currentUser);
    try {
      const updated = liked
        ? await api.del(`/api/posts/${postId}/like`)
        : await api.post(`/api/posts/${postId}/like`, {});
      setPost(updated);
    } catch (e) {
      if (e.status === 409) toast("Already liked", "info");
      else toast(e.message, "error");
    }
  }

  async function addComment() {
    if (!cText.trim() || cBusy) return;
    setCBusy(true);
    try {
      const updated = await api.post(
        `/api/posts/${postId}/comment`,
        { text: cText.trim() }
      );
      setPost(updated);
      setCText("");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setCBusy(false);
    }
  }

  async function deleteComment(cid) {
    try {
      const updated = await api.del(
        `/api/posts/${postId}/comment/${cid}`
      );
      setPost(updated);
    } catch (e) {
      toast(e.message, "error");
    }
  }

  if (loading)
    return (
      <div>
        <PageHeader title="Post" onBack={() => nav("home")} />
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={30} />
        </div>
      </div>
    );
  if (!post) return null;

  const isLiked = post.likedBy?.includes(currentUser);

  return (
    <div className="ax-fadeUp">
      <PageHeader title="Post" onBack={() => nav("home")} />

      {/* Full post */}
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #17172A" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => nav("profile", { username: post.author })}
          >
            <Avatar username={post.author} size={46} />
          </div>
          <div>
            <div
              className="ax-heading"
              style={{
                fontWeight: 800,
                fontSize: 17,
                cursor: "pointer",
                letterSpacing: "-0.02em",
              }}
              onClick={() =>
                nav("profile", { username: post.author })
              }
            >
              {post.author}
            </div>
            <div style={{ color: "#484865", fontSize: 13 }}>
              {timeAgo(post.createdAt)}
            </div>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 18px",
            fontSize: 19,
            lineHeight: 1.7,
            wordBreak: "break-word",
          }}
        >
          {post.text}
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 24,
            padding: "12px 0",
            borderTop: "1px solid #17172A",
            borderBottom: "1px solid #17172A",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 14, color: "#888898" }}>
            <strong style={{ color: "#EEEEF8" }}>{post.likeCount}</strong>{" "}
            Likes
          </span>
          <span style={{ fontSize: 14, color: "#888898" }}>
            <strong style={{ color: "#EEEEF8" }}>
              {post.commentCount}
            </strong>{" "}
            Comments
          </span>
          <span style={{ fontSize: 14, color: "#888898" }}>
            <strong style={{ color: "#EEEEF8" }}>
              {post.repostCount}
            </strong>{" "}
            Reposts
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 28, paddingTop: 12 }}>
          <button
            onClick={toggleLike}
            className="ax-like-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: isLiked ? "#FB7185" : "#555570",
              fontSize: 14,
              padding: 0,
              transition: "color 0.15s",
            }}
          >
            <Heart
              size={19}
              fill={isLiked ? "currentColor" : "none"}
              strokeWidth={isLiked ? 0 : 2}
            />
            {isLiked ? "Liked" : "Like"}
          </button>
        </div>
      </div>

      {/* Add comment */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #17172A" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <Avatar username={currentUser} size={36} />
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <textarea
              value={cText}
              onChange={(e) => setCText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              style={{
                ...INPUT_STYLE,
                borderRadius: 12,
                padding: "10px 13px",
                fontSize: 15,
                lineHeight: 1.5,
              }}
              className="ax-input"
            />
            <button
              onClick={addComment}
              disabled={!cText.trim() || cBusy}
              style={{
                background: cText.trim() ? "#3B74F6" : "#17172A",
                border: "none",
                borderRadius: 11,
                padding: "11px 13px",
                cursor: cText.trim() ? "pointer" : "default",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                transition: "background 0.15s",
              }}
            >
              {cBusy ? <Spinner size={16} color="#fff" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      {post.comments?.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#484865" }}>
          <p style={{ fontSize: 15, margin: 0 }}>
            No replies yet — be the first!
          </p>
        </div>
      )}
      {post.comments?.map((c) => (
        <div
          key={c.id}
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #12121F",
            display: "flex",
            gap: 12,
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              nav("profile", { username: c.author })
            }
          >
            <Avatar username={c.author} size={38} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  className="ax-heading"
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                  onClick={() =>
                    nav("profile", { username: c.author })
                  }
                >
                  {c.author}
                </span>
                <span style={{ color: "#484865", fontSize: 12 }}>
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              {c.author === currentUser && (
                <button
                  onClick={() => deleteComment(c.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#333354",
                    cursor: "pointer",
                    padding: "3px 4px",
                    borderRadius: 6,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#EF4444")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#333354")
                  }
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.6,
                wordBreak: "break-word",
                color: "#CCCCE0",
              }}
            >
              {c.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}