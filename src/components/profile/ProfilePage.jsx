import { useEffect, useState } from "react";
import { Edit3, X, AtSign } from "lucide-react";
import { PageHeader } from "../layout/PageHeader";
import { Avatar } from "../shared/Avatar";
import { Spinner } from "../shared/Spinner";
import { Divider } from "../shared/Divider";
import { PostCard } from "../posts/PostCard";
import { INPUT_STYLE } from "../../constants/config";
import { avatarColor } from "../../utils/helpers";
import { api } from "../../utils/api";

export function ProfilePage({
  username,
  currentUser,
  nav,
  toast,
}) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editPic, setEditPic] = useState("");
  const [saveBusy, setSaveBusy] = useState(false);

  const isOwn = username === currentUser;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setIsFollowing(false);
      try {
        const [p, allPosts] = await Promise.all([
          api.get(`/api/users/${username}`),
          api.get(`/api/posts?page=0&size=50`),
        ]);
        if (!cancelled) {
          setProfile(p);
          setEditBio(p.bio || "");
          setEditPic(p.profilePictureUrl || "");
          setPosts(allPosts.filter((x) => x.author === username));
        }
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
  }, [username]);

  async function handleFollow() {
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const updated = await api.post(
        `/api/users/${username}/follow`,
        {}
      );
      setProfile(updated);
      setIsFollowing(true);
      toast(`Following ${username}!`, "success");
    } catch (e) {
      if (e.status === 409) {
        setIsFollowing(true);
        toast("Already following", "info");
      } else toast(e.message, "error");
    } finally {
      setFollowBusy(false);
    }
  }

  async function handleUnfollow() {
    if (followBusy) return;
    setFollowBusy(true);
    try {
      const updated = await api.del(
        `/api/users/${username}/follow`
      );
      setProfile(updated);
      setIsFollowing(false);
      toast(`Unfollowed ${username}`, "info");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setFollowBusy(false);
    }
  }

  async function saveProfile() {
    setSaveBusy(true);
    try {
      const updated = await api.put(
        "/api/users/me",
        { bio: editBio, profilePictureUrl: editPic }
      );
      setProfile(updated);
      setEditOpen(false);
      toast("Profile updated!", "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaveBusy(false);
    }
  }

  async function handleDeletePost(pid) {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.del(`/api/posts/${pid}`);
      setPosts((p) => p.filter((x) => x.id !== pid));
      toast("Post deleted", "success");
    } catch (e) {
      toast(e.message, "error");
    }
  }

  if (loading)
    return (
      <div>
        <PageHeader title="Profile" onBack={() => nav("home")} />
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={30} />
        </div>
      </div>
    );
  if (!profile) return null;

  return (
    <div className="ax-fadeUp">
      <PageHeader title={profile.username} onBack={() => nav("home")} />

      {/* Banner + avatar */}
      <div style={{ position: "relative", marginBottom: 0 }}>
        <div
          style={{
            height: 110,
            background: `linear-gradient(135deg, ${avatarColor(username)}22 0%, #0C0C1E 60%, #060609 100%)`,
            borderBottom: "1px solid #17172A",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -32,
            left: 18,
            padding: 3,
            background: "#060609",
            borderRadius: "50%",
          }}
        >
          <Avatar
            username={profile.username}
            url={profile.profilePictureUrl}
            size={68}
          />
        </div>
      </div>

      {/* Action button */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px 0" }}>
        {isOwn ? (
          <button
            onClick={() => setEditOpen(true)}
            style={{
              background: "none",
              border: "1px solid #2A2A42",
              borderRadius: 22,
              padding: "8px 18px",
              color: "#EEEEF8",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "border-color 0.15s",
            }}
          >
            <Edit3 size={14} /> Edit profile
          </button>
        ) : isFollowing ? (
          <button
            onClick={handleUnfollow}
            disabled={followBusy}
            style={{
              background: "none",
              border: "1px solid #2A2A42",
              borderRadius: 22,
              padding: "8px 20px",
              color: "#EEEEF8",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {followBusy ? <Spinner size={14} /> : null} Unfollow
          </button>
        ) : (
          <button
            onClick={handleFollow}
            disabled={followBusy}
            style={{
              background: "#3B74F6",
              border: "none",
              borderRadius: 22,
              padding: "8px 22px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.18s",
            }}
          >
            {followBusy ? <Spinner size={14} color="#fff" /> : null} Follow
          </button>
        )}
      </div>

      {/* Profile info */}
      <div style={{ padding: "42px 18px 16px" }}>
        <div
          className="ax-heading"
          style={{
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: "-0.03em",
            marginBottom: 4,
          }}
        >
          {profile.username}
        </div>
        <div
          style={{
            color: "#555570",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 8,
          }}
        >
          <AtSign size={13} /> {profile.username}
        </div>
        {profile.bio && (
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "#AAAACC",
              margin: "0 0 12px",
            }}
          >
            {profile.bio}
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 14,
            color: "#888898",
          }}
        >
          <span>
            <strong style={{ color: "#EEEEF8" }}>
              {profile.followingCount ?? 0}
            </strong>{" "}
            Following
          </span>
          <span>
            <strong style={{ color: "#EEEEF8" }}>
              {profile.followerCount ?? 0}
            </strong>{" "}
            Followers
          </span>
        </div>
      </div>

      <Divider />

      {/* Posts tab */}
      <div style={{ padding: "0 18px", borderBottom: "1px solid #17172A" }}>
        <div
          style={{
            display: "inline-block",
            padding: "12px 0",
            fontSize: 14,
            fontWeight: 600,
            color: "#EEEEF8",
            borderBottom: `2px solid #3B74F6`,
            marginBottom: -1,
          }}
        >
          Posts
        </div>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 52, color: "#484865" }}>
          <p style={{ fontSize: 15, margin: 0 }}>No posts yet</p>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            currentUser={currentUser}
            nav={nav}
            onDelete={handleDeletePost}
            toast={toast}
          />
        ))
      )}

      {/* Edit modal */}
      {editOpen && (
        <div
          className="ax-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditOpen(false);
          }}
        >
          <div
            className="ax-scaleIn"
            style={{
              background: "#0E0E19",
              border: "1px solid #232338",
              borderRadius: 18,
              padding: "26px 26px",
              width: "100%",
              maxWidth: 420,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <span
                className="ax-heading"
                style={{ fontWeight: 800, fontSize: 19 }}
              >
                Edit Profile
              </span>
              <button
                onClick={() => setEditOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555570",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <label
              style={{
                fontSize: 12,
                color: "#555570",
                display: "block",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Bio
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              placeholder="Tell the world about yourself…"
              style={{
                ...INPUT_STYLE,
                borderRadius: 11,
                padding: "11px 13px",
                marginBottom: 16,
              }}
              className="ax-input"
            />

            <label
              style={{
                fontSize: 12,
                color: "#555570",
                display: "block",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Profile picture URL
            </label>
            <input
              value={editPic}
              onChange={(e) => setEditPic(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              style={{
                ...INPUT_STYLE,
                borderRadius: 11,
                padding: "11px 13px",
                marginBottom: 24,
              }}
              className="ax-input"
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setEditOpen(false)}
                style={{
                  background: "none",
                  border: "1px solid #232338",
                  borderRadius: 10,
                  padding: "10px 18px",
                  color: "#888898",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saveBusy}
                style={{
                  background: "#3B74F6",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {saveBusy ? <Spinner size={15} color="#fff" /> : null} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}