import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinations, packages, specialties, specialtyCards, toCard } from "@/lib/content";

export const metadata: Metadata = { title: "Specialty Packages" };
const cards = specialtyCards();
const items = packages.filter((p) => specialties.some((s) => s.test(p)));

export default function SpecialtyPackages() {
  return (
    <>
      <PageHero title="Specialty Packages" sub={`${cards.length} tour types`} crumbs={[{ href: "/packages", label: "Tour Packages" }, { label: "Specialty Packages" }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="shead"><div><h2>Tour Types</h2><p>{cards.length} tour types</p></div></div>
          <div className="spec-grid">
            {cards.map((c) => (
              <Link key={c.slug} href={`/specialty-packages/${c.slug}`} className={`spec-card${c.image ? "" : " spec-card--noimg"}`}>
                {c.image && <Image src={c.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" />}
                <span className="spec-card__body">
                  <span className="spec-card__emoji" aria-hidden="true">{c.emoji}</span>
                  <strong>{c.label}</strong>
                  <small>{c.count ? <>{c.count} {c.count === 1 ? "package" : "packages"}</> : null}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {items.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="shead"><div><h2>All Specialty Packages</h2><p>{items.length} packages available</p></div></div>
            <Suspense><PackageExplorer items={items.map(toCard)} destinations={destinations} /></Suspense>
          </div>
        </section>
      )}
    </>
  );
}
