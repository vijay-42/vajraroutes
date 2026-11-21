"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Banner } from "@/lib/content";
import Icon from "./Icon";

const AUTOPLAY_MS = 6000;

/**
 * Full-width carousel of rounded banners with the neighbouring slides peeking in.
 * - Loops seamlessly (a clone sits at each end, so last → first never rewinds).
 * - Swipe / drag with the finger or mouse; vertical page scrolling still works.
 * - Autoplay pauses on hover, focus, drag, hidden tab, or when scrolled out of view,
 *   and the active dot shows the time left. Off for prefers-reduced-motion.
 * - Click a peeking slide to bring it forward; ← → keys work when focused inside.
 */
export default function Hero({ slides }: { slides: Banner[] }) {
  const n = slides.length;
  const loop = n > 1;
  // Extended list: [last, ...slides, first]; `pos` indexes into it, real slides are 1..n.
  const items = loop ? [slides[n - 1], ...slides, slides[0]] : slides;
  const realOf = (p: number) => (loop ? (p - 1 + n) % n : p);

  const [pos, setPos] = useState(loop ? 1 : 0);
  const [anim, setAnim] = useState(true);
  const [drag, setDrag] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ptr = useRef<{ id: number; x: number; y: number; t: number; dragging: boolean; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const active = realOf(pos);
  const settling = loop && (pos === 0 || pos === n + 1);  // sitting on a clone, about to jump

  const go = useCallback((p: number) => {
    if (!loop) return;
    setAnim(true);
    setPos(Math.max(0, Math.min(n + 1, p)));
  }, [loop, n]);
  const next = useCallback(() => { setAnim(true); setPos((cur) => (loop && cur < n + 1 ? cur + 1 : cur)); }, [loop, n]);
  const prev = useCallback(() => { setAnim(true); setPos((cur) => (loop && cur > 0 ? cur - 1 : cur)); }, [loop]);

  // After landing on a clone, jump (without animation) to the real slide it mirrors.
  function onTransitionEnd(e: React.TransitionEvent) {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (pos === 0 || pos === n + 1) {
      setAnim(false);
      setPos(pos === 0 ? n : 1);
    }
  }
  useEffect(() => {
    if (anim) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    return () => cancelAnimationFrame(r);
  }, [anim]);
  // Safety net in case transitionend never fires (e.g. tab switched mid-slide).
  useEffect(() => {
    if (!settling) return;
    const t = setTimeout(() => { setAnim(false); setPos((p) => (p === 0 ? n : p === n + 1 ? 1 : p)); }, 900);
    return () => clearTimeout(t);
  }, [settling, n]);

  // Pause conditions: tab hidden / carousel off screen.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.25 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => { document.removeEventListener("visibilitychange", onVis); io.disconnect(); };
  }, []);

  const paused = hover || focus || drag !== 0 || hidden || offscreen;

  // ---- Swipe / drag ----
  function onPointerDown(e: React.PointerEvent) {
    if (!loop || (e.pointerType === "mouse" && e.button !== 0)) return;
    ptr.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), dragging: false, moved: false };
  }
  function onPointerMove(e: React.PointerEvent) {
    const p = ptr.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (!p.dragging) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { ptr.current = null; return; } // vertical scroll wins
      if (Math.abs(dx) < 8) return;
      p.dragging = true;
      trackRef.current?.setPointerCapture(e.pointerId);
    }
    p.moved = true;
    setAnim(false);
    setDrag(dx);
  }
  function endDrag(e: React.PointerEvent) {
    const p = ptr.current;
    ptr.current = null;
    if (!p || p.id !== e.pointerId || !p.dragging) return;
    const dx = e.clientX - p.x;
    const v = dx / Math.max(1, performance.now() - p.t);     // px per ms
    const card = trackRef.current?.firstElementChild?.getBoundingClientRect().width ?? 800;
    suppressClick.current = p.moved;
    setAnim(true);
    setDrag(0);
    if (dx < -Math.min(120, card * 0.15) || v < -0.45) next();
    else if (dx > Math.min(120, card * 0.15) || v > 0.45) prev();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  }

  return (
    <section
      ref={rootRef}
      className={`hero ${paused ? "is-paused" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured journeys"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={trackRef}
        className={`hero__track ${anim ? "" : "is-instant"} ${drag ? "is-dragging" : ""}`}
        style={{ transform: `translateX(calc(${-pos} * (var(--card) + var(--gap)) + ${drag}px))` }}
        onTransitionEnd={onTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}
      >
        {items.map((s, p) => {
          const real = realOf(p);
          const isClone = loop && (p === 0 || p === n + 1);
          const current = p === pos;
          return (
            <div
              key={`${p}-${s.image}`}
              className={`slide ${real === active ? "is-active" : ""} ${current ? "" : "is-peek"}`}
              aria-hidden={!current}
              aria-roledescription="slide"
              aria-label={`${real + 1} of ${n}`}
              onClick={current ? undefined : () => go(p)}
            >
              <Image src={s.image} alt={isClone ? "" : s.title} fill draggable={false}
                priority={p === (loop ? 1 : 0)} sizes="(max-width: 900px) 100vw, 1200px" />
              <div className="slide__body">
                <h2 className="slide__kicker">{s.title}</h2>
                <p className="slide__caption">{s.tag}</p>
                <div className="slide__btns">
                  {s.buttons.map((b, j) => (
                    <Link key={b.label} className={`btn ${j === 0 ? "btn--white" : "btn--ghost"}`} href={b.href}
                      tabIndex={current ? 0 : -1} draggable={false}>{b.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loop && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Previous slide"><Icon name="chevronLeft" /></button>
          <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Next slide"><Icon name="chevronRight" /></button>
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button key={s.image} className={i === active ? "is-active" : ""} onClick={() => go(i + 1)}
                aria-label={`Go to slide ${i + 1}`} aria-current={i === active ? "true" : undefined}>
                <span
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  onAnimationEnd={i === active ? next : undefined}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
