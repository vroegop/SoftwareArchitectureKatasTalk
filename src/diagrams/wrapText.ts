/** Greedy word wrap for SVG text; long words are hard-broken. */
export function wrapText(text: string, maxChars: number, maxLines = 3): string[] {
  const limit = Math.max(4, maxChars)
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= limit) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    if (word.length > limit) {
      let rest = word
      while (rest.length > limit) {
        lines.push(`${rest.slice(0, limit - 1)}-`)
        rest = rest.slice(limit - 1)
      }
      current = rest
    } else {
      current = word
    }
  }
  if (current) lines.push(current)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    const last = kept[maxLines - 1]
    kept[maxLines - 1] = `${last.slice(0, Math.max(1, limit - 1))}…`
    return kept
  }
  return lines
}

/** Rough text width in diagram units for a given font size (system sans). */
export function estimateWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56
}
