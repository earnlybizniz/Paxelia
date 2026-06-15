/**
 * app/store/shipping/page.tsx
 * User-facing path: /shipping  (middleware rewrites → /store/shipping)
 * All copy is interpolated from lib/policies-config.ts.
 */
import { PolicyLayout } from '@/components/policies/PolicyLayout'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import Link from 'next/link'

export const metadata = {
  title: `Shipping Policy — ${C.brandName}`,
}

export default function ShippingPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated={C.lastUpdated}>

      <h2>Overview</h2>
      <p>
        {C.brandName} ships to customers across the {C.shippingRegions.join(' and ')}.
        We are committed to fast, careful fulfillment — every desk is inspected before
        it leaves our facility and shipped via reliable carriers to ensure it arrives
        in perfect condition. This policy covers everything you need to know about how
        your order travels from us to you.
      </p>

      <h2>Where We Ship</h2>
      <p>
        We currently ship to addresses within the{' '}
        <strong>{C.shippingRegions.join(', ')}</strong>.{' '}
        {!C.internationalShipping
          ? <>We do not currently offer international shipping outside of{' '}
              {C.shippingRegions.join(' and ')}. If you are located outside these
              regions and are interested in a {C.brandName} desk, please contact us
              at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> — we may
              be able to accommodate your request on a case-by-case basis.</>
          : <>We also ship internationally to select countries. International shipping
              rates and delivery times vary by destination. Duties, taxes, and customs
              fees are the responsibility of the recipient and are not included in
              your order total.</>
        }
      </p>
      <p>
        We are unable to ship to P.O. Boxes for large furniture items. Please provide
        a valid residential or commercial street address at checkout.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders are processed and dispatched within{' '}
        <strong>{C.processingTime}</strong> after your order is confirmed, excluding
        weekends and public holidays. You will receive an order confirmation email
        immediately after purchase, followed by a shipping confirmation email with
        your tracking information once your order has been handed to the carrier.
      </p>
      <p>
        During high-demand periods — such as promotional sales or major holidays —
        processing times may be slightly extended. We will communicate any significant
        delays proactively by email.
      </p>

      <h2>Delivery Estimates</h2>
      <p>
        Once dispatched, estimated delivery time is{' '}
        <strong>{C.deliveryEstimate}</strong> from the date of shipment, depending on
        your location within the {C.shippingRegions.join(' and ')}.
      </p>
      <p>
        Delivery estimates are provided by the carrier and are not guaranteed.
        Factors such as weather events, carrier delays, remote delivery locations,
        and holiday volume can occasionally extend delivery times. {C.brandName} is
        not responsible for carrier delays beyond our control, but we will assist you
        in investigating any delays that exceed a reasonable window.
      </p>

      <h2>Shipping Costs</h2>
      <p>
        <strong>{C.shippingCost}.</strong> There are no hidden shipping charges —
        what you see at checkout is what you pay. The price of your{' '}
        {C.brandName} desk includes delivery to your door anywhere within the{' '}
        {C.shippingRegions.join(' and ')}.
      </p>

      <h2>Carriers</h2>
      <p>
        We ship via <strong>{C.carrier}</strong>. The specific carrier assigned to
        your order will be confirmed in your shipping notification email. Carrier
        selection may depend on your delivery address and regional availability.
      </p>

      <h2>Order Tracking</h2>
      {C.tracking ? (
        <>
          <p>
            Once your order ships, you will receive a shipping confirmation email
            containing your tracking number and a direct link to the carrier&apos;s
            tracking page. You can also track your order at any time using our{' '}
            <Link href="/track-order">Track Order</Link> page — enter your tracking
            number and you will be redirected to live carrier updates.
          </p>
          <p>
            Please allow up to 24 hours after receiving your shipping confirmation
            for tracking information to become active on the carrier&apos;s website.
            If your tracking number does not show activity after 24 hours, please
            contact us at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>.
          </p>
        </>
      ) : (
        <p>
          Tracking is not currently available for all shipments. If you have not
          received your order within the estimated delivery window, please contact
          us at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>.
        </p>
      )}

      <h2>Delays</h2>
      <p>
        Occasionally, shipments may be delayed due to circumstances outside our
        control, including severe weather, natural disasters, carrier network
        disruptions, or customs holds. In the event of a significant delay we will
        proactively notify you by email with an updated estimate.
      </p>
      <p>
        If your order has not arrived within 14 days of your expected delivery date,
        please contact us at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> and we will
        investigate with the carrier on your behalf.
      </p>

      <h2>Incorrect Address</h2>
      <p>
        Please ensure your shipping address is accurate and complete before placing
        your order. {C.brandName} is not responsible for orders delivered to an
        incorrect address provided at checkout. If you notice an address error
        immediately after placing your order, contact us at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> as soon as
        possible. We will do our best to update the address before dispatch, but
        cannot guarantee changes once an order is in processing.
      </p>

      <h2>Lost or Stolen Packages</h2>
      <p>
        If your tracking shows your package as delivered but you have not received
        it, please take the following steps before contacting us:
      </p>
      <ul>
        <li>Check around your delivery area — front door, side entrance, garage, or a neighbour&apos;s address</li>
        <li>Wait 24 hours, as carriers occasionally mark packages delivered slightly early</li>
        <li>Contact the carrier directly using your tracking number to open a missing package investigation</li>
        <li>Contact us at <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> if the matter is unresolved after 48 hours</li>
      </ul>
      <p>
        {C.brandName} is not liable for packages confirmed as delivered by the
        carrier that are subsequently stolen. We recommend ensuring someone is
        available to receive large furniture deliveries or arranging a secure
        delivery location with your carrier in advance.
      </p>

      <h2>Contact</h2>
      <p>
        For any shipping-related questions, please reach out to our support team:
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
