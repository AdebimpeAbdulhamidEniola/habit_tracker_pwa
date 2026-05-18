export function validateHabitName (name: string): {
    valid: boolean;
    value: string;
    error: string | null 
} {
  const trimmed = name.trim()

  if (!trimmed || trimmed.length == 0)
    return {valid: false, value:"",error: "empty input: Habit name is required" }

  else if (trimmed.length >= 60)
    return {valid: false, value: trimmed, error: "input longer than 60 characters: Habit name must be 60 characters or fewer"}

  else 
    return {valid: true, value: trimmed, error: null}


}