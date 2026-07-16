"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type NavItem = { href: string; label: string; icon: string };

export function StartMenu({
  open,
  onOpenChange,
  nav,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className={`start-button${open ? " open" : ""}`}
        onClick={() => onOpenChange(!open)}
      >
        <span aria-hidden>🪟</span> Start
      </button>
      {open && (
        <div className="start-menu">
          <div className="start-menu-rail">
            <span>Made by HW0D</span>
          </div>
          <div className="start-menu-items">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="start-menu-item"
                onClick={() => onOpenChange(false)}
              >
                <span className="icon" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
