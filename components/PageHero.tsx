import Link from "next/link";

/** Page title band with breadcrumb (optionally over a photo). */
export default function PageHero({
  title, sub, crumbs = [], image,
}: { title: string; sub?: React.ReactNode; crumbs?: { href?: string; label: string }[]; image?: string | null }) {
  return (
    <section className={`phero ${image ? "phero--img" : ""}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <span aria-hidden="true">›</span>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
}
