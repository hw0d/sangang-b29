import type { Metadata } from "next";
import { DesktopChrome } from "@/components/win98/DesktopChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "LSSCPATF Records System",
  description:
    "Los Santos STEP and Criminal Profiteering Act Task Force — gang and organized crime records system.",
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
