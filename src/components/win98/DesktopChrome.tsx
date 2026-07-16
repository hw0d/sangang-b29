"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { StartMenu, type NavItem } from "./StartMenu";
import { TaskbarClock } from "./TaskbarClock";

const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/groups", label: "Groups", icon: "🗂️" },
  { href: "/profiles", label: "Profiles", icon: "🪪" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/admin", label: "Admin", icon: "🔒" },
];

function pageInfo(pathname: string): { title: string; icon: string } {
  if (pathname.startsWith("/admin")) {
    return { title: "Admin — SANGANG Records", icon: "🔒" };
  }
  if (pathname.startsWith("/groups")) {
    return { title: "Groups — SANGANG Records", icon: "🗂️" };
  }
  if (pathname.startsWith("/profiles")) {
    return { title: "Profiles — SANGANG Records", icon: "🪪" };
  }
  if (pathname.startsWith("/search")) {
    return { title: "Search — SANGANG Records", icon: "🔍" };
  }
  return { title: "SANGANG Records System", icon: "🏠" };
}

export function DesktopChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { title, icon } = pageInfo(pathname);

  return (
    <>
      <div className="desktop">
        <div className="window main-window">
          <div className="title-bar">
            <div className="title-bar-text">
              {icon} {title}
            </div>
            <div className="title-bar-controls">
              <button aria-label="Minimize" type="button" />
              <button aria-label="Maximize" type="button" />
              <button aria-label="Close" type="button" />
            </div>
          </div>
          <div className="window-body">
            <div className="window-toolbar">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`toolbar-btn${active ? " active" : ""}`}
                  >
                    <span aria-hidden>{item.icon}</span> {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="sunken-panel content-area">{children}</div>

            <div className="status-bar">
              <p className="status-bar-field">
                Fictional roleplay database — not a real law-enforcement
                system
              </p>
              <p className="status-bar-field">SANGANG Records System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="taskbar">
        <StartMenu open={menuOpen} onOpenChange={setMenuOpen} nav={NAV} />
        <div className="taskbar-divider" />
        <div className="taskbar-app">
          <span aria-hidden>{icon}</span>
          <span className="taskbar-app-label">{title}</span>
        </div>
        <TaskbarClock />
      </div>
    </>
  );
}
