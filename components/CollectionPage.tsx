import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/Cards";
import PageHero from "@/components/PageHero";
import { QuoteButton } from "@/components/Quote";
import { collections } from "@/data/site";
import Image from "next/image";
import DestinationTiles from "@/components/DestinationTiles";
import { collectionDescription, collectionSlug, destinationTiles, firstImage, getCollection, inr, packagesInCollection, regionLabel, toCard, type Region } from "@/lib/content";
import { destName } from "@/lib/names";

/** Shared by /domestic-tours/[slug] and /international-tours/[slug]. */
export type CollectionProps = { params: Promise<{ slug: string }> };

export const collectionParams = (r: Region) => () => collections[r].map((c) => ({ slug: collectionSlug(c) }));

export const collectionMetadata = (r: Region) => async ({ params }: CollectionProps): Promise<Metadata> => {
  const c = getCollection(r, (await params).slug);
  return c ? { title: c.label.replace(/^./, (x) => x.toUpperCase()) } : {};
};

export default async function CollectionPage({ region, params }: CollectionProps & { region: Region }) {
  const { slug } = await params;
  const c = getCollection(region, slug);
  if (!c) notFound();
  const items = packagesInCollection(region, c);
  const listLabel = `${regionLabel[region]} Tours`;
  const name = destName(c.label);
  const image = items.map(firstImage).find(Boolean) ?? null;
  const description = collectionDescription(region, c);
  const prices = items.map((p) => p.price).filter((n): n is number => n != null);
  const others = destinationTiles(region).filter((t) => !t.href.endsWith(`/${slug}`)).slice(0, 8);

  return (
    <>
      <PageHero title={c.label} sub={`${items.length} packages available`} image={image}
        crumbs={[{ href: `/${region}-tours`, label: listLabel }, { label: c.label }]} />
      <section className="section section--tight">
        <div className="container">
          <div className="spec-intro">
            {image && <div className="spec-intro__img"><Image src={image} alt={name} fill sizes="(max-width: 800px) 100vw, 360px" /></div>}
            <div className="spec-intro__body">
              <h2 className="dest-intro__title">{name}</h2>
              {description && <div className="rich" dangerouslySetInnerHTML={{ __html: description }} />}
              <ul>
                <li>✓ {items.length} {items.length === 1 ? "package" : "packages"} from Bangalore</li>
                {prices.length > 0 && <li>✓ Starting from {inr(Math.min(...prices))} per person</li>}
              </ul>
              <QuoteButton className="btn btn--black" destination={c.label}>Get Free Quote</QuoteButton>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>{name} Tour Packages</h2><p>{items.length} packages available</p></div></div>
          {items.length ? (
            <div className="grid grid--pkg">{items.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}</div>
          ) : (
            <div className="coll-empty">
              <QuoteButton className="btn btn--black">Get Free Quote</QuoteButton>
            </div>
          )}
        </div>
      </section>
      {others.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <div className="shead"><div><h2>Other {regionLabel[region]} Destinations</h2></div></div>
            <DestinationTiles tiles={others} />
          </div>
        </section>
      )}
    </>
  );
}
