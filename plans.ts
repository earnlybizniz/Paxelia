// config/academy/plans.ts
export type Plan = {
  id: "30" | "60" | "90"
  days: number
  name: string
  price: number
  perDay: string
  note?: string
  badge?: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  { id: "30", days: 30, name: "30 Days", price: 99.99, perDay: "~$3.33 / day" },
  { id: "60", days: 60, name: "60 Days", price: 139.99, perDay: "~$2.33 / day", note: "~30% less per day" },
  { id: "90", days: 90, name: "90 Days", price: 189.99, perDay: "~$2.11 / day", badge: "Best value", featured: true },
]

export const MEMBERSHIP_INCLUDES: string[] = [
  "The full ebook — Mastering Google Ads",
  "The private Telegram community — every room, nothing locked",
  "The Weekly Optimize Loop — one focused action each week",
  "Weekly Google Ads & Merchant Center policy updates",
  "The template vault — every checklist from the book",
  "Ask-the-group Q&A + monthly office hours",
]

export const GUARANTEE_DAYS = 30
export const SUPPORT_EMAIL = "support@wylorise.store"
