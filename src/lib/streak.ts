export function calculateCurrentStreak(completions: string[]): number {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const dates = [...new Set(completions)].sort();

  
  if (!dates.includes(today)) return 0;

  // Count consecutive days backwards from today
  let streak = 0;
  let current = new Date(today);

  while (true) {
    const dateStr = current.toISOString().slice(0, 10);
    if (!dates.includes(dateStr)) break;

    streak++;
    current.setDate(current.getDate() - 1); // step back one calendar day
  }

  return streak;
}