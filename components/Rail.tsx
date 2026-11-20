"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

/** Section header (title, subtitle, "View all", arrows) + horizontally scrolling row. */
export default function Rail({
  title, sub, more, variant, children,
}: {
  title: string; sub?: string; more?: { href: string; label?: string };
  variant: "city" | "pkg" | "tile" | "reviews" | "blog"; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9 });

  return (
    <>
      <div className="shead">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        <div className="shead__nav">
          {more && <a className="viewall" href={more.href}>{more.label ?? "View all"}</a>}
          <button className="arrow" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous"><Icon name="chevronLeft" /></button>
          <button className="arrow" onClick={() => go(1)} disabled={edge.end} aria-label="Next"><Icon name="chevronRight" /></button>
        </div>
      </div>
      <div ref={ref} className={`rail rail--${variant}`} onScroll={update}>{children}</div>
    </>
  );
}
