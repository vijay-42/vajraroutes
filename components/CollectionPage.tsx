import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/Cards";
import PageHero from "@/components/PageHero";
import { QuoteButton } from "@/components/Quote";
import { collections } from "@/data/site";
import { collectionSlug, getCollection, packagesInCollection, regionLabel, toCard, type Region } from "@/lib/content";

/** Shared by /domestic-tours/[slug] and /international-tours/[slug]. */
export type CollectionProps = { params: Promise<{ slug: string }> };

export const collectionParams = (r: Region) => () => collections[r].map((c) => ({ slug: collectionSlug(c) }));

export const collectionMetadata = (r: Region) => async ({ params }: CollectionProps): Promise<Metadata> => {
  const c = getCollection(r, (await params).slug);
  return c ? { title: c.label.replace(/^./, (x) => x.toUpperCase()) } : {};
};

export default async function CollectionPage({ region, params }: CollectionProps & { region: Region }) {
  const c = getCollection(region, (await params).slug);
  if (!c) notFound();
  const items = packagesInCollection(region, c);
  const listLabel = `${regionLabel[region]} Tours`;

  return (
    <>
      <PageHero title={c.label} sub={`${items.length} packages available`}
        crumbs={[{ href: `/${region}-tours`, label: listLabel }, { label: c.label }]} />
      <section className="section">
        <div className="container">
          {items.length ? (
            <div className="grid grid--pkg">{items.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}</div>
          ) : (
            <div className="coll-empty">
              <QuoteButton className="btn btn--black">Get Free Quote</QuoteButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
