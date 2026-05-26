import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { Avatar } from "../shared/Avatar";
import { Spinner } from "../shared/Spinner";
import { api } from "../../utils/api";

export function CreatePost({ token, currentUser, onCreated, toast }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const taRef = useRef();

  async function submit() {
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const post = await api.post("/api/posts", { text: text.trim() }, token);
      setText("");
      if (taRef.current) taRef.current.style.height = "auto";
      onCreated(post);
      toast("Post shared!", "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function autoResize(e) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    setText(el.value);
  }

  const canPost = text.trim().length > 0;

  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid #17172A" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar username={currentUser} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <textarea
            ref={taRef}
            value={text}
            onChange={autoResize}
            placeholder="What's happening?"
            rows={2}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              color: "#EEEEF8",
              fontSize: 17,
              fontFamily: "DM Sans, sans-serif",
              outline: "none",
              lineHeight: 1.65,
              marginBottom: 10,
              overflow: "hidden",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: text.length > 240 ? "#EF4444" : "#444460",
              }}
            >
              {text.length > 200 ? `${280 - text.length}` : ""}
            </span>
            <button
              onClick={submit}
              disabled={!canPost || busy}
              style={{
                background: canPost ? "#3B74F6" : "#15152A",
                border: "none",
                borderRadius: 22,
                padding: "8px 22px",
                color: canPost ? "#fff" : "#393960",
                fontWeight: 700,
                fontSize: 14,
                cursor: canPost ? "pointer" : "default",
                fontFamily: "Outfit, sans-serif",
                transition: "background 0.18s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {busy ? <Spinner size={14} color="#fff" /> : null}
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
