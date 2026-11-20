"use client";

import { useEffect } from "react";
import { contact, waLink } from "@/data/site";
import Icon from "./Icon";
import { useQuote } from "./Quote";

/** WhatsApp bubble (desktop), sticky action bar (mobile), and scroll-reveal animations. */
export default function Floating() {
  const { open } = useQuote();

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="fab-wa" href={waLink()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <Icon name="whatsapp" />
      </a>
      <nav className="mbar" aria-label="Quick actions">
        <a href={contact.phoneHref}><Icon name="phone" />Call</a>
        <a className="is-wa" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" />WhatsApp</a>
        <button className="is-quote" onClick={() => open()}><Icon name="edit" />Free Quote</button>
      </nav>
    </>
  );
}
