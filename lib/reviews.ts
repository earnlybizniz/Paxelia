/**
 * REVIEWS DATA
 * 
 * Sample reviews for the reviews page and product page.
 * Replace with real reviews or fetch from an API.
 */

export interface Review {
  id: string
  stars: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  author: string
  date: string
  size: 'sm' | 'md' | 'lg'
  finish: 'walnut' | 'oak' | 'ash' | 'ink'
  verified: boolean
  photo?: string
  helpful: number
}

export const reviews: Review[] = [
  {
    id: '1',
    stars: 5,
    title: 'Worth every penny',
    body: 'After years of cheap desks that wobbled and squeaked, this is a revelation. The solid hardwood top is gorgeous and the motors are whisper quiet. Assembly took 15 minutes.',
    author: 'Michael T.',
    date: '2024-01-15',
    size: 'md',
    finish: 'walnut',
    verified: true,
    helpful: 127,
  },
  {
    id: '2',
    stars: 5,
    title: 'My back thanks me',
    body: 'Standing desk convert here. The memory presets are a game changer - I switch between sitting and standing a dozen times a day now. Zero wobble even at max height.',
    author: 'Sarah K.',
    date: '2024-01-12',
    size: 'lg',
    finish: 'oak',
    verified: true,
    photo: '/images/reviews/review-2.jpg',
    helpful: 89,
  },
  {
    id: '3',
    stars: 5,
    title: 'Finally, a desk that matches my setup',
    body: 'The ink black finish is stunning. Pairs perfectly with my monitors and looks like a piece of furniture, not office equipment. Cable management is chef\'s kiss.',
    author: 'David L.',
    date: '2024-01-10',
    size: 'md',
    finish: 'ink',
    verified: true,
    helpful: 76,
  },
  {
    id: '4',
    stars: 4,
    title: 'Great desk, minor nitpick',
    body: 'The desk itself is phenomenal - beautiful wood, smooth motors, rock solid. My only wish is that the control panel had a display. Otherwise perfect.',
    author: 'Jennifer M.',
    date: '2024-01-08',
    size: 'sm',
    finish: 'ash',
    verified: true,
    helpful: 54,
  },
  {
    id: '5',
    stars: 5,
    title: 'Exceeded expectations',
    body: 'Was skeptical about paying this much for a desk but it\'s genuinely a different class of product. The hand-oiled walnut is beautiful and the build quality is obvious.',
    author: 'Robert H.',
    date: '2024-01-05',
    size: 'lg',
    finish: 'walnut',
    verified: true,
    photo: '/images/reviews/review-5.jpg',
    helpful: 112,
  },
  {
    id: '6',
    stars: 5,
    title: 'Best WFH upgrade',
    body: 'Working from home for 3 years and this is the single best upgrade I\'ve made. The 72" gives me room for two monitors plus laptop. Love being able to stand.',
    author: 'Amanda C.',
    date: '2024-01-03',
    size: 'lg',
    finish: 'walnut',
    verified: true,
    helpful: 67,
  },
  {
    id: '7',
    stars: 5,
    title: 'Customer service is excellent',
    body: 'Had a small issue with delivery timing and their team went above and beyond to make it right. The desk is beautiful and the company clearly cares.',
    author: 'Chris P.',
    date: '2023-12-28',
    size: 'md',
    finish: 'oak',
    verified: true,
    helpful: 45,
  },
  {
    id: '8',
    stars: 5,
    title: 'Quiet enough for podcasting',
    body: 'I record podcasts at my desk and was worried about motor noise. Tested it - you literally cannot hear it on recordings. Impressed.',
    author: 'Emily R.',
    date: '2023-12-25',
    size: 'sm',
    finish: 'ink',
    verified: true,
    helpful: 93,
  },
]

// Helper to get filtered reviews
export function getFilteredReviews(options?: {
  stars?: number
  size?: string
  finish?: string
  withPhotos?: boolean
}) {
  let filtered = [...reviews]
  
  if (options?.stars) {
    filtered = filtered.filter(r => r.stars === options.stars)
  }
  if (options?.size) {
    filtered = filtered.filter(r => r.size === options.size)
  }
  if (options?.finish) {
    filtered = filtered.filter(r => r.finish === options.finish)
  }
  if (options?.withPhotos) {
    filtered = filtered.filter(r => r.photo)
  }
  
  return filtered
}

// Get reviews count by star rating
export function getReviewsBreakdown() {
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => { breakdown[r.stars]++ })
  return breakdown
}
