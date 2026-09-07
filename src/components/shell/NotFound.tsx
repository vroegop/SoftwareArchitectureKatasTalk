import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">Page not found</p>
      <h1 className="hero-title">That page is not on the track.</h1>
      <p>
        <Link className="btn btn-primary" to="/">
          Back to the start
        </Link>
      </p>
    </div>
  )
}
