// src/components/LogoutButton.jsx
import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import DataManager from "../utils/dataManager";
import * as Api from "../services/Api";
import { useNavigate } from "react-router-dom";
import "../css/LogoutButton.css";

export default function LogoutButton({ user = null }) {
  const [open, setOpen] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // close on outside click / Esc
  useEffect(() => {
    function handleClickOutside(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  async function handleLogout() {
    setLoadingLogout(true);

    // 1) Firebase signOut
    try {
      await signOut(auth);
      console.log("Firebase signOut successful");
    } catch (err) {
      console.warn("Firebase signOut failed:", err);
      // continue to try clearing local and server session anyway
    }

    // 2) Ask server to destroy session/cookie (best-effort)
    try {
      await Api.destroySessionOnServer();
      console.log("Server session destroyed (server responded OK)");
    } catch (err) {
      console.warn("Server logout failed (server may be down):", err);
    }

    // 3) Clear local data for the user
    try {
      DataManager.clearAllUserData();
      console.log("Cleared local user data");
    } catch (err) {
      console.warn("Clearing local user data failed:", err);
    }

    setLoadingLogout(false);
    setOpen(false);

    // 4) Navigate to login page (or home) after logout
    try {
      navigate("/login");
    } catch (e) {
      // in case router not available, fallback to reload
      window.location.href = "/login";
    }
  }

  return (
    <div className="logout-button-container" ref={containerRef}>
      <button
        type="button"
        className="account-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="account-icon" aria-hidden>
          {user && user.photoURL ? (
            <img className="profile-avatar" src={user.photoURL} alt="avatar" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.866 3.134-7 7-7h2c3.866 0 7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>

        <span style={{ minWidth: 8 }} />

        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "white", fontWeight: 500 }}>
            {user ? (user.displayName || user.name || "Account") : "Account"}
          </span>
          <span className="dropdown-arrow" aria-hidden style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </span>
      </button>

      {open && (
        <>
          <div className="menu-backdrop" />

          <div className="account-menu" role="menu" aria-label="Account menu">
            <div className="menu-header">
              <div className="user-info">
                <img className="menu-avatar" src={(user && user.photoURL) || ""} alt="User avatar" />
                <div className="user-details">
                  <div className="user-name">{user ? (user.displayName || user.name) : "Guest"}</div>
                  <div className="user-email">{user ? (user.email || "") : ""}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="menu-item logout" onClick={handleLogout} disabled={loadingLogout}>
                  {loadingLogout ? "Signing out…" : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
