"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { contact, nav, waLink } from "@/data/site";
import Icon from "./Icon";
import { QuoteButton } from "./Quote";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setDrawer(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") || "").trim();
    router.push(q ? `/packages?q=${encodeURIComponent(q)}` : "/packages");
  }

  const isActive = (href: string) => pathname === href || (href !== "/packages" && pathname.startsWith(href + "/"));

  return (
    <>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container header__top">
          <Link href="/" className="logo" aria-label="Vajra Routes home">
            <Image src="/img/logo.jpg" alt="Vajra Routes logo" width={73} height={50} priority />
          </Link>
          <div className="header__util">
            <a className="util" href={contact.phoneHref}><Icon name="phone" /> {contact.phone}</a>
            <a className="util util--wa" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" /> WhatsApp</a>
            <Link className="util" href="/about-us">About Us</Link>
            <Link className="util" href="/contact-us">Contact</Link>
            <QuoteButton className="util util--quote">Get Free Quote</QuoteButton>
            <button className="burger" onClick={() => setDrawer(true)} aria-label="Open menu"><Icon name="menu" /></button>
          </div>
        </div>
        <div className="container header__bar">
          <nav className="pills" aria-label="Main">
            {nav.map((c) => (
              <Link key={c.href} className={`pill ${isActive(c.href) ? "is-active" : ""}`} href={c.href}>
                <span aria-hidden="true">{c.emoji}</span>{c.label}
              </Link>
            ))}
          </nav>
          <form className="hsearch" onSubmit={onSearch} role="search">
            <Icon name="search" />
            <label htmlFor="hs" className="sr-only">Search</label>
            <input id="hs" name="q" placeholder="Search packages, destinations..." autoComplete="off" />
          </form>
        </div>
      </header>

      <div className={`drawer ${drawer ? "is-open" : ""}`} aria-hidden={!drawer}>
        <div className="drawer__backdrop" onClick={() => setDrawer(false)} />
        <aside className="drawer__panel">
          <div className="drawer__head">
            <Image src="/img/logo.jpg" alt="Vajra Routes logo" width={61} height={42} />
            <button className="drawer__close" onClick={() => setDrawer(false)} aria-label="Close menu"><Icon name="close" /></button>
          </div>
          <nav>
            <Link href="/">Home</Link>
            {nav.map((c) => <Link key={c.href} href={c.href}>{c.label}</Link>)}
            <Link href="/gallery">Gallery</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
          <div className="drawer__cta">
            <QuoteButton className="btn btn--black btn--block">Get Free Quote</QuoteButton>
            <a className="btn btn--line btn--block" href={contact.phoneHref}><Icon name="phone" /> {contact.phone}</a>
          </div>
        </aside>
      </div>
    </>
  );
}
