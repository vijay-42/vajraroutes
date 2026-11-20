"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact, nav, waLink } from "@/data/site";
import type { MenuDest, MenuPkg, NavMenu } from "@/lib/content";
import Icon from "./Icon";
import { QuoteButton } from "./Quote";

const inr = (n: number | null) => (n == null ? "" : "₹" + n.toLocaleString("en-IN"));

type MenuKey = "dest" | "domestic" | "international";
const menuFor: Record<string, MenuKey> = {
  "/destinations": "dest", "/packages/domestic": "domestic", "/packages/international": "international",
};

function DestList({ title, items }: { title: string; items: MenuDest[] }) {
  return (
    <div className="mega__col">
      <h4 className="mega__h">{title} <small>{items.length}</small></h4>
      <ul className="mega__dests">
        {items.map((d) => (
          <li key={d.slug}>
            <Link href={`/destinations/${d.slug}`} className="mega__dest">
              <span className="mega__thumb">{d.image ? <Image src={d.image} alt="" fill sizes="44px" /> : "🗺️"}</span>
              <span><strong>{d.name}</strong><small>{d.count} Tour {d.count === 1 ? "Package" : "Packages"}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PkgList({ items }: { items: MenuPkg[] }) {
  return (
    <ul className="mega__pkgs">
      {items.map((p) => (
        <li key={p.slug}>
          <Link href={`/packages/${p.slug}`} className="mega__pkg">
            <span className="mega__thumb mega__thumb--lg">{p.image ? <Image src={p.image} alt="" fill sizes="64px" /> : "🧳"}</span>
            <span>
              <strong>{p.title}</strong>
              <small><Icon name="clock" /> {p.duration}{p.price ? <> · <b>{inr(p.price)}</b></> : null}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaPanel({ k, menu }: { k: MenuKey; menu: NavMenu }) {
  if (k === "dest") {
    return (
      <>
        <div className="mega__grid mega__grid--dest">
          <DestList title="Domestic" items={menu.domesticDest} />
          <DestList title="International" items={menu.internationalDest} />
        </div>
        <div className="mega__foot"><Link href="/destinations">View All Destinations <Icon name="arrowRight" /></Link></div>
      </>
    );
  }
  const items = k === "domestic" ? menu.domestic : menu.international;
  const href = k === "domestic" ? "/packages/domestic" : "/packages/international";
  const label = k === "domestic" ? "Domestic Tours" : "International Tours";
  return (
    <>
      <PkgList items={items} />
      <div className="mega__foot"><Link href={href}>View All {label} ({items.length}) <Icon name="arrowRight" /></Link></div>
    </>
  );
}

export default function Header({ menu }: { menu: NavMenu }) {
  const [open, setOpen] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  useEffect(() => { setDrawer(false); setOpen(null); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = (k: MenuKey) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(k); };
  const hide = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(null), 160); };
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
            {nav.map((c) => {
              const k = menuFor[c.href];
              const pill = (
                <Link className={`pill ${isActive(c.href) ? "is-active" : ""} ${k && open === k ? "is-open" : ""}`} href={c.href}
                  aria-haspopup={k ? "true" : undefined} aria-expanded={k ? open === k : undefined}
                  onClick={() => setOpen(null)}>
                  <span aria-hidden="true">{c.emoji}</span>{c.label}
                  {k && <Icon name="chevronDown" className="pill__chev" />}
                </Link>
              );
              if (!k) return <span key={c.href} className="navi">{pill}</span>;
              return (
                <div key={c.href} className="navi" onMouseEnter={() => show(k)} onMouseLeave={hide}
                  onFocus={() => show(k)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide(); }}>
                  {pill}
                  <div className={`mega ${open === k ? "is-open" : ""}`} role="region" aria-label={`${c.label} menu`}>
                    <div className="mega__inner"><MegaPanel k={k} menu={menu} /></div>
                  </div>
                </div>
              );
            })}
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
            <details>
              <summary>Destinations <Icon name="chevronDown" /></summary>
              <Link href="/destinations">All Destinations</Link>
              {[...menu.domesticDest, ...menu.internationalDest].map((d) => <Link key={d.slug} href={`/destinations/${d.slug}`}>{d.name}</Link>)}
            </details>
            <details>
              <summary>Domestic Tours <Icon name="chevronDown" /></summary>
              <Link href="/packages/domestic">All Domestic Tours</Link>
              {menu.domestic.map((p) => <Link key={p.slug} href={`/packages/${p.slug}`}>{p.title}</Link>)}
            </details>
            <details>
              <summary>International Tours <Icon name="chevronDown" /></summary>
              <Link href="/packages/international">All International Tours</Link>
              {menu.international.map((p) => <Link key={p.slug} href={`/packages/${p.slug}`}>{p.title}</Link>)}
            </details>
            {nav.filter((c) => !menuFor[c.href]).map((c) => <Link key={c.href} href={c.href}>{c.label}</Link>)}
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
