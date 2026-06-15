/**
 * Academy Tenant Brand Configuration
 * Contains colors, fonts, logos, contact info, and visual tokens
 */

export const academyBrand = {
  // Business Info
  name: 'Your Academy',
  tagline: 'Learn & Grow',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'youracademy.com',
  
  // Contact
  email: 'support@youracademy.com',
  phone: '+1 (555) 987-6543',
  address: {
    street: '456 Innovation Ave',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
  },
  
  // Social
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  
  // Design - Empire Preset (Dark Premium)
  colors: {
    primary: '#E8B24F',        // Gold - main brand color
    secondary: '#2D3748',      // Dark gray - secondary
    background: '#1A202C',     // Dark charcoal - page background
    foreground: '#F7FAFC',     // Off-white - text
    muted: '#2D3748',          // Dark muted backgrounds
    accent: '#E8B24F',         // Gold - accent elements
    destructive: '#FC8181',    // Red - errors
  },
  
  // Typography
  fonts: {
    heading: 'Space Grotesk',   // Modern sans-serif
    body: 'Inter',               // Clean sans-serif
  },
  
  // Design Tokens
  style: {
    preset: 'empire',
    borderRadius: '0.75rem',
    shadows: 'medium',           // subtle | soft | medium | strong
    animations: 'heavy',         // minimal | moderate | heavy
  },
  
  // Logo
  logo: {
    src: '/images/academy-logo.svg',
    alt: 'Your Academy',
    width: 120,
    height: 40,
  },
  
  // SEO
  seo: {
    title: 'Your Academy - Learn Professional Skills',
    description: 'Master in-demand skills with our comprehensive courses and expert instruction.',
    ogImage: '/images/og-academy.jpg',
  },
}
