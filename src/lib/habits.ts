import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import type { Habit, HabitInput } from "../types";
import { db } from "./firebase";

function habitsCollection(userId: string) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  return collection(db, "users", userId, "habits");
}

function getTodayKey(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeHabit(id: string, data: Record<string, unknown>): Habit {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "New habit",
    category: typeof data.category === "string" ? data.category : "General",
    target: typeof data.target === "string" ? data.target : "Daily",
    reminderTime:
      typeof data.reminderTime === "string" ? data.reminderTime : "09:00",
    completed: typeof data.completed === "boolean" ? data.completed : false,
    createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
    streak: typeof data.streak === "number" ? data.streak : 0,
    icon: typeof data.icon === "string" ? data.icon : undefined,
    completionDates: Array.isArray(data.completionDates)
      ? data.completionDates.filter(
          (date): date is string => typeof date === "string",
        )
      : [],
  };
}

export function subscribeToHabits(
  userId: string,
  onChange: (habits: Habit[]) => void,
  onError: (error: Error) => void,
) {
  const habitsQuery = query(
    habitsCollection(userId),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    habitsQuery,
    (snapshot) => {
      const habits = snapshot.docs.map((habitDocument) =>
        normalizeHabit(
          habitDocument.id,
          habitDocument.data() as Record<string, unknown>,
        ),
      );

      onChange(habits);
    },
    (error) => onError(error),
  );
}

export async function createHabit(
  userId: string,
  input: HabitInput,
): Promise<void> {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Habit name is required.");
  }

  await addDoc(habitsCollection(userId), {
    name,
    category: input.category.trim() || "General",
    target: input.target.trim() || "Daily",
    reminderTime: input.reminderTime,
    completed: false,
    createdAt: Date.now(),
    streak: 0,
    completionDates: [],
  });
}

export async function updateHabit(
  userId: string,
  habitId: string,
  completed: boolean,
  currentCompletionDates: string[] = [],
): Promise<void> {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const today = getTodayKey();

  const completionDates = new Set(currentCompletionDates);

  if (completed) {
    completionDates.add(today);
  } else {
    completionDates.delete(today);
  }

  await updateDoc(doc(db, "users", userId, "habits", habitId), {
    completed,
    completionDates: Array.from(completionDates).sort(),
  });
}

export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, "users", userId, "habits", habitId));
}
