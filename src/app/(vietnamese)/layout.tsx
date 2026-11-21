import "@/styles/globals.css";
import type { ReactNode } from "react";
import type { Viewport } from "next";
export const viewport: Viewport = { themeColor: "#040810" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
