/**
 * app/store/terms/page.tsx
 * User-facing path: /terms  (middleware rewrites → /store/terms)
 * All copy is interpolated from lib/policies-config.ts.
 */
import { PolicyLayout } from '@/components/policies/PolicyLayout'
import { POLICY_CONFIG as C } from '@/lib/policies-config'
import Link from 'next/link'

export const metadata = {
  title: `Terms of Service — ${C.brandName}`,
}

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated={C.lastUpdated}>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing or using the website at <a href={C.siteUrl}>{C.siteUrl}</a>{' '}
        (the &ldquo;Site&rdquo;) or purchasing any product from {C.legalEntity}{' '}
        (&ldquo;{C.brandName}&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by
        these Terms of Service (&ldquo;Terms&rdquo;). Please read them carefully before
        using the Site or placing an order.
      </p>
      <p>
        If you do not agree to these Terms, you must not access or use the Site or
        purchase any of our products. We reserve the right to update these Terms at
        any time. Your continued use of the Site following any changes constitutes
        your acceptance of the revised Terms.
      </p>

      <h2>Eligibility</h2>
      <p>
        By using the Site, you represent that you are at least 18 years of age,
        have the legal capacity to enter into a binding contract, and are not barred
        from doing so under the laws of any applicable jurisdiction. If you are
        purchasing on behalf of a business or organisation, you represent that you
        have authority to bind that entity to these Terms.
      </p>

      <h2>Products &amp; Pricing</h2>
      <p>
        {C.brandName} sells premium {C.productType} through the Site. All products
        are subject to availability. We reserve the right to discontinue any product
        at any time without notice.
      </p>
      <p>
        Prices are displayed in US dollars and are subject to change without notice.
        We make every effort to display accurate pricing, but in the event of a
        pricing error we reserve the right to cancel the affected order and issue a
        full refund. We will notify you promptly if this occurs.
      </p>
      <p>
        Product images, descriptions, and specifications are provided for
        informational purposes and may vary slightly from the physical product. We
        strive for accuracy but do not warrant that all product descriptions are
        entirely error-free.
      </p>

      <h2>Orders &amp; Payment</h2>
      <p>
        When you place an order on the Site, you are making an offer to purchase the
        selected product(s) at the stated price. Your order is not confirmed until
        you receive an order confirmation email from us.
      </p>
      <p>
        All payments are processed by <strong>{C.merchantOfRecord}</strong>, our
        merchant of record. By placing an order, you authorise {C.merchantOfRecord}{' '}
        to charge your payment method for the full amount of your order, including
        any applicable taxes. {C.brandName} does not store or have access to your
        full payment card details.
      </p>
      <p>
        We reserve the right to refuse or cancel any order at our discretion,
        including orders that appear fraudulent, involve a pricing or product
        information error, or where payment cannot be verified. If your order is
        cancelled after payment has been taken, we will issue a full refund.
      </p>

      <h2>Shipping &amp; Returns</h2>
      <p>
        Shipping and delivery are governed by our{' '}
        <Link href="/shipping">Shipping Policy</Link>. Returns and refunds are
        governed by our <Link href="/refund">Refund &amp; Returns Policy</Link>.
        Both policies are incorporated into these Terms by reference. By placing an
        order, you agree to the terms set out in those policies.
      </p>

      <h2>Warranty</h2>
      <p>
        {C.brandName} products are covered by a{' '}
        <strong>{C.warrantyYears}-year limited warranty</strong> against
        manufacturing defects in materials and workmanship, commencing from the
        date of delivery to the original purchaser.
      </p>
      <p>
        This warranty covers defects arising under normal use and does not cover:
      </p>
      <ul>
        <li>Damage caused by improper assembly or use outside of provided instructions</li>
        <li>Misuse, abuse, or negligence</li>
        <li>Normal wear and tear</li>
        <li>Unauthorised modifications or repairs performed by a third party</li>
        <li>Accidental damage, including damage caused by liquids</li>
        <li>Damage resulting from commercial use beyond intended residential or office use</li>
      </ul>
      <p>
        To make a warranty claim, contact us at{' '}
        <a href={`mailto:${C.supportEmail}`}>{C.supportEmail}</a> with your order
        number, a description of the defect, and supporting photographs. This
        warranty is non-transferable and applies to the original purchaser only.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on the Site — including text, graphics, photographs, logos,
        product designs, user interfaces, and software — is the property of{' '}
        {C.legalEntity} or its licensors and is protected by applicable intellectual
        property laws. You may not reproduce, distribute, modify, create derivative
        works of, publicly display, republish, download, store, or transmit any
        content from the Site without our prior written consent, except that you may
        download or print content solely for your own personal, non-commercial use.
      </p>

      <h2>Prohibited Uses</h2>
      <p>
        You agree not to use the Site for any purpose that is unlawful, harmful, or
        prohibited by these Terms. Prohibited uses include, without limitation:
      </p>
      <ul>
        <li>Violating any applicable law or regulation</li>
        <li>Transmitting unsolicited commercial communications (spam)</li>
        <li>Attempting to gain unauthorised access to any portion of the Site or its related systems</li>
        <li>Interfering with or disrupting the integrity or performance of the Site</li>
        <li>Collecting or harvesting information from the Site without authorisation</li>
        <li>Using the Site to impersonate any person or entity</li>
        <li>Engaging in any conduct that could damage, disable, or impair the Site or servers</li>
      </ul>

      <h2>Disclaimer of Warranties</h2>
      <p>
        THE SITE AND ITS CONTENT ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
        BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
        BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, OR NON-INFRINGEMENT. {C.brandName.toUpperCase()} DOES
        NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED OR ERROR-FREE. THE ABOVE
        EXCLUSIONS MAY NOT APPLY TO YOU TO THE EXTENT PROHIBITED UNDER APPLICABLE LAW.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,{' '}
        {C.brandName.toUpperCase()}, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS
        SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
        PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE,
        GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH
        YOUR USE OF THE SITE OR PURCHASE OF OUR PRODUCTS.
      </p>
      <p>
        IN NO EVENT SHALL {C.brandName.toUpperCase()}&apos;S TOTAL LIABILITY TO YOU
        FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS EXCEED THE GREATER
        OF (A) THE AMOUNT PAID BY YOU FOR THE SPECIFIC PRODUCT GIVING RISE TO THE
        CLAIM, OR (B) ONE HUNDRED US DOLLARS ($100).
      </p>

      <h2>Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless {C.legalEntity}, its
        officers, directors, employees, contractors, licensors, and agents from and
        against any claims, damages, obligations, losses, liabilities, costs, and
        expenses (including reasonable attorneys&apos; fees) arising from: (a) your use
        of the Site; (b) your violation of these Terms; (c) your violation of any
        third-party right, including any intellectual property or privacy right; or
        (d) any claim that your use of the Site caused damage to a third party.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws
        of the <strong>{C.governingLawRegion}</strong>, without regard to its
        conflict of law provisions. Any dispute arising out of or relating to these
        Terms or your use of the Site shall be resolved exclusively in the courts
        located in the {C.governingLawRegion}. You consent to the personal
        jurisdiction of such courts.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. When we make
        material changes, we will update the &ldquo;Last updated&rdquo; date at the top of
        this page. Your continued use of the Site after any changes constitutes your
        acceptance of the updated Terms. If you do not agree to the revised Terms,
        you must stop using the Site.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us:
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