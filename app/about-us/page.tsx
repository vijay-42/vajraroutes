import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { stats } from "@/data/site";
import { aboutText, banners } from "@/lib/content";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHero title={aboutText.kicker} sub={aboutText.tagline} crumbs={[{ label: "About Us" }]} />
      <section className="section">
        <div className="container split">
          <div>
            <h2 className="h2">{aboutText.heading}</h2>
            {aboutText.paragraphs.map((t) => <p key={t} className="para">{t}</p>)}
            <div className="mini-stats">
              {stats.slice(0, 2).map((s) => <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}
            </div>
          </div>
          <div className="split__img"><Image src={banners[0].image} alt={banners[0].title} fill sizes="(max-width: 900px) 100vw, 560px" /></div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container mv">
          <div className="box"><span className="mv__emoji">🎯</span><h3>Our Mission</h3><p>{aboutText.mission}</p></div>
          <div className="box"><span className="mv__emoji">🔭</span><h3>Our Vision</h3><p>{aboutText.vision}</p></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>Why Choose Us</h2></div></div>
          <div className="features">
            {aboutText.why.map((f, i) => (
              <div key={f.title} className="feature">
                <span className="feature__emoji" aria-hidden="true">{["🛡️", "🏷️", "🎧"][i]}</span>
                <div><h3>{f.title}</h3><p>{f.text}</p></div>
              </div>
            ))}
          </div>
          <div className="stats" style={{ marginTop: 24 }}>
            {stats.slice(2).map((s) => (
              <div key={s.label} className="stat stat--soft">
                <div className="stat__emoji" aria-hidden="true">{s.emoji}</div>
                <strong>{s.value}</strong><p>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn--black" href="/packages">Tour Packages</Link>
            <Link className="btn btn--line" href="/contact-us">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
