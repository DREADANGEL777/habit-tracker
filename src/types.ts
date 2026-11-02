export type Habit = {
  id: string;
  name: string;
  category: string;
  target: string;
  reminderTime: string;
  completed: boolean;
  createdAt: number;
  streak: number;
  icon?: string;
  completionDates: string[];
};

export type HabitInput = {
  name: string;
  category: string;
  target: string;
  reminderTime: string;
};

export type DailyCompletion = {
  date: string;
  completed: boolean;
};
