import { Suspense } from "react";
import DestinationTiles from "@/components/DestinationTiles";
import PackageExplorer from "@/components/PackageExplorer";
import PageHero from "@/components/PageHero";
import { destinationTiles, destinations, packages, regionLabel, toCard, type Region } from "@/lib/content";

/** /domestic-tours and /international-tours: destinations first, then every package in the region. */
export default function RegionPage({ region }: { region: Region }) {
  const label = regionLabel[region];
  const tiles = destinationTiles(region);
  const items = packages.filter((p) => p.region === label);

  return (
    <>
      <PageHero title={`${label} Tour Packages`} sub={`${tiles.length} destinations  ·  ${items.length} packages`} crumbs={[{ label: `${label} Tour Packages` }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="shead"><div><h2>{label} Destinations</h2><p>{tiles.length} destinations</p></div></div>
          <DestinationTiles tiles={tiles} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>All {label} Tour Packages</h2><p>{items.length} packages available</p></div></div>
          <Suspense><PackageExplorer items={items.map(toCard)} destinations={destinations} /></Suspense>
        </div>
      </section>
    </>
  );
}
