import { QRCodeSVG } from 'qrcode.react'
import { liveUrl } from '../../app/liveUrl'

export function QrCode({ url, size = 168, caption }: { url?: string; size?: number; caption?: string }) {
  const value = url ?? liveUrl()
  return (
    <figure className="qr">
      <div className="qr-card">
        <QRCodeSVG value={value} size={size} level="M" marginSize={2} bgColor="#ffffff" fgColor="#000000" />
      </div>
      <figcaption className="qr-caption">
        {caption ? <span>{caption}</span> : null}
        <span className="mono small">{value.replace(/^https?:\/\//, '')}</span>
      </figcaption>
    </figure>
  )
}
