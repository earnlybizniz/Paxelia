// app/edu/terms/page.tsx
import type { Metadata } from "next"
import { LegalPage } from "@/components/academy/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the Wylorise membership.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 14, 2026">
      <h2>1. Agreement to these terms</h2>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Wylorise (the &quot;Service&quot;),
        operated by Wylorise (&quot;we,&quot; &quot;us&quot;), located at 5742 Satterfield Drive, Macon, GA 31206, USA.
        By creating an account, purchasing a membership, or using the Service, you agree to these Terms. If you do not
        agree, do not use the Service.
      </p>

      <h2>2. What Wylorise is</h2>
      <p>
        Wylorise is an educational membership for advertisers. It includes the digital ebook &quot;Mastering Google
        Ads&quot; and access to our private online community. Every membership includes the same full access — there are
        no tiers or locked content.
      </p>

      <h2>3. Eligibility</h2>
      <p>You must be at least 18 years old and able to form a binding contract to use the Service.</p>

      <h2>4. Membership, billing, and renewals</h2>
      <p>
        Memberships are sold as recurring subscriptions with a billing period you choose at checkout (every 30, 60, or
        90 days). Your membership automatically renews at the end of each period at the then-current price until you
        cancel. You can cancel at any time and will keep access through the end of the period you have already paid for.
        Payments are processed by our merchant of record, Whop; your statement will show &quot;WYLORISE.&quot;
      </p>

      <h2>5. Refunds</h2>
      <p>
        We offer a 30-day money-back guarantee on your first payment, as described in our <a href="/refund">Refund
        Policy</a>. Renewal payments are non-refundable.
      </p>

      <h2>6. License and intellectual property</h2>
      <p>
        Your access to the ebook and community materials is governed by our <a href="/eula">End-User License
        Agreement</a>. All content remains the property of Wylorise or its licensors.
      </p>

      <h2>7. Community conduct</h2>
      <p>
        You agree to participate respectfully and not to post unlawful, harmful, or infringing content, make income or
        earnings claims, share your access with others, or disrupt the community. We may remove content or suspend
        access for violations.
      </p>

      <h2>8. Educational purpose; no guarantees</h2>
      <p>
        Wylorise is provided for educational purposes only. We do not provide financial, legal, or professional advice,
        and we make no guarantee of any particular result, income, or outcome. Your results depend on factors outside
        our control, including your product, offer, budget, market, and execution.
      </p>

      <h2>9. Not affiliated with Google</h2>
      <p>
        Wylorise is independent and is not affiliated with, endorsed by, or sponsored by Google LLC. &quot;Google&quot;
        and &quot;Google Ads&quot; are trademarks of Google LLC, used here only to describe the subject of our
        educational materials.
      </p>

      <h2>10. Third-party services</h2>
      <p>
        The Service relies on third parties including Whop (payments and access) and Telegram (community). Your use of
        those services is subject to their own terms.
      </p>

      <h2>11. Disclaimers and limitation of liability</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by
        law, Wylorise will not be liable for any indirect, incidental, or consequential damages, and our total
        liability will not exceed the amount you paid us in the 90 days before the claim.
      </p>

      <h2>12. Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate access if you breach these Terms.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be reflected by the &quot;last updated&quot;
        date, and continued use after changes means you accept them.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Georgia, USA, without regard to its conflict-of-law rules.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms? Email <a href="mailto:support@wylorise.store">support@wylorise.store</a>, or write
        to Wylorise, 5742 Satterfield Drive, Macon, GA 31206, USA.
      </p>
    </LegalPage>
  )
}
