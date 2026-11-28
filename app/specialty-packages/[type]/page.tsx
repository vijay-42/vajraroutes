import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { QuoteButton } from "@/components/Quote";
import { destinations, getSpecialty, packagesFor, specialtyCards, toCard } from "@/lib/content";
import Image from "next/image";

type Props = { params: Promise<{ type: string }> };

export function generateStaticParams() {
  return specialtyCards().map((c) => ({ type: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSpecialty((await params).type);
  return s ? { title: `${s.label} Tour Packages` } : {};
}

export default async function SpecialtyPage({ params }: Props) {
  const s = getSpecialty((await params).type);
  if (!s) notFound();
  const items = packagesFor(s);
  const image = specialtyCards().find((c) => c.slug === s.slug)?.image ?? null;

  return (
    <>
      <PageHero title={`${s.label} Tour Packages`} sub={items.length ? `${items.length} packages available` : undefined}
        crumbs={[{ href: "/packages", label: "Tour Packages" }, { href: "/specialty-packages", label: "Specialty Packages" }, { label: s.label }]} />
      <section className={`section${items.length ? " section--tight" : ""}`}>
        <div className="container">
          <div className="spec-intro">
            {image && <div className="spec-intro__img"><Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 360px" /></div>}
            <div className="spec-intro__body">
              <span className="spec-intro__emoji" aria-hidden="true">{s.emoji}</span>
              <p>{s.intro}</p>
              <ul>{s.highlights.map((h) => <li key={h}>✓ {h}</li>)}</ul>
              <QuoteButton className="btn btn--black" destination={`${s.label} Tour Package`}>Get Free Quote</QuoteButton>
            </div>
          </div>
        </div>
      </section>
      {items.length > 0 && (
        <section className="section">
          <div className="container">
            <Suspense><PackageExplorer items={items.map(toCard)} destinations={destinations} /></Suspense>
          </div>
        </section>
      )}
    </>
  );
}
