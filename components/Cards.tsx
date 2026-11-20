import Image from "next/image";
import Link from "next/link";
import { inr, type CardPkg, type Destination, type Perk } from "@/lib/content";
import Icon from "./Icon";
import Wish from "./Wish";

/** Small framed tile — "Popular Destinations". */
export function CityCard({ d }: { d: Destination }) {
  return (
    <Link className="city" href={`/destinations/${d.slug}`}>
      <div className="city__img">
        {d.image ? <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 42vw, 200px" /> : <span className="noimg">🗺️</span>}
      </div>
      <strong>{d.name}</strong>
      <small>{d.count} Tour Packages</small>
    </Link>
  );
}

const perkIcon: Record<Perk, string> = { Flights: "✈️", Hotel: "🏨", Meals: "🍽️", Sightseeing: "📸", Transfers: "🚐" };

/** Tour package card. */
export function PackageCard({ p }: { p: CardPkg }) {
  const href = `/packages/${p.slug}`;
  const save = p.oldPrice && p.price ? p.oldPrice - p.price : 0;

  return (
    <article className="tcard">
      <Link href={href} className="tcard__media" tabIndex={-1} aria-hidden="true">
        {p.image && <Image src={p.image} alt="" fill sizes="(max-width: 640px) 80vw, (max-width: 1100px) 33vw, 300px" />}
        <span className="tcard__shade" />
        {p.off ? <span className="tcard__off">{p.off}% OFF</span> : null}
        <span className="tcard__dur"><Icon name="clock" /> {p.duration}</span>
      </Link>
      <Wish />

      <div className="tcard__body">
        <div className="tcard__tags">
          <span className="tcard__label">{p.label}</span>
          <span className="tcard__where" title={p.destination}><Icon name="pin" />{p.destination}</span>
        </div>

        <h3 className="tcard__title"><Link href={href}>{p.title}</Link></h3>

        {p.perks.length > 0 && (
          <ul className="tcard__perks" aria-label="Included">
            {p.perks.map((k) => (
              <li key={k} title={k}><span aria-hidden="true">{perkIcon[k]}</span><small>{k}</small></li>
            ))}
          </ul>
        )}

        <div className="tcard__foot">
          <div className="tcard__price">
            {p.oldPrice ? (
              <span className="tcard__was"><s>{inr(p.oldPrice)}</s>{save > 0 && <em>Save {inr(save)}</em>}</span>
            ) : null}
            <strong>{inr(p.price)}</strong>
            <small>per person</small>
          </div>
          <Link href={href} className="tcard__cta" aria-label={`View details: ${p.title}`}><span>View Details</span><Icon name="arrowRight" /></Link>
        </div>
      </div>
    </article>
  );
}
