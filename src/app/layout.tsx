import type { Metadata } from "next";
import { DesktopChrome } from "@/components/win98/DesktopChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "C.R.E.S.T. Records System",
  description:
    "Criminal Racketeering Enforcement and STEP Task Force - gang and organized crime records system.",
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
