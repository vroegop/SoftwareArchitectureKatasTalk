import { site } from '../content/site'

/**
 * The QR code always points at the published site, even when the deck is
 * served from a laptop at the venue: phones must reach the public copy.
 */
export function liveUrl(): string {
  return site.canonicalUrl
}
