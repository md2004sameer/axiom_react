import { useState } from "react";
import { Zap } from "lucide-react";
import { Spinner } from "../shared/Spinner";
import { INPUT_STYLE } from "../../constants/config";
import { api } from "../../utils/api";

export function AuthPage({ mode, onLogin, nav, toast }) {
  const isLogin = mode === "login";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!username.trim() || !password || busy) return;
    setBusy(true);
    try {
      if (isLogin) {
        // Backend sets ax_tok cookie; body now returns { username }
        const data = await api.post("/api/auth/login", {
          username: username.trim(),
          password,
        });
        onLogin(data.username);
      } else {
        await api.post("/api/auth/signup", {
          username: username.trim(),
          password,
        });
        toast("Account created! Sign in to continue.", "success");
        nav("login");
      }
    } catch (e) {
      const msg =
        e.status === 400
          ? e.message
          : isLogin
            ? "Invalid credentials"
            : "Signup failed";
      toast(msg, "error");
    } finally {
      setBusy(false);
    }
  }

  const canSubmit = username.trim().length > 0 && password.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#060609",
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(59,116,246,0.12) 0%, transparent 70%)",
      }}
    >
      <div className="ax-fadeUp" style={{ width: "100%", maxWidth: 370 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: "#3B74F6",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 0 40px rgba(59,116,246,0.35)",
            }}
          >
            <Zap size={28} color="#fff" fill="#fff" />
          </div>
          <h1
            className="ax-heading"
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: "-0.045em",
            }}
          >
            Axiom
          </h1>
          <p
            style={{
              color: "#484865",
              margin: "8px 0 0",
              fontSize: 15,
            }}
          >
            {isLogin ? "Welcome back" : "Join the conversation"}
          </p>
        </div>

        <div
          style={{
            background: "#0B0B17",
            border: "1px solid #1A1A2C",
            borderRadius: 20,
            padding: "28px 26px",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                color: "#555570",
                display: "block",
                marginBottom: 7,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sameer"
              style={INPUT_STYLE}
              className="ax-input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 26 }}>
            <label
              style={{
                fontSize: 12,
                color: "#555570",
                display: "block",
                marginBottom: 7,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={INPUT_STYLE}
              className="ax-input"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          <button
            onClick={submit}
            disabled={!canSubmit || busy}
            style={{
              width: "100%",
              background: canSubmit ? "#3B74F6" : "#12122A",
              border: "none",
              borderRadius: 13,
              padding: "14px",
              color: canSubmit ? "#fff" : "#2E2E54",
              fontWeight: 800,
              fontSize: 16,
              cursor: canSubmit ? "pointer" : "default",
              fontFamily: "Outfit, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            {busy ? (
              <Spinner size={18} color="#fff" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#484865",
            fontSize: 15,
          }}
        >
          {isLogin ? "No account? " : "Have an account? "}
          <span
            style={{
              color: "#5B9FFF",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => nav(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}