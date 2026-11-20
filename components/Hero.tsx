"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/content";
import Icon from "./Icon";

/** Full-width carousel of rounded banners with the neighbouring slides peeking in. */
export default function Hero({ slides }: { slides: Banner[] }) {
  const [active, setActive] = useState(0);
  const n = slides.length;

  useEffect(() => {
    const t = setTimeout(() => setActive((i) => (i + 1) % n), 6000);
    return () => clearTimeout(t);
  }, [active, n]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured journeys">
      <div className="hero__track" style={{ transform: `translateX(calc(${-active} * (var(--card) + var(--gap))))` }}>
        {slides.map((s, i) => (
          <div key={s.image} className="slide" aria-hidden={i !== active}>
            <Image src={s.image} alt={s.title} fill priority={i === 0} sizes="(max-width: 900px) 100vw, 1200px" />
            <div className="slide__body">
              <h2 className="slide__kicker">{s.title}</h2>
              <p className="slide__caption">{s.tag}</p>
              <div className="slide__btns">
                {s.buttons.map((b, j) => (
                  <Link key={b.label} className={`btn ${j === 0 ? "btn--white" : "btn--ghost"}`} href={b.href} tabIndex={i === active ? 0 : -1}>{b.label}</Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="hero__arrow hero__arrow--prev" onClick={() => setActive((active - 1 + n) % n)} aria-label="Previous slide"><Icon name="chevronLeft" /></button>
      <button className="hero__arrow hero__arrow--next" onClick={() => setActive((active + 1) % n)} aria-label="Next slide"><Icon name="chevronRight" /></button>
      <div className="hero__dots">
        {slides.map((s, i) => (
          <button key={s.image} className={i === active ? "is-active" : ""} onClick={() => setActive(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
