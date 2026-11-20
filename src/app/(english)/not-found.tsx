import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found">
      <span className="eyebrow">Page not found</span>
      <h1>404</h1>
      <p>The page you requested isn’t available.</p>
      <Link className="button" href="/">
        Return home
      </Link>
    </div>
  );
}
