// src/components/LogoutButton.jsx
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { logoutOnServer } from "../services/Api";
import { useNavigate } from "react-router-dom";
import DataManager from "../utils/dataManager";

export default function LogoutButton({ clearLocalOnLogout = false }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setLoading(true);
    try {
      // clear server cookie
      try { await logoutOnServer(); } catch (e) { console.warn("Backend logout failed:", e); }

      // firebase signOut
      try { await signOut(auth); } catch (e) { console.warn("Firebase signOut failed:", e); }

      // optional: clear local cached favorites
      if (clearLocalOnLogout) {
        DataManager.clearFavoritesLocal();
        DataManager.clearRecentLocal();
      }

      navigate("/login");
    } finally { setLoading(false); }
  }

  return <button onClick={handleLogout} disabled={loading}>{loading ? "Logging out..." : "Logout"}</button>;
}
