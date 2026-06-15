// app/edu/eula/page.tsx
import type { Metadata } from "next"
import { LegalPage } from "@/components/academy/legal-page"

export const metadata: Metadata = {
  title: "End-User License Agreement",
  description: "The license terms for the Wylorise ebook and community materials.",
  alternates: { canonical: "/eula" },
}

export default function EulaPage() {
  return (
    <LegalPage title="End-User License Agreement" updated="June 14, 2026">
      <h2>1. License</h2>
      <p>
        Subject to these terms and your active membership, Wylorise grants you a personal, limited, non-exclusive,
        non-transferable, revocable license to access and use the ebook &quot;Mastering Google Ads&quot; and the
        community materials for your own learning.
      </p>

      <h2>2. Restrictions</h2>
      <p>You may not:</p>
      <ul>
        <li>Copy, redistribute, resell, sublicense, or publicly share the materials.</li>
        <li>Create derivative works from the materials or use them to build a competing product.</li>
        <li>Share your account or access credentials with anyone else.</li>
      </ul>
      <p>The materials are for your individual use only.</p>

      <h2>3. Ownership</h2>
      <p>
        The ebook, community content, and all related intellectual property remain the property of Wylorise or its
        licensors. No ownership is transferred to you.
      </p>

      <h2>4. Community content</h2>
      <p>
        Content shared within the community is provided for members&apos; educational use and may not be redistributed
        outside the community.
      </p>

      <h2>5. Term and termination</h2>
      <p>
        This license lasts for the duration of your active membership. It ends automatically if your membership ends or
        if you breach these terms, at which point you must stop using the materials.
      </p>

      <h2>6. Educational purpose; no guarantees</h2>
      <p>
        The materials are educational and provided &quot;as is.&quot; Wylorise makes no guarantee of any particular
        result or income, and is independent and not affiliated with, endorsed by, or sponsored by Google LLC.
      </p>

      <h2>7. Governing law</h2>
      <p>This Agreement is governed by the laws of the State of Georgia, USA.</p>

      <h2>8. Contact</h2>
      <p>
        Questions about this license? Email <a href="mailto:support@wylorise.store">support@wylorise.store</a>.
      </p>
    </LegalPage>
  )
}
