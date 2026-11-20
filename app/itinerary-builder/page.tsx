import type { Metadata } from "next";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import PageHero from "@/components/PageHero";
import { destinations } from "@/lib/content";

export const metadata: Metadata = { title: "Custom Itinerary" };

export default function ItineraryPage() {
  return (
    <>
      <PageHero title="Build Your Custom Itinerary" sub="Design your perfect trip with our easy-to-use itinerary builder" crumbs={[{ label: "Custom Itinerary" }]} />
      <section className="section">
        <div className="container">
          <ItineraryBuilder destinations={[...destinations].sort((a, b) => a.name.localeCompare(b.name)).map((d) => d.name)} />
        </div>
      </section>
    </>
  );
}
