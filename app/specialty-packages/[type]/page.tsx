import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinations, getSpecialty, packagesFor, specialtyCards, toCard } from "@/lib/content";

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
  if (!items.length) notFound();

  return (
    <>
      <PageHero title={`${s.label} Tour Packages`} sub={`${items.length} packages available`}
        crumbs={[{ href: "/packages", label: "Tour Packages" }, { href: "/specialty-packages", label: "Specialty Packages" }, { label: s.label }]} />
      <section className="section">
        <div className="container">
          <Suspense><PackageExplorer items={items.map(toCard)} destinations={destinations} /></Suspense>
        </div>
      </section>
    </>
  );
}
