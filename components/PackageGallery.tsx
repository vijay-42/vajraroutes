"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "./Icon";

/** Rayna-style photo grid (1 large + up to 4 small) with a full-screen viewer. */
export default function PackageGallery({ images, title, off }: { images: string[]; title: string; off: number | null }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % n);
      if (e.key === "ArrowLeft") setOpen((i) => ((i ?? 0) - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, n]);

  if (!n) return null;
  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className={`pgal pgal--${Math.min(n, 5)}`}>
        <button className="pgal__main" onClick={() => setOpen(0)} aria-label="View photos">
          <Image src={images[0]} alt={title} fill priority sizes="(max-width: 900px) 100vw, 760px" />
          {off ? <span className="badge badge--save">{off}% OFF</span> : null}
        </button>
        {thumbs.map((src, i) => (
          <button key={src} className="pgal__thumb" onClick={() => setOpen(i + 1)} aria-label={`View photo ${i + 2}`}>
            <Image src={src} alt="" fill sizes="300px" />
            {i === thumbs.length - 1 && <span className="pgal__count"><Icon name="camera" /> {n} Photos</span>}
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photos">
          <button className="lightbox__close" onClick={() => setOpen(null)} aria-label="Close"><Icon name="close" /></button>
          <button className="lightbox__nav lightbox__nav--prev" onClick={() => setOpen((open - 1 + n) % n)} aria-label="Previous"><Icon name="chevronLeft" /></button>
          <div className="lightbox__img"><Image src={images[open]} alt={title} fill sizes="100vw" /></div>
          <button className="lightbox__nav lightbox__nav--next" onClick={() => setOpen((open + 1) % n)} aria-label="Next"><Icon name="chevronRight" /></button>
          <span className="lightbox__count">{open + 1} / {n}</span>
        </div>
      )}
    </>
  );
}
