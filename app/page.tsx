import Image from "next/image";
import Link from "next/link";
import { CityCard, PackageCard } from "@/components/Cards";
import Directory from "@/components/Directory";
import EnquiryForm from "@/components/EnquiryForm";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import Icon from "@/components/Icon";
import Rail from "@/components/Rail";
import { contact, home, stats, testimonials, waLink, whyChoose } from "@/data/site";
import { aboutText, banners, destinations, faqGroups, featured, packages, posts, toCard } from "@/lib/content";

const popular = destinations.filter((d) => d.image);
const domestic = packages.filter((p) => p.region === "Domestic");
const international = packages.filter((p) => p.region === "International");

export default function Home() {
  return (
    <>
      <Hero slides={banners} />

      <section className="section">
        <div className="container">
          <Rail variant="city" title={home.popular.title} sub={home.popular.sub} more={{ href: "/destinations", label: "View All Destinations" }}>
            {popular.map((d) => <CityCard key={d.slug} d={d} />)}
          </Rail>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Rail variant="pkg" title={home.featured.title} sub={home.featured.sub} more={{ href: "/packages", label: "View All Packages" }}>
            {featured.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}
          </Rail>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Rail variant="pkg" title="Domestic Tour Packages" sub={`${domestic.length} packages available`} more={{ href: "/domestic-tours" }}>
            {domestic.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}
          </Rail>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Rail variant="pkg" title="International Tour Packages" sub={`${international.length} packages available`} more={{ href: "/international-tours" }}>
            {international.map((p) => <PackageCard key={p.slug} p={toCard(p)} />)}
          </Rail>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>{home.why.title}</h2><p>{home.why.sub}</p></div></div>
          <div className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__emoji" aria-hidden="true">{s.emoji}</div>
                <strong>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="features">
            {whyChoose.map((f) => (
              <div key={f.title} className="feature">
                <span className="feature__emoji" aria-hidden="true">{f.emoji}</span>
                <div><h3>{f.title}</h3><p>{f.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="strip">
          <div className="strip__icon" aria-hidden="true">🧭</div>
          <div><h3>{home.custom.title}</h3><p>{home.custom.sub}</p></div>
          <Link className="btn btn--black" href="/itinerary-builder">{home.custom.cta}</Link>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <Rail variant="reviews" title={home.guests.title} sub={home.guests.sub} more={{ href: contact.social.youtube, label: "YouTube" }}>
            {testimonials.map((r) => (
              <article key={r.video} className="review">
                <a className="review__video" href={`https://www.youtube.com/shorts/${r.video}`} target="_blank" rel="noopener">
                  <Image src={`https://i.ytimg.com/vi/${r.video}/hqdefault.jpg`} alt="" fill sizes="400px" />
                  <span className="review__play"><span><Icon name="play" /></span></span>
                  <span className="review__vtitle">{r.videoTitle}</span>
                </a>
                <div className="review__body">
                  <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                  <div className="review__who">
                    <span className="avatar">{r.name[0]}</span>
                    <span><strong>{r.name}</strong><small>{r.meta}</small></span>
                  </div>
                </div>
              </article>
            ))}
          </Rail>
        </div>
      </section>

      <section className="plan">
        <div className="plan__bg" style={{ backgroundImage: `url(${banners[2]?.image})` }} />
        <div className="container">
          <div className="plan__copy">
            <small>{aboutText.kicker}</small>
            <h2>{aboutText.heading}</h2>
            {aboutText.paragraphs.map((t) => <p key={t}>{t}</p>)}
            <div className="plan__actions">
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" /> Chat on WhatsApp</a>
              <a className="btn btn--white" href={contact.phoneHref}><Icon name="phone" /> {contact.phone}</a>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Rail variant="blog" title={home.blog.title} sub={home.blog.sub} more={{ href: "/blog", label: "View All Articles" }}>
            {posts.slice(0, 9).map((p) => (
              <Link key={p.slug} className="post" href={`/blog/${p.slug}`}>
                <div className="post__img">{p.image && <Image src={p.image} alt={p.title} width={600} height={375} />}</div>
                <small>{p.category} · {p.date}</small>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </Rail>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="shead">
            <div><h2>{home.faq.title}</h2><p>{home.faq.sub}</p></div>
            <div className="shead__nav"><Link className="viewall" href="/faq">FAQ</Link></div>
          </div>
          <Faq groups={faqGroups} />
          <div className="strip" style={{ marginTop: 24 }}>
            <div className="strip__icon" aria-hidden="true">💬</div>
            <div><h3>{home.stillQ.title}</h3><p>{home.stillQ.sub}</p></div>
            <Link className="btn btn--black" href="/contact-us">Contact Us</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>Explore Destinations</h2></div></div>
          <Directory destinations={destinations} />
        </div>
      </section>
    </>
  );
}
