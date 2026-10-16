/** Full calendar years, with a February 29 anniversary falling on March 1. */
export function ageAt(date: string, today = new Date()) {
  const [year, month, day] = date.split("-").map(Number);
  return (
    today.getUTCFullYear() -
    year -
    (today.getUTCMonth() + 1 < month ||
    (today.getUTCMonth() + 1 === month && today.getUTCDate() < day)
      ? 1
      : 0)
  );
}

export function ageForProfile(
  profile: { age?: number; ageRecordedAt?: string; birthDate?: string | null },
  today = new Date(),
): number | null {
  if (typeof profile.age === "number" && profile.ageRecordedAt) {
    return profile.age + Math.max(0, ageAt(profile.ageRecordedAt, today));
  }
  // Read older saved cards and participation snapshots without requiring a migration.
  return profile.birthDate ? ageAt(profile.birthDate, today) : null;
}
