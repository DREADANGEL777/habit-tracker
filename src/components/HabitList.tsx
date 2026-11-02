import type { Habit } from "../types";
import HabitItem from "./HabitItem";
import "./HabitList.css";

type HabitListProps = {
  habits: Habit[];
  onToggle: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  showFullAnalytics?: boolean;
};

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentStreak(habit: Habit): number {
  const completedDates = new Set(habit.completionDates ?? []);
  const today = new Date();

  // Якщо сьогодні звичку ще не виконано, серія може
  // продовжуватися з учорашнього дня.
  if (!completedDates.has(getDateKey(today))) {
    today.setDate(today.getDate() - 1);
  }

  let streak = 0;

  while (completedDates.has(getDateKey(today))) {
    streak += 1;
    today.setDate(today.getDate() - 1);
  }

  return streak;
}

function HabitList({
  habits,
  onToggle,
  onDelete,
  showFullAnalytics = false,
}: HabitListProps) {
  const completedCount = habits.filter((habit) => habit.completed).length;

  const totalCount = habits.length;

  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map(getCurrentStreak)) : 0;

  // Формуємо 12 тижнів історії на основі реальних completionDates.
  const heatmapDays = Array.from({ length: 84 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (83 - index));

    const dateKey = getDateKey(date);

    const completed = habits.filter((habit) =>
      (habit.completionDates ?? []).includes(dateKey),
    ).length;

    const intensity =
      completed === 0
        ? 0
        : totalCount > 0
          ? Math.min(4, Math.ceil((completed / totalCount) * 4))
          : 0;

    return {
      dateKey,
      label: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      completed,
      intensity,
    };
  });

  const todayKey = getDateKey(new Date());

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <section className="metric-card discipline-card">
          <div className="metric-card-heading">
            <span className="metric-icon">◉</span>
            <span className="metric-label">Today's discipline</span>
          </div>

          <div className="metric-value-row">
            <span className="metric-percentage">{percentage}%</span>

            <span className="metric-subtext">
              {completedCount}/{totalCount} done
            </span>
          </div>

          <div
            className="progress-bar-background"
            role="progressbar"
            aria-label="Today's completion"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="metric-footnote">
            {percentage === 100 && totalCount > 0
              ? "All goals completed. Amazing!"
              : "Every completed habit counts."}
          </p>
        </section>

        <section className="metric-card streak-card">
          <div className="streak-icon-box">🔥</div>

          <div>
            <p className="metric-label">Best current streak</p>
            <div className="streak-days">
              {bestStreak} <span>{bestStreak === 1 ? "day" : "days"}</span>
            </div>
            <p className="metric-footnote">Keep your momentum going.</p>
          </div>
        </section>

        <section className="metric-card">
          <p className="metric-label">Today's focus</p>
          <h3 className="focus-title">
            {totalCount === 0
              ? "Start with one habit"
              : percentage === 100
                ? "You showed up today"
                : "Progress over perfection"}
          </h3>
          <p className="metric-footnote">
            {totalCount === 0
              ? "Create a small daily goal to get started."
              : `${totalCount - completedCount} habits left for today.`}
          </p>
        </section>
      </aside>

      <div className="dashboard-main">
        <section className="protocol-section">
          <div className="protocol-header">
            <div>
              <p className="eyebrow">Your daily routine</p>
              <h2>Today's protocol</h2>
              <p className="section-description">
                Focus on showing up, one habit at a time.
              </p>
            </div>

            <span className="habit-count-badge">
              {completedCount}/{totalCount}
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>Your journey starts here</h3>
              <p>
                Add your first habit above and start building a routine that
                works for you.
              </p>
            </div>
          ) : (
            <ul className="habit-list">
              {habits.map((habit) => (
                <HabitItem key={habit.id} habit={habit} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </ul>
          )}
        </section>

        {showFullAnalytics && (
          <section className="analytics-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Consistency over time</p>
                <h2 className="eyebrow-2">Your activity</h2>
              </div>

              <span className="analytics-period">Last 12 weeks</span>
            </div>

            <div className="heatmap-card">
              <div className="heatmap-legend">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`heatmap-cell heatmap-level-${level}`}
                    aria-hidden="true"
                  />
                ))}
                <span>More</span>
              </div>

              <div
                className="heatmap-grid"
                aria-label="Habit completion over the last 12 weeks"
              >
                {heatmapDays.map((day) => (
                  <div
                    key={day.dateKey}
                    className={[
                      "heatmap-cell",
                      `heatmap-level-${day.intensity}`,
                      day.dateKey === todayKey ? "heatmap-today" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    title={`${day.label}: ${day.completed} habit${
                      day.completed === 1 ? "" : "s"
                    } completed`}
                    role="img"
                    aria-label={`${day.label}: ${day.completed} completed`}
                  />
                ))}
              </div>

              <p className="heatmap-caption">
                Each square represents a day. Brighter squares indicate more
                completed habits.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default HabitList;
