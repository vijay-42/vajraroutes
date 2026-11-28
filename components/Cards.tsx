import Image from "next/image";
import Link from "next/link";
import type { IconName } from "@/data/site";
import { inr, type CardPkg, type Destination, type Perk } from "@/lib/content";
import { destName, pkgName } from "@/lib/names";
import Icon from "./Icon";
import Wish from "./Wish";

/** Small framed tile — "Popular Destinations". */
export function CityCard({ d }: { d: Destination }) {
  return (
    <Link className="city" href={`/destinations/${d.slug}`}>
      <div className="city__img">
        {d.image ? <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 42vw, 200px" /> : <span className="noimg">🗺️</span>}
      </div>
      <strong title={d.name}>{destName(d.name)}</strong>
      <small>{d.count} Tour {d.count === 1 ? "Package" : "Packages"}</small>
    </Link>
  );
}

const perkIcon: Record<Perk, IconName> = { Flights: "plane", Hotel: "hotel", Meals: "meal", Sightseeing: "camera", Transfers: "car" };

/** Tour package card. */
export function PackageCard({ p }: { p: CardPkg }) {
  const href = p.href;

  return (
    <article className="tcard">
      <Link href={href} className="tcard__media" tabIndex={-1} aria-hidden="true">
        {p.image && <Image src={p.image} alt="" fill sizes="(max-width: 640px) 80vw, (max-width: 1100px) 33vw, 300px" />}
        <span className="tcard__shade" />
        <span className="tcard__label">{p.label}</span>
        <span className="tcard__dur"><Icon name="clock" /> {p.duration}</span>
      </Link>
      <Wish />

      <div className="tcard__body">
        <h3 className="tcard__title"><Link href={href} title={p.title}>{pkgName(p.title)}</Link></h3>

        {p.perks.length > 0 && (
          <ul className="tcard__perks" aria-label="Included">
            {p.perks.map((k) => (
              <li key={k}><span className="tcard__perk-ico"><Icon name={perkIcon[k]} /></span><small>{k}</small></li>
            ))}
          </ul>
        )}

        <div className="tcard__foot">
          <div className="tcard__price">
            <span className="tcard__now"><strong>{inr(p.price)}</strong><small>per person</small></span>
          </div>
          <Link href={href} className="tcard__cta" aria-label={`View details: ${p.title}`}><span>View Details</span><Icon name="arrowRight" /></Link>
        </div>
      </div>
    </article>
  );
}
