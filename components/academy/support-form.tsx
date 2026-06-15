// components/academy/support-form.tsx
"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/academy/ui/button"

export function SupportForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const subject = `Support request${name ? ` from ${name}` : ""}`
  const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`
  const href = `mailto:support@wylorise.store?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const inputClass =
    "w-full rounded-xl border border-[var(--omni-line)] bg-white px-4 py-2.5 text-sm text-[var(--omni-ink)] outline-none transition-colors placeholder:text-[var(--omni-ink-soft)]/70 focus:border-[var(--omni-brand)]/60 focus:ring-2 focus:ring-[var(--omni-brand)]/25"

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <textarea
        className={`${inputClass} min-h-[120px] resize-y`}
        placeholder="How can we help?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
        <a href={href}>
          <Mail className="h-4 w-4" /> Email us
        </a>
      </Button>
      <p className="text-xs text-[var(--omni-ink-soft)]">
        This opens your email app with the message ready to send to support@wylorise.store.
      </p>
    </div>
  )
}
