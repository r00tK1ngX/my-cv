import "@/styles/globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { siteIcons } from "@/lib/metadata";
export const metadata: Metadata = {
  title: "Page not found · Châu Anh Dũng",
  robots: { index: false, follow: false },
  icons: siteIcons,
};
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="not-found">
          <span className="eyebrow">Page not found</span>
          <h1>404</h1>
          <p>The page you requested isn’t available.</p>
          <Link className="button" href="/">
            Return home
          </Link>
        </main>
      </body>
    </html>
  );
}
