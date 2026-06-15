/**
 * relativeDate — convert a "days ago" integer into a rolling relative label.
 * Used by reviews so dates always look recent relative to when the page is
 * viewed ("2 days ago", "3 weeks ago", "2 months ago"). Computed at render time,
 * so a review never goes stale.
 */
export function relativeDate(daysAgo: number): string {
  const d = Math.max(1, Math.round(daysAgo))
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d} days ago`
  if (d < 14) return 'a week ago'
  if (d < 30) return `${Math.round(d / 7)} weeks ago`
  if (d < 60) return 'a month ago'
  return `${Math.round(d / 30)} months ago`
}