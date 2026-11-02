import { useState } from "react";
import type { FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthFormProps = {
  onBack?: () => void;
};

function AuthForm({ onBack }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;

    setError("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch {
      setError(
        isSignUp
          ? "Could not create your account. Check the email and password."
          : "Could not sign in. Check your email and password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!auth) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch {
      setError("Could not sign in with Google. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      {onBack && (
        <button
          className="text-button auth-back"
          type="button"
          onClick={onBack}
        >
          ← Back to home
        </button>
      )}
      <p className="eyebrow">Habit tracker</p>
      <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
      <p className="subtitle">
        Sign in to save your habits and reminders securely.
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={6}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>
      </form>
      <div className="auth-divider"><span>or</span></div>
      <button
        className="google-auth-button"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        Continue with Google
      </button>
      <button
        className="text-button"
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Need an account? Sign up"}
      </button>
    </section>
  );
}

export default AuthForm;
