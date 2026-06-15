'use client'

/**
 * components/shell/ThemeStyle.tsx
 * Injects palette + font CSS vars from HOME.brand onto :root.
 * A new brand = new HOME object → whole page re-skins with no layout edits.
 */
import { useHome } from '@/contexts/home-context'

export function ThemeStyle() {
  const { brand } = useHome()
  const { palette: p } = brand

  const css = `
    :root {
      --paper:       ${p.paper};
      --paper2:      ${p.paper2};
      --paper3:      ${p.paper3};
      --ink:         ${p.ink};
      --ink-soft:    ${p.inkSoft};
      --ink-mute:    ${p.inkMute};
      --accent:      ${p.accent};
      --accent-deep: ${p.accentDeep};
      --highlight:   ${p.highlight};
    }
  `

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
