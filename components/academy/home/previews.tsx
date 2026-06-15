// components/academy/home/previews.tsx
import { Bell, ListChecks, MessageSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"

/* A stylized mock of the private Telegram community — built in CSS, no images. */
export function CommunityPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-[var(--omni-line)] bg-white shadow-[0_30px_60px_-25px_rgba(11,14,26,0.35)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--omni-line)] bg-[var(--omni-surface)] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-neutral-300" />
        <span className="h-3 w-3 rounded-full bg-neutral-300" />
        <span className="h-3 w-3 rounded-full bg-neutral-300" />
        <span className="ml-3 font-mono text-xs font-medium text-[var(--omni-ink-soft)]">
          Mastering Google Ads · Community
        </span>
      </div>
      <div className="grid grid-cols-[1fr] sm:grid-cols-[164px_1fr]">
        <div className="hidden flex-col gap-1 border-r border-[var(--omni-line)] p-3 sm:flex">
          {["📌 Start Here", "🗓️ This Week's Loop", "🛡️ Policy & Approvals", "🎯 Search Ads", "📚 Template Vault", "🏆 Wins"].map(
            (c, i) => (
              <span
                key={c}
                className={cn(
                  "truncate rounded-lg px-2.5 py-1.5 text-xs font-medium",
                  i === 1 ? "bg-[var(--omni-brand-soft)] text-[var(--omni-brand)]" : "text-[var(--omni-ink-soft)]",
                )}
              >
                {c}
              </span>
            ),
          )}
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200/70 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            <Bell className="h-3.5 w-3.5 shrink-0" /> Google updated a Merchant Center policy — here&apos;s what to check.
          </div>
          <div className="rounded-xl border border-[var(--omni-line)] bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--omni-ink)]">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--omni-brand)] text-white">
                <ListChecks className="h-3.5 w-3.5" />
              </span>
              This week&apos;s action
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--omni-ink-soft)]">
              Confirm your main conversion actually fires, then pull 7 days of search terms and add negatives for
              anything irrelevant. Reply with what you cut.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--omni-ink-soft)]">
            <MessageSquare className="h-3.5 w-3.5 text-[var(--omni-brand)]" /> 12 replies · office hours this week
          </div>
        </div>
      </div>
    </div>
  )
}

/* A stylized mock of the ebook cover. */
export function BookPreview({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-l-sm rounded-r-lg border border-[var(--omni-line)] bg-[linear-gradient(160deg,#0b1230,#0057e7)] p-6 text-white shadow-[0_30px_60px_-25px_rgba(11,14,26,0.6)]">
        <div className="absolute left-0 top-0 h-full w-2 bg-black/30" />
        <div className="flex h-full flex-col">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
            The ebook
          </span>
          <h3 className="mt-auto font-display text-3xl font-extrabold leading-tight">Mastering Google Ads</h3>
          <p className="mt-2 text-xs text-white/65">Setup · approval · feeds · search · optimization</p>
          <div className="mt-4 h-px w-12 bg-[var(--omni-pop)]" />
        </div>
        <Search className="absolute right-4 top-4 h-4 w-4 text-white/70" aria-hidden />
      </div>
    </div>
  )
}

/* The ebook video — same frame/size as BookPreview, plays like a GIF (muted, looping, autoplay, no controls).
   NOTE: still points at /videos/book-video.mp4. Used by the field-guide page. */
export function BookVideo({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[280px]", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-l-sm rounded-r-lg border border-[var(--omni-line)] bg-[linear-gradient(160deg,#0b1230,#0057e7)] shadow-[0_30px_60px_-25px_rgba(11,14,26,0.6)]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/book-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
        />
      </div>
    </div>
  )
}

/* The community video — same w-full frame/size as CommunityPreview, plays like a GIF.
   NOTE: still points at /videos/discord-video.mp4. Used by the community page. */
export function CommunityVideo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-[var(--omni-line)] bg-white shadow-[0_30px_60px_-25px_rgba(11,14,26,0.35)]",
        className,
      )}
    >
      <video
        className="block h-auto w-full"
        src="/videos/discord-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      />
    </div>
  )
}
