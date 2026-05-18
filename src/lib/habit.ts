import { Habit } from "@/app/types/Habit";
export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...new Set(habit.completions)]; // remove any existing duplicates

  if (completions.includes(date)) {
    
    return {
      ...habit,
      completions: completions.filter(d => d !== date),
    };
  } else {
    
    return {
      ...habit,
      completions: [...completions, date],
    };
  }
}