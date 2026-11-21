"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavMenu } from "@/lib/content";
import { short } from "@/lib/names";

/** "Shirdi tour packages from Bangalore" → "Shirdi Tour Packages". */
const placeName = (label: string) => short(label).replace(/tour packages?/i, "Tour Packages");

/** Tabbed list of destinations (same collections as the header dropdowns) and specialty tours. */
export default function Directory({ menu }: { menu: NavMenu }) {
  const tabs = [
    { key: "domestic", label: "Domestic Destinations", links: menu.domestic.filter((l) => l.count > 0).map((l) => ({ href: l.href, label: placeName(l.label) })) },
    { key: "international", label: "International Destinations", links: menu.international.filter((l) => l.count > 0).map((l) => ({ href: l.href, label: placeName(l.label) })) },
    { key: "specialty", label: "Specialty Tours", links: menu.specialty.map((s) => ({ href: `/specialty-packages/${s.slug}`, label: `${s.label.replace(/\s*tours?$/i, "")} Tour Packages` })) },
  ];
  const [active, setActive] = useState(tabs[0].key);

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={active === t.key} className={active === t.key ? "is-active" : ""} onClick={() => setActive(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.key} className={`directory ${active === t.key ? "is-active" : ""}`} role="tabpanel">
          {t.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </div>
      ))}
    </>
  );
}
