import type { Habit } from "../types";

type HabitItemProps = {
  habit: Habit;
  onToggle: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentStreak(habit: Habit): number {
  const dates = new Set(habit.completionDates ?? []);
  const date = new Date();

  if (!dates.has(getDateKey(date))) {
    date.setDate(date.getDate() - 1);
  }

  let streak = 0;

  while (dates.has(getDateKey(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Mindset: "🧠",
    Health: "💚",
    Fitness: "🏋️",
    Learning: "📚",
    Productivity: "⚡",
    Other: "✦",
    General: "✦",
  };

  return icons[category] ?? "✦";
}

function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const streak = getCurrentStreak(habit);

  return (
    <li className={`habit-item ${habit.completed ? "completed" : ""}`}>
      <label className="habit-item-content">
        <input
          type="checkbox"
          checked={habit.completed}
          onChange={() => onToggle(habit.id)}
          className="sr-only"
          aria-label={`Mark ${habit.name} as ${
            habit.completed ? "incomplete" : "complete"
          }`}
        />

        <span
          className={`custom-checkbox ${habit.completed ? "checked" : ""}`}
          aria-hidden="true"
        >
          {habit.completed && <span className="checkmark">✓</span>}
        </span>

        <span className="habit-details">
          <span className="habit-title">
            <span className="habit-icon" aria-hidden="true">
              {habit.icon || getCategoryIcon(habit.category)}
            </span>

            <span
              className={`habit-name ${
                habit.completed ? "completed-text" : ""
              }`}
            >
              {habit.name}
            </span>
          </span>

          <span className="habit-meta">
            <span className="habit-category">
              {habit.category || "General"}
            </span>

            <span className="meta-separator" aria-hidden="true">
              ·
            </span>

            <span className="habit-target">
              Target: {habit.target || "Daily"}
            </span>
          </span>

          <span className="habit-reminder">
            <span aria-hidden="true">◷</span>
            Reminder: {habit.reminderTime || "09:00"}
          </span>
        </span>
      </label>

      <div
        className={`habit-streak-badge ${streak > 0 ? "has-streak" : ""}`}
        title={`${streak} consecutive days`}
      >
        <span className="flame-icon" aria-hidden="true">
          🔥
        </span>

        <span>{streak}d</span>
      </div>
      <button
        type="button"
        className="habit-delete-button"
        onClick={() => onDelete(habit.id)}
        aria-label={`Delete ${habit.name}`}
        title="Delete habit"
      >
        ×
      </button>
    </li>
  );
}

export default HabitItem;
