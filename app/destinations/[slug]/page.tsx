import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/Cards";
import EnquiryForm from "@/components/EnquiryForm";
import PageHero from "@/components/PageHero";
import { destinations, getDestination, packagesIn, toCard } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDestination((await params).slug);
  return d ? { title: d.name, openGraph: d.image ? { images: [d.image] } : undefined } : {};
}

export default async function DestinationPage({ params }: Props) {
  const d = getDestination((await params).slug);
  if (!d) notFound();
  const list = packagesIn(d);
  const others = destinations.filter((x) => x.slug !== d.slug && x.region === d.region).slice(0, 8);

  return (
    <>
      <PageHero title={d.name} sub={`${list.length} Tour Packages Available`} image={d.image}
        crumbs={[{ href: "/destinations", label: "Destinations" }, { label: d.name }]} />
      <section className="section">
        <div className="container dlayout">
          <div>
            {d.image && (
              <div className="dcover"><Image src={d.image} alt={d.name} fill sizes="(max-width: 900px) 100vw, 800px" /></div>
            )}
            {d.description && <div className="rich dlead" dangerouslySetInnerHTML={{ __html: d.description }} />}
            <div className="shead"><div><h2>Tour Packages in {d.name}</h2></div></div>
            {list.length ? (
              <div className="grid grid--pkg3">{list.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}</div>
            ) : (
              <div className="empty">
                No packages are listed for this destination right now. <Link className="viewall" href="/itinerary-builder">Build Itinerary</Link>
              </div>
            )}
          </div>
          <aside className="dside">
            <div className="box">
              <EnquiryForm title="Quick Enquiry" sub="" defaultDestination={d.name} submitLabel="Send Enquiry" />
            </div>
            <div className="box">
              <h3 className="dside__title">Other Destinations</h3>
              <ul className="dside__list">
                {others.map((o) => <li key={o.slug}><Link href={`/destinations/${o.slug}`}>{o.name}</Link></li>)}
              </ul>
              <Link className="btn btn--line btn--block" href="/destinations">View All Destinations</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
