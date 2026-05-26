export function injectStyles() {
  if (document.getElementById("axiom-gfonts")) return;

  const link = document.createElement("link");
  link.id = "axiom-gfonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    body { background: #060609; margin: 0; padding: 0; }

    .ax-root {
      font-family: 'DM Sans', sans-serif;
      background: #060609;
      color: #EEEEF8;
      min-height: 100vh;
    }
    .ax-heading { font-family: 'Outfit', sans-serif; }

    /* scrollbar */
    .ax-scroll::-webkit-scrollbar { width: 3px; }
    .ax-scroll::-webkit-scrollbar-track { background: transparent; }
    .ax-scroll::-webkit-scrollbar-thumb { background: #232338; border-radius: 2px; }

    /* animations */
    @keyframes ax-spin { to { transform: rotate(360deg); } }
    @keyframes ax-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ax-slideIn { from { transform:translateX(110%); opacity:0; } to { transform:translateX(0); opacity:1; } }
    @keyframes ax-scaleIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }

    .ax-spin   { animation: ax-spin   0.75s linear infinite; }
    .ax-fadeUp { animation: ax-fadeUp 0.22s ease forwards; }
    .ax-slideIn { animation: ax-slideIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
    .ax-scaleIn { animation: ax-scaleIn 0.2s ease forwards; }

    /* interactive states */
    .ax-post-row { transition: background 0.12s; }
    .ax-post-row:hover { background: rgba(255,255,255,0.018); }

    .ax-nav-btn {
      transition: background 0.14s, color 0.14s;
      border: none;
      background: none;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      text-align: left;
    }
    .ax-nav-btn:hover { background: rgba(255,255,255,0.05); }
    .ax-nav-btn.ax-active { background: rgba(56,122,246,0.13); color: #5B9FFF; }

    /* action btn hover tints */
    .ax-like-btn:hover  { color: #FB7185 !important; }
    .ax-cmt-btn:hover   { color: #60A5FA !important; }
    .ax-rp-btn:hover    { color: #34D399 !important; }

    /* input focus ring */
    .ax-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(56,122,246,0.45); }

    textarea { resize: none; }

    /* overlay */
    .ax-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(4px);
      z-index: 900;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }
  `;
  document.head.appendChild(s);
}
