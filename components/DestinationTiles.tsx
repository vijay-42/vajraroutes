import Image from "next/image";
import Link from "next/link";
import { inr, type DestTile } from "@/lib/content";
import { destName } from "@/lib/names";

/** Photo tiles linking to each destination's package page. */
export default function DestinationTiles({ tiles }: { tiles: DestTile[] }) {
  return (
    <div className="spec-grid">
      {tiles.map((t) => (
        <Link key={t.href} href={t.href} className={`spec-card${t.image ? "" : " spec-card--noimg"}`}>
          {t.image && <Image src={t.image} alt="" fill sizes="(max-width: 520px) 100vw, (max-width: 1000px) 50vw, 25vw" />}
          <span className="spec-card__body">
            <strong>{destName(t.label)}</strong>
            <small>
              {t.count} {t.count === 1 ? "package" : "packages"}
              {t.from != null && <> · from {inr(t.from)}</>}
            </small>
          </span>
        </Link>
      ))}
    </div>
  );
}
