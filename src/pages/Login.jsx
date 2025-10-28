// src/pages/Login.jsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";
import { createSessionOnServer } from "../services/Api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleServerSession(user) {
    const idToken = await user.getIdToken(true);
    await createSessionOnServer(idToken); // will set HttpOnly cookie
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await handleServerSession(userCred.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally { setLoading(false); }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await handleServerSession(userCred.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Sign-up failed");
    } finally { setLoading(false); }
  }

  async function handleGoogleSignIn() {
    setError(""); setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleServerSession(result.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Login / Sign up</h2>

      <form onSubmit={handleEmailLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label><br />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8 }} />
        </div>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button type="submit" disabled={loading} style={{ flex: 1 }}>{loading ? "Signing in..." : "Sign in"}</button>
          <button type="button" onClick={handleSignUp} disabled={loading} style={{ flex: 1 }}>{loading ? "..." : "Sign up"}</button>
        </div>
      </form>

      <div style={{ textAlign: "center", margin: "12px 0", color: "#666" }}>OR</div>

      <button onClick={handleGoogleSignIn} disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "Please wait..." : "Sign in with Google"}
      </button>
    </div>
  );
}
