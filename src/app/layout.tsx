import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground bg-scanlines">
        <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-20">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-baseline gap-2 shrink-0">
              <span className="font-record text-xl tracking-widest text-accent">
                SAN<span className="text-foreground">GANG</span>
              </span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-muted">
                Records System
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-record">
              <Link
                href="/groups"
                className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
              >
                Groups
              </Link>
              <Link
                href="/profiles"
                className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
              >
                Profiles
              </Link>
              <Link
                href="/search"
                className="px-3 py-1.5 rounded hover:bg-surface-raised transition-colors"
              >
                Search
              </Link>
              <Link
                href="/admin"
                className="ml-2 px-3 py-1.5 rounded border border-border hover:border-accent hover:text-accent transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
          <div className="bg-accent/10 border-t border-accent/20 text-center text-[11px] uppercase tracking-wide text-accent/90 py-1 px-4">
            Fictional roleplay database — all persons &amp; groups are
            fictional characters, not real people
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-border mt-12">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted space-y-1">
            <p>
              SANGANG is a fictional records system built for roleplay /
              creative use. It does not depict real individuals, gangs, or
              organized crime groups, and is not affiliated with any law
              enforcement agency or real-world database.
            </p>
            <p>&copy; {new Date().getFullYear()} SANGANG Records System.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
