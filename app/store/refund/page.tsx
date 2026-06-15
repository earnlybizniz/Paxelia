/**
 * app/store/refund/page.tsx
 * User-facing path: /refund  (middleware rewrites → /store/refund)
 * All copy is interpolated from lib/policies-config.ts — no brand-specific
 * values are hardcoded here.
 */
import { PolicyLayout } from '@/components/policies/PolicyLayout'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import Link from 'next/link'

export const metadata = {
  title: `Refund & Returns Policy — ${C.brandName}`,
}

export default function RefundPage() {
  return (
    <PolicyLayout title="Refund &amp; Returns Policy" lastUpdated={C.lastUpdated}>

      <h2>Overview</h2>
      <p>
        At {C.brandName}, we stand behind every desk we make. We offer a{' '}
        <strong>{C.trialDays}-night in-home trial</strong> — if you are not completely
        satisfied with your purchase for any reason, you may return it within{' '}
        {C.returnWindowDays} days of delivery for a full refund. Our goal is simple:
        you should love your desk, or we make it right.
      </p>
      <p>
        Payments for {C.brandName} orders are processed by{' '}
        <strong>{C.merchantOfRecord}</strong>, our merchant of record. Refunds are
        returned to your original payment method via {C.merchantOfRecord}.
      </p>

      <h2>The {C.trialDays}-Night Trial</h2>
      <p>
        We encourage you to actually use your {C.brandName} desk — stand at it, work at
        it, live with it. You have a full <strong>{C.trialDays} nights</strong> from the
        date of delivery to decide. This is not a brief inspection window; it is a
        genuine trial period designed to give you enough time to evaluate the desk in
        your real workspace and daily routine.
      </p>
      <p>
        If at any point during those {C.trialDays} days you decide the desk is not right
        for you, contact us and we will arrange the return at no cost to you. No lengthy
        explanations required.
      </p>

      <h2>Eligibility for Returns</h2>
      <p>
        To be eligible for a return, the following conditions must be met:
      </p>
      <ul>
        <li>The return request is submitted within <strong>{C.returnWindowDays} days</strong> of your confirmed delivery date.</li>
        <li>The item is in its original or reasonably used condition — normal wear from the trial period is acceptable.</li>
        <li>All original hardware, components, and accessories are included.</li>
        <li>The item is not listed under the non-returnable items section below.</li>
      </ul>
      <p>
        We do not require items to be returned in original packaging, though we ask
        that you pack them securely to prevent shipping damage.
      </p>

      <h2>Return Window — {C.returnWindowDays} Days</h2>
      <p>
        Your {C.returnWindowDays}-day return window begins on the date your order is
        marked as delivered by the carrier. To initiate a return, you must contact us
        at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> before your return
        window expires. Requests submitted after the {C.returnWindowDays}-day window
        will not be eligible for a refund unless the item arrived damaged or defective
        (see section below).
      </p>

      <h2>How to Start a Return</h2>
      <p>
        To initiate a return, please email us at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> with:
      </p>
      <ul>
        <li>Your order number or order confirmation email</li>
        <li>The reason for your return (optional, but helps us improve)</li>
        <li>Photos of the item if it arrived damaged or defective</li>
      </ul>
      <p>
        Our support team will respond within 1–2 business days with return instructions
        and, where applicable, a prepaid return shipping label.
      </p>

      <h2>Return Shipping</h2>
      <p>
        {C.whoPaysReturnShipping === 'merchant'
          ? `${C.brandName} covers the cost of return shipping for all eligible returns within
             the ${C.returnWindowDays}-day window. We will email you a prepaid return label
             once your return is approved. You are responsible for packaging the item
             securely; damage caused by inadequate packaging during return transit may
             affect your refund.`
          : `Customers are responsible for return shipping costs. We recommend using a
             trackable shipping service and retaining your tracking number until your
             refund has been processed. ${C.brandName} is not responsible for items lost
             in transit during the return.`
        }
      </p>

      {C.restockingFeePct > 0 && (
        <>
          <h2>Restocking Fee</h2>
          <p>
            A restocking fee of <strong>{C.restockingFeePct}%</strong> of the item&apos;s
            original purchase price will be deducted from your refund. This fee covers the
            cost of inspecting and repackaging returned items.
          </p>
        </>
      )}

      <h2>Refund Method &amp; Timing</h2>
      <p>
        Once your return is received and inspected, we will notify you by email that
        we have received your item. Your refund will be processed to your original
        payment method within <strong>{C.refundProcessingDays}</strong> of receiving
        the returned item. Refunds are issued through <strong>{C.merchantOfRecord}</strong>,
        our payment processor.
      </p>
      <p>
        Please note that your bank or card issuer may require additional time to post
        the credit to your account. We recommend allowing up to 10 business days from
        the date of our refund confirmation before contacting your bank.
      </p>

      <h2>Non-Returnable Items</h2>
      <p>
        The following items are not eligible for return or refund:
      </p>
      <ul>
        {C.nonReturnable.map((item, i) => (
          <li key={i}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
        ))}
      </ul>

      <h2>Damaged or Defective Items</h2>
      <p>
        If your {C.brandName} desk arrives damaged or with a manufacturing defect,
        please contact us at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>{' '}
        within <strong>7 days of delivery</strong> with photos of the damage. We will
        arrange a free replacement of the damaged components, a full replacement unit,
        or a full refund — whichever you prefer.
      </p>
      <p>
        Damage caused by improper assembly, misuse, or normal wear and tear is not
        covered under our return policy but may be covered under our{' '}
        {C.warrantyYears}-year warranty. See our Terms of Service for warranty details.
      </p>

      <h2>Exchanges</h2>
      <p>
        We do not currently offer direct exchanges. If you would like a different size
        or finish, please initiate a return for your original order and place a new
        order for the configuration you want. Our team is happy to assist — email us
        at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions about your return or refund, please contact our support team:
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>
        <br />
        <strong>Address:</strong> {C.contactAddress}
      </p>
      <p>
        You can also visit our <Link href="/support">Support page</Link> for
        additional help.
      </p>

    </PolicyLayout>
  )
}
