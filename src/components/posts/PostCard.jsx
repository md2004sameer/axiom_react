import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Trash2,
  Send,
} from "lucide-react";
import { Avatar } from "../shared/Avatar";
import { Spinner } from "../shared/Spinner";
import { timeAgo } from "../../utils/helpers";
import { api } from "../../utils/api";

export function PostCard({
  post: init,
  token,
  currentUser,
  nav,
  onDelete,
  toast,
}) {
  const [post, setPost] = useState(init);
  const [showComments, setShowComments] = useState(false);
  const [cText, setCText] = useState("");
  const [likeBusy, setLikeBusy] = useState(false);
  const [rpBusy, setRpBusy] = useState(false);
  const [cBusy, setCBusy] = useState(false);

  useEffect(() => {
    setPost(init);
  }, [init]);

  const isLiked =
    Array.isArray(post.likedBy) && post.likedBy.includes(currentUser);

  async function toggleLike() {
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const updated = isLiked
        ? await api.del(`/api/posts/${post.id}/like`, token)
        : await api.post(`/api/posts/${post.id}/like`, {}, token);
      setPost(updated);
    } catch (e) {
      if (e.status === 409) toast("Already liked", "info");
      else toast(e.message, "error");
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleRepost() {
    if (rpBusy) return;
    setRpBusy(true);
    try {
      const updated = await api.post(
        `/api/posts/${post.id}/repost`,
        {},
        token
      );
      setPost(updated);
      toast("Reposted!", "success");
    } catch (e) {
      if (e.status === 409) toast("Already reposted", "info");
      else toast(e.message, "error");
    } finally {
      setRpBusy(false);
    }
  }

  async function addComment() {
    if (!cText.trim() || cBusy) return;
    setCBusy(true);
    try {
      const updated = await api.post(
        `/api/posts/${post.id}/comment`,
        { text: cText.trim() },
        token
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
        `/api/posts/${post.id}/comment/${cid}`,
        token
      );
      setPost(updated);
    } catch (e) {
      toast(e.message, "error");
    }
  }

  return (
    <article
      className="ax-post-row"
      style={{ padding: "14px 16px", borderBottom: "1px solid #17172A" }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {/* Avatar */}
        <div
          style={{ cursor: "pointer", flexShrink: 0 }}
          onClick={() => nav("profile", { username: post.username })}
        >
          <Avatar username={post.username} size={42} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className="ax-heading"
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                }}
                onClick={() => nav("profile", { username: post.username })}
              >
                {post.username}
              </span>
              <span style={{ color: "#484865", fontSize: 13 }}>·</span>
              <span style={{ color: "#484865", fontSize: 13 }}>
                {timeAgo(post.createdAt)}
              </span>
            </div>
            {post.username === currentUser && (
              <button
                onClick={() => onDelete(post.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#333354",
                  cursor: "pointer",
                  padding: "3px 5px",
                  borderRadius: 6,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#333354")}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Post text */}
          <p
            style={{
              margin: "0 0 12px",
              lineHeight: 1.65,
              fontSize: 15,
              cursor: "pointer",
              wordBreak: "break-word",
              color: "#EEEEF8",
            }}
            onClick={() => nav("post", { postId: post.id })}
          >
            {post.text}
          </p>

          {/* Action bar */}
          <div
            style={{
              display: "flex",
              gap: 22,
              alignItems: "center",
            }}
          >
            {/* Like */}
            <button
              onClick={toggleLike}
              disabled={likeBusy}
              className="ax-like-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: isLiked ? "#FB7185" : "#484865",
                fontSize: 13,
                padding: 0,
                transition: "color 0.15s",
              }}
            >
              <Heart
                size={16}
                fill={isLiked ? "currentColor" : "none"}
                strokeWidth={isLiked ? 0 : 2}
              />
              <span>{post.likeCount || 0}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowComments((v) => !v)}
              className="ax-cmt-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: showComments ? "#60A5FA" : "#484865",
                fontSize: 13,
                padding: 0,
                transition: "color 0.15s",
              }}
            >
              <MessageCircle size={16} />
              <span>{post.commentCount || 0}</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              disabled={rpBusy}
              className="ax-rp-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#484865",
                fontSize: 13,
                padding: 0,
                transition: "color 0.15s",
              }}
            >
              <Repeat2 size={16} />
              <span>{post.repostCount || 0}</span>
            </button>
          </div>

          {/* Inline comments */}
          {showComments && (
            <div
              className="ax-fadeUp"
              style={{
                marginTop: 14,
                borderTop: "1px solid #17172A",
                paddingTop: 12,
              }}
            >
              {/* Add comment */}
              <div
                style={{
                  display: "flex",
                  gap: 9,
                  marginBottom: 12,
                  alignItems: "flex-end",
                }}
              >
                <Avatar username={currentUser} size={30} />
                <div style={{ flex: 1, display: "flex", gap: 7, alignItems: "flex-end" }}>
                  <textarea
                    value={cText}
                    onChange={(e) => setCText(e.target.value)}
                    placeholder="Reply..."
                    rows={1}
                    style={{
                      flex: 1,
                      background: "#0E0E1A",
                      border: "1px solid #232338",
                      borderRadius: 10,
                      padding: "8px 11px",
                      color: "#EEEEF8",
                      fontSize: 14,
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    className="ax-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addComment();
                      }
                    }}
                  />
                  <button
                    onClick={addComment}
                    disabled={!cText.trim() || cBusy}
                    style={{
                      background: cText.trim() ? "#3B74F6" : "#17172A",
                      border: "none",
                      borderRadius: 9,
                      padding: "8px 10px",
                      cursor: cText.trim() ? "pointer" : "default",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                  >
                    {cBusy ? (
                      <Spinner size={14} color="#fff" />
                    ) : (
                      <Send size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {post.comments?.length === 0 && (
                <p
                  style={{
                    color: "#484865",
                    fontSize: 13,
                    textAlign: "center",
                    padding: "6px 0 2px",
                  }}
                >
                  No replies yet
                </p>
              )}
              {post.comments?.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    gap: 9,
                    padding: "9px 0",
                    borderTop: "1px solid #12121F",
                  }}
                >
                  <Avatar username={c.username} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          className="ax-heading"
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            nav("profile", { username: c.username })
                          }
                        >
                          {c.username}
                        </span>
                        <span style={{ color: "#484865", fontSize: 12 }}>
                          {timeAgo(c.createdAt)}
                        </span>
                      </div>
                      {c.username === currentUser && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#333354",
                            cursor: "pointer",
                            padding: "2px 3px",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#EF4444")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#333354")
                          }
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.55,
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
          )}
        </div>
      </div>
    </article>
  );
}
