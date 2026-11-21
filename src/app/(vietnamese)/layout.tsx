import "@/styles/globals.css";
import "@/styles/cyber-cursor.css";
import "@/styles/boot-preloader.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { bootCriticalCss, bootInitScript, siteIcons } from "@/lib/metadata";
export const viewport: Viewport = { themeColor: "#040810" };
export const metadata: Metadata = { icons: siteIcons };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: bootCriticalCss }} />
        <script dangerouslySetInnerHTML={{ __html: bootInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
