"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { CardPkg, Destination } from "@/lib/content";
import { PackageCard } from "./Cards";

const durations = [
  { v: "", label: "Any Duration" },
  { v: "1-3", label: "1-3 Days" },
  { v: "4-7", label: "4-7 Days" },
  { v: "8-15", label: "8-15 Days" },
  { v: "15+", label: "15+ Days" },
];
const sorts = [
  { v: "newest", label: "Newest First" },
  { v: "price_low", label: "Price: Low to High" },
  { v: "price_high", label: "Price: High to Low" },
  { v: "duration", label: "Duration" },
];

function inDuration(days: number, v: string) {
  if (!v) return true;
  if (v === "15+") return days >= 15;
  const [a, b] = v.split("-").map(Number);
  return days >= a && days <= b;
}

/** Filter sidebar + grid, using the same filters as the live /packages page. */
export default function PackageExplorer({ items, destinations }: { items: CardPkg[]; destinations: Destination[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [dest, setDest] = useState(params.get("destination") ?? "");
  const [dur, setDur] = useState(params.get("duration") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "newest");

  const destOptions = destinations.filter((d) => items.some((p) => p.destinationSlug === d.slug));

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = items.filter((p) =>
      (!dest || p.destinationSlug === dest) &&
      inDuration(p.days, dur) &&
      (!needle || `${p.title} ${p.destination} ${p.label}`.toLowerCase().includes(needle)));
    if (sort === "price_low") out.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price_high") out.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "duration") out.sort((a, b) => a.days - b.days);
    return out;
  }, [items, q, dest, dur, sort]);

  const reset = () => { setQ(""); setDest(""); setDur(""); setSort("newest"); };

  return (
    <div className="explorer">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="field">
          <label htmlFor="f-q">Search</label>
          <input id="f-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search packages, destinations..." />
        </div>
        <div className="field">
          <label htmlFor="f-d">Destination</label>
          <select id="f-d" value={dest} onChange={(e) => setDest(e.target.value)}>
            <option value="">All Destinations</option>
            {destOptions.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-u">Duration</label>
          <select id="f-u" value={dur} onChange={(e) => setDur(e.target.value)}>
            {durations.map((d) => <option key={d.v} value={d.v}>{d.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-s">Sort By</label>
          <select id="f-s" value={sort} onChange={(e) => setSort(e.target.value)}>
            {sorts.map((d) => <option key={d.v} value={d.v}>{d.label}</option>)}
          </select>
        </div>
        <button className="btn btn--line btn--block" onClick={reset}>Reset</button>
      </aside>
      <div>
        {list.length !== items.length && <p className="explorer__count">{list.length} of {items.length} packages</p>}
        {list.length ? (
          <div className="grid grid--pkg">{list.map((p) => <PackageCard key={p.slug} p={p} />)}</div>
        ) : (
          <div className="empty">No packages match these filters. <button className="viewall" onClick={reset}>Reset</button></div>
        )}
      </div>
    </div>
  );
}
