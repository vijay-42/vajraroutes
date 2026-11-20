import type { Metadata } from "next";
import Link from "next/link";
import { CityCard } from "@/components/Cards";
import PageHero from "@/components/PageHero";
import { destinations } from "@/lib/content";

export const metadata: Metadata = { title: "Destinations" };

const domestic = destinations.filter((d) => d.region === "Domestic");
const international = destinations.filter((d) => d.region === "International");

export default function DestinationsPage() {
  return (
    <>
      <PageHero title="Explore Destinations" sub={`${domestic.length} Domestic  ·  ${international.length} International`} crumbs={[{ label: "Destinations" }]} />
      {[{ title: "Domestic Destinations", list: domestic }, { title: "International Destinations", list: international }].map((g, i) => (
        <section key={g.title} className={`section ${i ? "section--soft" : ""}`}>
          <div className="container">
            <div className="shead"><div><h2>{g.title}</h2><p>{g.list.length} destinations</p></div></div>
            <div className="grid grid--city">{g.list.map((d) => <CityCard key={d.slug} d={d} />)}</div>
          </div>
        </section>
      ))}
      <div className="container" style={{ paddingBottom: 56 }}>
        <div className="strip">
          <div className="strip__icon" aria-hidden="true">🧭</div>
          <div>
            <h3>Can&apos;t Find Your Destination?</h3>
            <p>Tell us where you want to go and we&apos;ll craft a personalised itinerary for you.</p>
          </div>
          <div className="strip__btns">
            <Link className="btn btn--line" href="/contact-us">Contact Us</Link>
            <Link className="btn btn--black" href="/itinerary-builder">Build Itinerary</Link>
          </div>
        </div>
      </div>
    </>
  );
}
