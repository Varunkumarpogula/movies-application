// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";
import { createSessionOnServer } from "../services/Api";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User already logged in:", user.email);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  async function handleServerSession(user) {
    console.log("Creating session for user:", user.email, "UID:", user.uid);
    const idToken = await user.getIdToken(true);
    await createSessionOnServer(idToken);
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login successful:", userCred.user.email);
      await handleServerSession(userCred.user);
      navigate("/");
    } catch (err) {
      console.error("Email login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up successful:", userCred.user.email);
      await handleServerSession(userCred.user);
      navigate("/");
    } catch (err) {
      console.error("Sign up error:", err);
      setError(err.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' // Always show account selection
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user.email);
      await handleServerSession(result.user);
      navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-gradient-orb orb-1"></div>
        <div className="login-gradient-orb orb-2"></div>
        <div className="login-gradient-orb orb-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎬</div>
          <h1 className="login-title">MovieHub</h1>
          <p className="login-subtitle">
            {isSignUp ? "Create your account" : "Welcome back!"}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleEmailLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              <>{isSignUp ? "Create Account" : "Sign In"}</>
            )}
          </button>

          <div className="toggle-mode">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="toggle-link"
              disabled={loading}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <div className="divider">
          <span className="divider-text">OR</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-google"
        >
          <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="login-footer">
          <p>By continuing, you agree to MovieHub's Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
