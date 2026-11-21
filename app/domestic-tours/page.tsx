import type { Metadata } from "next";
import { Suspense } from "react";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinations, packages, toCard } from "@/lib/content";

export const metadata: Metadata = { title: "Domestic Tour Packages" };
const items = packages.filter((p) => p.region === "Domestic");

export default function DomesticPackages() {
  return (
    <>
      <PageHero title="Domestic Tour Packages" sub={`${items.length} packages available`} crumbs={[{ label: "Domestic Tour Packages" }]} />
      <section className="section">
        <div className="container">
          <Suspense><PackageExplorer items={items.map(toCard)} destinations={destinations} /></Suspense>
        </div>
      </section>
    </>
  );
}
