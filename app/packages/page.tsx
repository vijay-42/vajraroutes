import type { Metadata } from "next";
import { Suspense } from "react";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinations, packages, toCard } from "@/lib/content";

export const metadata: Metadata = { title: "Tour Packages" };

export default function PackagesPage() {
  return (
    <>
      <PageHero title="Tour Packages" sub={`${packages.length} packages available`} crumbs={[{ label: "Tour Packages" }]} />
      <section className="section">
        <div className="container">
          <Suspense><PackageExplorer items={packages.map(toCard)} destinations={destinations} /></Suspense>
        </div>
      </section>
    </>
  );
}
