import { useState } from "react";
import type { FormEvent } from "react";

import type { HabitInput } from "../types";

type HabitFormProps = {
  onAdd: (input: HabitInput) => Promise<void> | void;
  disabled?: boolean;
  isPremium?: boolean;
};

const categories = [
  "Mindset",
  "Health",
  "Fitness",
  "Learning",
  "Productivity",
  "Other",
];

function HabitForm({
  onAdd,
  disabled = false,
  isPremium = false,
}: HabitFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mindset");
  const [target, setTarget] = useState("10 min");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Give your habit a name first.");
      return;
    }

    if (submitting || disabled) return;

    setSubmitting(true);
    setError("");

    try {
      await onAdd({
        name: trimmedName,
        category,
        target: target.trim() || "Daily",
        reminderTime: isPremium ? reminderTime : "",
      });

      setName("");
      setCategory("Mindset");
      setTarget("10 min");
      setReminderTime("09:00");
    } catch {
      setError("Could not add your habit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="habit-form-main">
        <label className="field-label" htmlFor="habit-name">
          Habit name
        </label>

        <div className="habit-name-field">
          <span className="input-icon" aria-hidden="true">
            ✦
          </span>

          <input
            id="habit-name"
            className="habit-input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Drink 3L water"
            maxLength={80}
            autoComplete="off"
            required
            disabled={disabled || submitting}
          />
        </div>
      </div>

      <div className="habit-form-options">
        <div className="form-field">
          <label className="field-label" htmlFor="habit-category">
            Category
          </label>

          <select
            id="habit-category"
            className="habit-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={disabled || submitting}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="habit-target">
            Daily target
          </label>

          <input
            id="habit-target"
            className="habit-input"
            type="text"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="e.g. 10 min"
            maxLength={40}
            disabled={disabled || submitting}
          />
        </div>

        {isPremium && (
          <div className="form-field">
            <label className="field-label" htmlFor="habit-reminder">
              Reminder
            </label>

            <input
              id="habit-reminder"
              className="habit-input"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
              required
              disabled={disabled || submitting}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="habit-form-footer">
        <p className="form-hint">Small steps. Better habits. Every day.</p>

        <button
          type="submit"
          className="habit-submit-btn"
          disabled={disabled || submitting || !name.trim()}
        >
          <span aria-hidden="true">＋</span>
          {submitting ? "Adding..." : "Add habit"}
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
