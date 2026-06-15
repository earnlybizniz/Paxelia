/**
 * Academy Tenant Product Configuration
 * Digital product tiers with multiple billing cycles
 */

export interface BillingOption {
  cycle: 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'lifetime'
  price: number
  originalPrice?: number
  whopPlanId: string
  savings?: string
}

export interface Tier {
  id: string
  name: string
  description: string
  highlighted: boolean
  features: { text: string; included: boolean }[]
  billingOptions: BillingOption[]
}

export interface AcademyProduct {
  id: string
  name: string
  tagline: string
  description: string
  productTypes: ('course' | 'ebook' | 'community' | 'saas' | 'coaching' | 'templates')[]
  tiers: Tier[]
  bonuses?: { name: string; value: string; description: string }[]
  guarantee: { days: number; type: 'money-back' | 'satisfaction'; description: string }
}

export const academyProduct: AcademyProduct = {
  id: 'flagship-course',
  name: 'E-Commerce Launchpad',
  tagline: 'Everything You Need to Start Your Online Business',
  
  description: 'Complete guide to building a profitable e-commerce business from zero. Includes video lessons, templates, community access, and personal support.',
  
  productTypes: ['course', 'templates', 'community', 'coaching'],
  
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for beginners',
      highlighted: false,
      features: [
        { text: 'Video lessons (all modules)', included: true },
        { text: 'Email templates', included: true },
        { text: 'Community access', included: false },
        { text: 'Personal coaching', included: false },
        { text: 'Live group calls', included: false },
      ],
      billingOptions: [
        {
          cycle: 'monthly',
          price: 29.99,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_STARTER_MONTHLY || 'plan_starter_monthly',
        },
        {
          cycle: 'annual',
          price: 299.99,
          originalPrice: 359.88,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_STARTER_ANNUAL || 'plan_starter_annual',
          savings: 'Save $60',
        },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Most popular choice',
      highlighted: true,
      features: [
        { text: 'Video lessons (all modules)', included: true },
        { text: 'Email templates', included: true },
        { text: 'Community access', included: true },
        { text: 'Personal coaching (2 calls/month)', included: true },
        { text: 'Live group calls', included: false },
      ],
      billingOptions: [
        {
          cycle: 'monthly',
          price: 79.99,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_PRO_MONTHLY || 'plan_pro_monthly',
        },
        {
          cycle: 'annual',
          price: 799.99,
          originalPrice: 959.88,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_PRO_ANNUAL || 'plan_pro_annual',
          savings: 'Save $160',
        },
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'For serious entrepreneurs',
      highlighted: false,
      features: [
        { text: 'Video lessons (all modules)', included: true },
        { text: 'Email templates', included: true },
        { text: 'Community access', included: true },
        { text: 'Personal coaching (unlimited)', included: true },
        { text: 'Live group calls (weekly)', included: true },
      ],
      billingOptions: [
        {
          cycle: 'monthly',
          price: 199.99,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_ELITE_MONTHLY || 'plan_elite_monthly',
        },
        {
          cycle: 'annual',
          price: 1999.99,
          originalPrice: 2399.88,
          whopPlanId: process.env.NEXT_PUBLIC_WHOP_ACADEMY_ELITE_ANNUAL || 'plan_elite_annual',
          savings: 'Save $400',
        },
      ],
    },
  ],
  
  bonuses: [
    {
      name: 'Shopify Theme Template',
      value: '$97 value',
      description: 'Ready-to-use theme to launch your store in minutes',
    },
    {
      name: 'Email Marketing Sequence',
      value: '$127 value',
      description: 'Copy-paste email templates for sales funnels',
    },
    {
      name: 'Pricing Strategy Guide',
      value: '$77 value',
      description: 'How to price products for maximum profitability',
    },
  ],
  
  guarantee: {
    days: 30,
    type: 'money-back',
    description: 'Unconditional 30-day money-back guarantee. If you don\'t love it, get a full refund.',
  },
}
