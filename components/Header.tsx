"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact, nav, waLink } from "@/data/site";
import type { MenuLink, MenuPkg, NavMenu, SpecialtyCard } from "@/lib/content";
import Icon from "./Icon";
import { QuoteButton } from "./Quote";

const inr = (n: number | null) => (n == null ? "" : "₹" + n.toLocaleString("en-IN"));

type MenuKey = "domestic" | "international" | "specialty" | "upcoming";
const menuFor: Record<string, MenuKey> = {
  "/domestic-tours": "domestic", "/international-tours": "international", "/specialty-packages": "specialty", "/upcoming-trips": "upcoming",
};
const menuInfo: Record<MenuKey, { href: string; label: string }> = {
  domestic: { href: "/domestic-tours", label: "Domestic Tours" },
  international: { href: "/international-tours", label: "International Tours" },
  specialty: { href: "/specialty-packages", label: "Specialty Packages" },
  upcoming: { href: "/upcoming-trips", label: "Upcoming Trips" },
};

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

/** Plain text links: one per destination collection. */
function LinkList({ items }: { items: MenuLink[] }) {
  return (
    <ul className="mega__links">
      {items.map((l) => (
        <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
      ))}
    </ul>
  );
}

function SpecialtyList({ items }: { items: SpecialtyCard[] }) {
  return (
    <ul className="mega__pkgs mega__pkgs--spec">
      {items.map((s) => (
        <li key={s.slug}>
          <Link href={`/specialty-packages/${s.slug}`} className="mega__pkg">
            <span className="mega__thumb mega__thumb--lg">{s.image ? <Image src={s.image} alt="" fill sizes="64px" /> : s.emoji}</span>
            <span>
              <strong><span aria-hidden="true">{s.emoji}</span> {s.label}</strong>
              <small>{s.count} {s.count === 1 ? "package" : "packages"}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MegaPanel({ k, menu }: { k: MenuKey; menu: NavMenu }) {
  const { href, label } = menuInfo[k];
  if (k === "specialty") {
    return (
      <>
        <SpecialtyList items={menu.specialty} />
        <div className="mega__foot"><Link href={href}>View All {label} <Icon name="arrowRight" /></Link></div>
      </>
    );
  }
  if (k === "domestic" || k === "international") {
    return (
      <>
        <LinkList items={menu[k]} />
        <div className="mega__foot"><Link href={href}>View All {label} <Icon name="arrowRight" /></Link></div>
      </>
    );
  }
  const items = menu[k];
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

  const headerRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [tucked, setTucked] = useState(false);
  const lockRef = useRef(false);   // never tuck while a mega menu or the drawer is open
  useEffect(() => { lockRef.current = !!open || drawer; if (lockRef.current) setTucked(false); }, [open, drawer]);

  // Scroll down → tuck the header away (desktop: just the logo/utility row, so the
  // nav pills stay pinned; mobile: the whole header). Scroll up → bring it back.
  // Uses transform only, so the page never jumps.
  useEffect(() => {
    const header = headerRef.current, top = topRef.current;
    if (!header || !top) return;
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 900px)");
    let full = 0, shift = 0, lastY = window.scrollY, isTucked = false, frame = 0;

    const apply = (t: boolean) => {
      isTucked = t;
      setTucked(t);
      root.style.setProperty("--hdr-h", `${t ? full - shift : full}px`);  // used by sticky sidebars
    };
    const measure = () => {
      full = header.offsetHeight;
      shift = mq.matches ? full : top.offsetHeight;
      header.style.setProperty("--hdr-shift", `${shift}px`);
      apply(isTucked);
    };
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      setScrolled(y > 10);
      if (y <= full) {                       // near the top: always fully shown
        if (isTucked) apply(false);
        lastY = y;
        return;
      }
      if (Math.abs(dy) < 8) return;          // ignore jitter / tiny trackpad moves
      if (dy > 0 && !isTucked && !lockRef.current && !header.querySelector("input:focus")) apply(true);
      else if (dy < 0 && isTucked) apply(false);
      lastY = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    measure();
    update();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    mq.addEventListener("change", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
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
      <header ref={headerRef} className={`header ${scrolled ? "is-scrolled" : ""} ${tucked ? "is-tucked" : ""}`}>
        <div ref={topRef} className="container header__top">
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
            {(Object.keys(menuInfo) as MenuKey[]).map((k) => (
              <details key={k}>
                <summary>{menuInfo[k].label} <Icon name="chevronDown" /></summary>
                <Link href={menuInfo[k].href}>All {menuInfo[k].label}</Link>
                {k === "specialty"
                  ? menu.specialty.map((s) => <Link key={s.slug} href={`/specialty-packages/${s.slug}`}>{s.emoji} {s.label} ({s.count})</Link>)
                  : k === "upcoming"
                    ? menu.upcoming.map((p) => <Link key={p.slug} href={`/packages/${p.slug}`}>{p.title}</Link>)
                    : menu[k].map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
              </details>
            ))}
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
