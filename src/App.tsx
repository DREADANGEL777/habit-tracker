import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import "./App.css";

import AuthForm from "./components/AuthForm";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import HomePage from "./components/HomePage";
import type { Habit, HabitInput } from "./types";
import { createHabit, deleteHabit, subscribeToHabits, updateHabit } from "./lib/habits";
import { auth, isFirebaseConfigured } from "./lib/firebase";

export type Plan = "free" | "premium-monthly" | "premium-yearly";

const FREE_HABIT_LIMIT = 3;

function App() {
  const [screen, setScreen] = useState<"home" | "auth">("home");
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(auth));
  const [habits, setHabits] = useState<Habit[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Free is the default plan.
  const [plan, setPlan] = useState<Plan>("free");

  const alertedHabits = useRef(new Set<string>());

  const isPremium = plan !== "free";
  const canAddHabit = isPremium || habits.length < FREE_HABIT_LIMIT;

  function handleSelectPlan(nextPlan: Plan) {
    setPlan(nextPlan);
    setError("");
  }

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
      setHabits([]);
      setError("");
      alertedHabits.current.clear();
      setAuthLoading(false);

      if (user) {
        setScreen("home");
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    return subscribeToHabits(userId, setHabits, () => {
      setError(
        "Could not load your habits. Check your connection and Firestore rules.",
      );
    });
  }, [userId]);

  // Reminders are available on both Premium plans.
  useEffect(() => {
    if (!isPremium) return;

    const expired = habits.filter((habit) => {
      if (habit.completed || !habit.reminderTime) return false;

      const [hours, minutes] = habit.reminderTime.split(":").map(Number);

      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return false;
      }

      const reminder = new Date();
      reminder.setHours(hours, minutes, 0, 0);

      return (
        reminder.getTime() <= Date.now() && !alertedHabits.current.has(habit.id)
      );
    });

    if (expired.length > 0) {
      expired.forEach((habit) => {
        alertedHabits.current.add(habit.id);
      });

      window.alert(
        `Reminder time has passed: ${expired
          .map((habit) => habit.name)
          .join(", ")}`,
      );
    }
  }, [habits, isPremium]);

  async function handleAddHabit(input: HabitInput) {
    if (!userId) {
      throw new Error("You must be signed in to add a habit.");
    }

    if (saving) {
      throw new Error("Please wait while your habit is being saved.");
    }

    // Enforce the Free plan limit in the handler as well as in the UI.
    if (!isPremium && habits.length >= FREE_HABIT_LIMIT) {
      const message =
        "The Free plan allows up to 3 habits. Upgrade to Premium for unlimited habits.";

      setError(message);
      throw new Error(message);
    }

    setSaving(true);
    setError("");

    try {
      // Free users cannot save reminder settings.
      const habitInput: HabitInput = isPremium
        ? input
        : {
            ...input,
            reminderTime: "",
          };

      await createHabit(userId, habitInput);
    } catch {
      setError("Could not save the habit. Please try again.");
      throw new Error("Could not save the habit. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleHabit(id: string) {
    if (!userId) return;

    const habit = habits.find((item) => item.id === id);

    if (!habit) return;

    try {
      await updateHabit(userId, id, !habit.completed, habit.completionDates);
    } catch {
      setError("Could not update the habit. Please try again.");
    }
  }

  async function handleDeleteHabit(id: string) {
    if (!userId) return;

    const habit = habits.find((item) => item.id === id);
    if (!habit || !window.confirm(`Delete "${habit.name}"?`)) return;

    try {
      await deleteHabit(userId, id);
    } catch {
      setError("Could not delete the habit. Please try again.");
    }
  }

  async function handleSignOut() {
    if (!auth) return;

    await signOut(auth);
    setScreen("home");
  }

  if (screen === "auth") {
    if (!isFirebaseConfigured) {
      return (
        <main className="app-shell">
          <section className="auth-card setup-card">
            <p className="eyebrow">Firebase setup required</p>
            <h1>Connect your project</h1>
            <p className="subtitle">
              Add your Firebase values to <code>.env.local</code> and restart
              the app.
            </p>

            <button className="text-button" onClick={() => setScreen("home")}>
              Back to home
            </button>
          </section>
        </main>
      );
    }

    return (
      <main className="app-shell">
        {authLoading ? (
          <p>Loading...</p>
        ) : (
          <AuthForm onBack={() => setScreen("home")} />
        )}
      </main>
    );
  }

  return (
    <HomePage
      isAuthenticated={Boolean(userId)}
      onSignIn={() => setScreen("auth")}
      onSignOut={handleSignOut}
      onTryTracker={() => undefined}
      plan={plan}
      onSelectPlan={handleSelectPlan}
      renderTracker={(onBack) => {
        if (!isFirebaseConfigured) {
          return (
            <section className="auth-card setup-card">
              <h2>Firebase setup required</h2>
              <p>
                Configure your Firebase environment variables to use the
                tracker.
              </p>

              <button className="text-button" onClick={onBack}>
                Back to landing page
              </button>
            </section>
          );
        }

        if (authLoading) {
          return (
            <section className="dashboard">
              <p>Loading your tracker...</p>
            </section>
          );
        }

        if (!userId) {
          return <AuthForm onBack={onBack} />;
        }

        const completedCount = habits.filter((habit) => habit.completed).length;

        const percentage = habits.length
          ? Math.round((completedCount / habits.length) * 100)
          : 0;

        const planLabel =
          plan === "premium-yearly"
            ? "Premium Yearly"
            : plan === "premium-monthly"
              ? "Premium Monthly"
              : "Free";

        return (
          <section className="dashboard embedded-tracker">
            <div className="embedded-tracker-header">
              <div>
                <p className="eyebrow">Your live workspace</p>
                <h2>Today&apos;s protocol</h2>

                <p className="subtitle">
                  Your habits are synced to your account.
                </p>

                <p className="subtitle">
                  Current plan: <strong>{planLabel}</strong>
                </p>

                {!isPremium && (
                  <p className="subtitle">
                    {habits.length} of {FREE_HABIT_LIMIT} free habits used.
                  </p>
                )}
              </div>

              <div className="embedded-tracker-actions">
                <span className="embedded-progress">
                  {percentage}% complete
                </span>

                <button
                  type="button"
                  className="embedded-back-button"
                  onClick={onBack}
                >
                  Back to landing page
                </button>
              </div>
            </div>

            {!canAddHabit && (
              <p className="form-error" role="alert">
                You have reached the Free plan limit of 3 habits. Upgrade to
                Premium to create unlimited habits.
              </p>
            )}

            <HabitForm
              onAdd={handleAddHabit}
              disabled={saving || !canAddHabit}
              isPremium={isPremium}
            />

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <HabitList
              habits={habits}
              onToggle={handleToggleHabit}
              onDelete={handleDeleteHabit}
              showFullAnalytics={isPremium}
            />
          </section>
        );
      }}
    />
  );
}

export default App;
