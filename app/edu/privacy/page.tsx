// app/edu/privacy/page.tsx
import type { Metadata } from "next"
import { LegalPage } from "@/components/academy/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Wylorise collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 14, 2026">
      <h2>1. Overview</h2>
      <p>
        This Privacy Policy explains what information Wylorise (&quot;we,&quot; &quot;us&quot;) collects, how we use it,
        and the choices you have. By using Wylorise, you agree to this policy.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        <strong>Information you provide:</strong> your name, email address, billing and contact details, and the
        optional information you share at checkout, such as your experience and your goals.
      </p>
      <p>
        <strong>Information collected automatically:</strong> basic usage, device, and analytics data, including through
        cookies. <strong>Payment information</strong> is collected and processed by our merchant of record, Whop — we do
        not receive or store your full card details.
      </p>

      <h2>3. How we use your information</h2>
      <p>
        We use your information to provide and improve the Service, set up and manage your membership and community
        access, communicate with you (including support and renewal reminders), and keep the Service secure.
      </p>

      <h2>4. How we share information</h2>
      <p>
        We share information with service providers who help us operate, including Whop (payments and access), Telegram
        (community), our email provider, and analytics tools. We do not sell your personal information. We may disclose
        information where required by law.
      </p>

      <h2>5. Cookies and analytics</h2>
      <p>
        We use cookies and similar technologies to run the site and understand usage. You can control cookies through
        your browser settings.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We keep your information for as long as needed to provide the Service and for legitimate business or legal
        purposes, after which we delete or anonymize it.
      </p>

      <h2>7. Your choices and rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal information, and you can opt out of
        marketing emails at any time. To make a request, email us.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable measures to protect your information, though no method of transmission or storage is
        completely secure.
      </p>

      <h2>9. Children</h2>
      <p>Wylorise is not directed to anyone under 18, and we do not knowingly collect information from children.</p>

      <h2>10. Changes</h2>
      <p>We may update this policy; the &quot;last updated&quot; date above reflects the latest version.</p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions? Email <a href="mailto:support@wylorise.store">support@wylorise.store</a>, or write to
        Wylorise, 5742 Satterfield Drive, Macon, GA 31206, USA.
      </p>
    </LegalPage>
  )
}
