const MAX_PLAYER_AGE = 120;

export function calculatePlayerAge(dateOfBirth: string, today = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age -= 1;
  }

  return age >= 0 && age <= MAX_PLAYER_AGE ? age : null;
}

export function isValidPlayerAge(value: string): boolean {
  if (!value.trim()) return false;
  const age = Number(value);
  return Number.isInteger(age) && age >= 0 && age <= MAX_PLAYER_AGE;
}
