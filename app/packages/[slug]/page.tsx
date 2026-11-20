import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCard } from "@/components/Cards";
import EnquiryForm from "@/components/EnquiryForm";
import Icon from "@/components/Icon";
import PackageGallery from "@/components/PackageGallery";
import { QuoteButton } from "@/components/Quote";
import { contact, waLink } from "@/data/site";
import { getDestination, getPackage, inr, packages, packagesIn, toCard } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPackage((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.metaDescription || p.excerpt, openGraph: { images: p.images.slice(0, 1) } };
}

export default async function PackagePage({ params }: Props) {
  const p = getPackage((await params).slug);
  if (!p) notFound();
  const dest = p.destinationSlug ? getDestination(p.destinationSlug) : undefined;
  const more = (dest ? packagesIn(dest) : []).filter((x) => x.slug !== p.slug);
  const related = more.length ? more : packages.filter((x) => x.region === p.region && x.slug !== p.slug).slice(0, 8);
  const days = p.duration.split(" / ");

  return (
    <>
      <div className="container pdp">
        <nav className="crumbs crumbs--dark" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">›</span>
          <Link href="/packages">Tour Packages</Link><span aria-hidden="true">›</span>
          {dest && <><Link href={`/destinations/${dest.slug}`}>{dest.name}</Link><span aria-hidden="true">›</span></>}
          <span aria-current="page">{p.title}</span>
        </nav>
        <h1 className="pdp__title">{p.title}</h1>
        <p className="pdp__sub"><Icon name="clock" /> {p.duration} <span>•</span> <Icon name="pin" /> {p.destination}</p>

        <PackageGallery images={p.images} title={p.title} off={p.off} />

        <div className="pdp__layout">
          <div className="pdp__main">
            <div className="quick">
              <div><Icon name="clock" /><strong>{days[0]}</strong><small>/ {days[1]}</small></div>
              <div><Icon name="users" /><strong>{p.travellers}</strong><small>Travelers</small></div>
              <div><Icon name="pin" /><strong>{p.destination}</strong><small>Destination</small></div>
              <div><Icon name="tag" /><strong>{p.type}</strong><small>Type</small></div>
            </div>

            {p.aboutHtml && (
              <section className="box">
                <h2>About This Tour</h2>
                <div className="rich" dangerouslySetInnerHTML={{ __html: p.aboutHtml }} />
              </section>
            )}

            {p.highlights.length > 0 && (
              <section className="box">
                <h2>Tour Highlights</h2>
                <ul className="ticks">{p.highlights.map((h, i) => <li key={i}><Icon name="check" />{h}</li>)}</ul>
              </section>
            )}

            {p.itinerary.length > 0 && (
              <section className="box">
                <h2>Day-wise Itinerary</h2>
                <div className="itin">
                  {p.itinerary.map((d, i) => (
                    <details key={i} className="itin__day" open={i === 0}>
                      <summary><span className="itin__badge">{d.day}</span><span>{d.title}</span><Icon name="chevronDown" /></summary>
                      <div className="itin__body">{d.lines.map((l, j) => <p key={j}>{l}</p>)}</div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="incexc">
              {p.inclusions.length > 0 && (
                <section className="box">
                  <h2>Inclusions</h2>
                  <ul className="ticks ticks--yes">{p.inclusions.map((x, i) => <li key={i}><Icon name="check" />{x}</li>)}</ul>
                </section>
              )}
              {p.exclusions.length > 0 && (
                <section className="box">
                  <h2>Exclusions</h2>
                  <ul className="ticks ticks--no">{p.exclusions.map((x, i) => <li key={i}><Icon name="close" />{x}</li>)}</ul>
                </section>
              )}
            </div>

            <section className="box" id="enquiry">
              <EnquiryForm title="Send Enquiry" sub="" defaultDestination={p.title} submitLabel="Send Enquiry" />
            </section>
          </div>

          <aside className="pdp__side">
            <div className="pricebox">
              {p.oldPrice ? <div className="pricebox__was"><s>{inr(p.oldPrice)}</s>{p.off ? <span className="badge badge--save static">{p.off}% OFF</span> : null}</div> : null}
              <div className="pricebox__now">{inr(p.price)} <small>per person</small></div>
              <QuoteButton className="btn btn--black btn--block btn--lg" destination={p.title}>Book Now</QuoteButton>
              <a className="btn btn--wa btn--block" href={waLink(`Hi Vajra Routes, I'm interested in: ${p.title}`)} target="_blank" rel="noopener"><Icon name="whatsapp" /> WhatsApp Us</a>
              <ul className="pricebox__list">
                <li><Icon name="check" /> Best price guarantee</li>
                <li><Icon name="check" /> Instant booking confirmation</li>
                <li><Icon name="check" /> 24/7 customer support</li>
              </ul>
            </div>
            <div className="helpbox">
              <h3>Need Help?</h3>
              <p>Our travel experts are here to assist you with any questions.</p>
              <a href={contact.phoneHref}><Icon name="phone" /> {contact.phone}</a>
              <a href={`mailto:${contact.email}`}><Icon name="mail" /> Email Us</a>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <div className="shead"><div><h2>{dest && more.length ? `Tour Packages in ${dest.name}` : `${p.region} Tour Packages`}</h2></div>
              <div className="shead__nav"><Link className="viewall" href="/packages">View All Packages</Link></div></div>
            <div className="grid grid--pkg">{related.slice(0, 8).map((x) => <PackageCard key={x.slug} p={toCard(x)} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
