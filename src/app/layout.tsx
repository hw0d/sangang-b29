import type { Metadata } from "next";
import { DesktopChrome } from "@/components/win98/DesktopChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANGANG Records System",
  description:
    "SANGANG — a fictional roleplay gang & organized-crime records database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DesktopChrome>{children}</DesktopChrome>
      </body>
    </html>
  );
}
