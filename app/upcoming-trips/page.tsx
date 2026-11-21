import type { Metadata } from "next";
import { PackageCard } from "@/components/Cards";
import PageHero from "@/components/PageHero";
import { toCard, upcoming } from "@/lib/content";

export const metadata: Metadata = { title: "Upcoming Trips" };

export default function UpcomingTrips() {
  return (
    <>
      <PageHero title="Upcoming Trips" sub={`${upcoming.length} packages available`} crumbs={[{ label: "Upcoming Trips" }]} />
      <section className="section">
        <div className="container">
          <div className="grid grid--pkg">{upcoming.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}</div>
        </div>
      </section>
    </>
  );
}
