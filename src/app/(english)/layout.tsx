import "@/styles/globals.css";
import "@/styles/cyber-cursor.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { siteIcons } from "@/lib/metadata";
export const viewport: Viewport = { themeColor: "#040810" };
export const metadata: Metadata = { icons: siteIcons };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
