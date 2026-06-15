/**
 * Academy Tenant Checkout Configuration
 * Whop settings with full compliance features
 */

export const academyCheckout = {
  // Whop Settings
  whop: {
    enabled: true,
    companyId: process.env.WHOP_COMPANY_ID,
    apiKey: process.env.WHOP_API_KEY,
    webhookSecret: process.env.WHOP_WEBHOOK_SECRET,
  },
  
  // Checkout Display
  display: {
    hideProductInfo: false,      // Show product info
    hideQuantitySelector: true,  // No quantity selection
    showFullCheckout: true,      // Complete Whop experience
    showSubscriptionTerms: true, // Show billing terms
  },
  
  // Express Checkout
  expressCheckout: {
    enableApplePay: true,
    enableGooglePay: true,
  },
  
  // Billing
  billing: {
    acceptedPaymentMethods: ['card', 'apple_pay', 'google_pay'],
    currency: 'USD',
    showRecurringBilling: true,
  },
  
  // Policies & Compliance
  compliance: {
    refundDays: 30,
    cancellableAnytime: true,
    easyRefundProcess: true,
    showGuarantee: true,
  },
  
  // Redirect URLs
  redirects: {
    success: '/thank-you',
    cancel: '/pricing',
  },
  
  // Messaging
  messaging: {
    preCheckoutHeadline: 'Get Instant Access',
    preCheckoutSubheadline: 'Start learning today. Cancel anytime, no questions asked.',
    cancellableAnyTime: true,
    cancellationLink: 'https://whop.com/hub', // Link to Whop Hub for cancellation
  },
}
