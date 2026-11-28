import type { Metadata } from "next";
import { Suspense } from "react";
import DestinationTiles from "@/components/DestinationTiles";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinationTiles, destinations, packages, toCard } from "@/lib/content";

export const metadata: Metadata = { title: "Tour Packages" };
const groups = [
  { title: "Domestic Destinations", tiles: destinationTiles("domestic") },
  { title: "International Destinations", tiles: destinationTiles("international") },
];

export default function PackagesPage() {
  return (
    <>
      <PageHero title="Tour Packages" sub={`${packages.length} packages available`} crumbs={[{ label: "Tour Packages" }]} />
      {groups.map((g) => (
        <section key={g.title} className="section section--tight">
          <div className="container">
            <div className="shead"><div><h2>{g.title}</h2><p>{g.tiles.length} destinations</p></div></div>
            <DestinationTiles tiles={g.tiles} />
          </div>
        </section>
      ))}
      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>All Tour Packages</h2><p>{packages.length} packages available</p></div></div>
          <Suspense><PackageExplorer items={packages.map(toCard)} destinations={destinations} /></Suspense>
        </div>
      </section>
    </>
  );
}
