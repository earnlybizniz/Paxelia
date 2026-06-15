// app/edu/refund/page.tsx
import type { Metadata } from "next"
import { LegalPage } from "@/components/academy/legal-page"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Wylorise offers a 30-day money-back guarantee on your first payment. Cancel anytime.",
  alternates: { canonical: "/refund" },
}

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="June 14, 2026">
      <h2>30-day money-back guarantee</h2>
      <p>
        If Wylorise isn&apos;t right for you, you can request a full refund of your first payment within 30 days of that
        payment. No hoops.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Email <a href="mailto:support@wylorise.store">support@wylorise.store</a> from the address on your account within
        30 days of your first payment and let us know you&apos;d like a refund. We&apos;ll take care of it.
      </p>

      <h2>Renewals</h2>
      <p>
        The guarantee applies to your first payment only. Renewal payments made after the initial 30-day window are
        non-refundable.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel your membership at any time. When you cancel, you keep full access through the end of the period
        you have already paid for, and you simply aren&apos;t billed again. You can manage or cancel your membership
        anytime — see <a href="/manage">Manage membership</a>.
      </p>

      <h2>How refunds are processed</h2>
      <p>
        Refunds are issued through our merchant of record, Whop, back to your original payment method. Processing times
        depend on your bank or card provider.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about refunds? Email <a href="mailto:support@wylorise.store">support@wylorise.store</a>.
      </p>
    </LegalPage>
  )
}
