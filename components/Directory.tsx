"use client";

import Link from "next/link";
import { useState } from "react";
import type { Destination } from "@/lib/content";

/** Tabbed list of every destination, split the way the live site splits them. */
export default function Directory({ destinations }: { destinations: Destination[] }) {
  const groups = ["Domestic", "International"] as const;
  const [active, setActive] = useState<(typeof groups)[number]>("Domestic");

  return (
    <>
      <div className="tabs" role="tablist">
        {groups.map((g) => (
          <button key={g} role="tab" aria-selected={active === g} className={active === g ? "is-active" : ""} onClick={() => setActive(g)}>
            {g} Destinations
          </button>
        ))}
      </div>
      {groups.map((g) => (
        <div key={g} className={`directory ${active === g ? "is-active" : ""}`} role="tabpanel">
          {destinations.filter((d) => d.region === g).map((d) => (
            <Link key={d.slug} href={`/destinations/${d.slug}`}>{d.name}</Link>
          ))}
        </div>
      ))}
    </>
  );
}
