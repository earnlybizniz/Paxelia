/**
 * app/store/privacy/page.tsx
 * User-facing path: /privacy  (middleware rewrites → /store/privacy)
 * All copy is interpolated from lib/policies-config.ts.

 */
import { PolicyLayout } from '@/components/policies/PolicyLayout'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import Link from 'next/link'

export const metadata = {
  title: `Privacy Policy — ${C.brandName}`,
}

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated={C.lastUpdated}>

      <h2>Introduction</h2>
      <p>
        {C.legalEntity} (&ldquo;{C.brandName}&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website
        at <a href={C.siteUrl}>{C.siteUrl}</a>. This Privacy Policy describes how
        we collect, use, disclose, and protect your personal information when you
        visit our website, place an order, or otherwise interact with us.
      </p>
      <p>
        By using our website or purchasing from us, you agree to the collection and
        use of your information in accordance with this policy. We are committed to
        handling your personal information responsibly and in compliance with
        applicable privacy laws.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect personal information that you provide directly when you place an
        order, contact support, or interact with our website. The categories of
        information we may collect include:
      </p>
      <ul>
        {C.dataCollected.map((item, i) => (
          <li key={i}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
        ))}
        <li>IP address and browser or device information (collected automatically)</li>
        <li>Pages visited, time on site, and referral source (collected via analytics tools)</li>
        <li>Cookie identifiers (see Cookies &amp; Tracking below)</li>
      </ul>
      <p>
        We do not collect sensitive personal information such as government
        identification numbers, financial account credentials, or health information.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use the personal information we collect for the following purposes:
      </p>
      <ul>
        <li>To process and fulfill your orders, including shipping and delivery coordination</li>
        <li>To send order confirmations, shipping updates, and customer service communications</li>
        <li>To respond to your inquiries and provide customer support</li>
        <li>To improve our website, products, and services based on usage patterns</li>
        <li>To measure the effectiveness of our advertising and marketing campaigns</li>
        <li>To comply with legal obligations and enforce our policies</li>
        <li>To detect and prevent fraudulent transactions and other illegal activity</li>
      </ul>
      <p>
        We do not sell your personal information to third parties for their own
        marketing purposes.
      </p>

      <h2>Payment Processing</h2>
      <p>
        All payments on the {C.brandName} website are processed by{' '}
        <strong>{C.merchantOfRecord}</strong>, our merchant of record and payment
        processor. When you enter payment information at checkout, that information
        is transmitted directly to {C.paymentProcessors.join(' and ')} via an
        encrypted connection. {C.brandName} does not store, have access to, or
        retain your full payment card details at any point. All payment data is
        handled in accordance with PCI-DSS standards by our payment processor.
      </p>

      <h2>Cookies &amp; Tracking</h2>
      {C.cookiesUsed && (
        <>
          <p>
            Our website uses cookies and similar tracking technologies to operate
            core functionality, understand how visitors use the site, and measure
            advertising performance. A cookie is a small text file placed on your
            device by your browser when you visit a website.
          </p>
          <p>
            We use the following tracking tools:
          </p>
          <ul>
            {C.analyticsTools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>
          <p>
            <strong>Meta Pixel / Conversions API:</strong> We use the Meta Pixel
            (browser-side) and Meta Conversions API (server-side) to measure the
            performance of our advertising on Meta platforms (Facebook, Instagram).
            These tools help us understand which ads led to purchases and optimise
            our campaigns. Event data — such as page views, product views, and
            completed purchases — is shared with Meta using privacy-safe hashed
            identifiers where applicable.
          </p>
          <p>
            You can opt out of Meta&apos;s use of your data for ad targeting by
            visiting{' '}
            <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer">
              Meta&apos;s Privacy Centre
            </a>.
            You may also manage cookie preferences through your browser settings.
          </p>
        </>
      )}

      <h2>Data Sharing &amp; Third Parties</h2>
      <p>
        We share your personal information only with trusted third parties who
        assist us in operating our website and fulfilling orders:
      </p>
      <ul>
        <li><strong>Payment processors:</strong> {C.paymentProcessors.join(', ')} — to process transactions securely</li>
        <li><strong>Shipping carriers:</strong> {C.carrier} — to deliver your order</li>
        <li><strong>Analytics &amp; advertising platforms:</strong> {C.analyticsTools.join(', ')} — to measure marketing performance</li>
        <li><strong>Customer support tools</strong> — to manage and respond to your inquiries</li>
      </ul>
      <p>
        We require all third parties to respect the security of your personal
        information and treat it in accordance with applicable law. We do not permit
        third-party providers to use your data for their own purposes beyond what is
        needed to provide services to us. We may also disclose your information if
        required to do so by law or valid legal process.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your personal information for{' '}
        {C.dataRetentionPeriod}. Order records are kept for a minimum of 7 years to
        comply with applicable tax and accounting regulations. Once information is no
        longer required for these purposes, we will securely delete or anonymise it.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect
        your personal information against unauthorised access, loss, destruction, or
        alteration. Our website uses HTTPS encryption for all data in transit.
        Payment processing is handled entirely by our PCI-DSS compliant processor
        and card data never passes through our servers.
      </p>
      <p>
        No method of transmission over the internet or electronic storage is 100%
        secure. While we take every reasonable precaution, we cannot guarantee
        absolute security.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your
        personal information. To exercise any of these rights, contact us at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>.
      </p>

      {C.ccpaApplies && (
        <>
          <h3>California Residents (CCPA)</h3>
          <p>
            If you are a California resident, the California Consumer Privacy Act
            grants you the following rights with respect to your personal information:
          </p>
          <ul>
            <li><strong>Right to Know:</strong> You may request disclosure of the categories and specific pieces of personal information we have collected about you, the sources of that information, and the purposes for which it is used.</li>
            <li><strong>Right to Delete:</strong> You may request that we delete the personal information we have collected from you, subject to certain legal exceptions.</li>
            <li><strong>Right to Opt-Out of Sale:</strong> {C.brandName} does not sell your personal information to third parties.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
          </ul>
          <p>
            To submit a CCPA request, email us at{' '}
            <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> with the subject
            line &ldquo;CCPA Request&rdquo;. We will respond within 45 days as required by law.
          </p>
        </>
      )}

      {C.gdprApplies && (
        <>
          <h3>European Economic Area Residents (GDPR)</h3>
          <p>
            If you are located in the EEA, you have the following rights under the
            General Data Protection Regulation:
          </p>
          <ul>
            <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data in certain circumstances.</li>
            <li><strong>Right to Restrict Processing:</strong> Request that we limit the processing of your data.</li>
            <li><strong>Right to Data Portability:</strong> Request a machine-readable copy of your data.</li>
            <li><strong>Right to Object:</strong> Object to our processing of your personal data in certain circumstances.</li>
          </ul>
          <p>
            Our lawful basis for processing your personal information is the
            performance of a contract (to fulfill your order) and our legitimate
            interests in operating and improving our business. Contact us at{' '}
            <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> to exercise
            your GDPR rights.
          </p>
        </>
      )}

      <h2>{"Children's"} Privacy</h2>
      <p>
        Our website and products are not directed to children under the age of 13.
        We do not knowingly collect personal information from children under 13.
        If you believe we have inadvertently collected such information, please
        contact us immediately at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> and we will
        promptly delete it.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in
        our practices or applicable law. When we make material changes, we will
        update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you
        to review this policy periodically. Your continued use of our website after
        any changes constitutes your acceptance of the updated policy.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions, concerns, or requests regarding this Privacy Policy
        or our data practices, please contact us:
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a>
        <br />
        <strong>Company:</strong> {C.legalEntity}
        <br />
        <strong>Address:</strong> {C.contactAddress}
      </p>
      <p>
        You can also visit our <Link href="/support">Support page</Link>.
      </p>

    </PolicyLayout>
  )
}