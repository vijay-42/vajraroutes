import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import PageHero from "@/components/PageHero";
import { home } from "@/data/site";
import { faqGroups } from "@/lib/content";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <>
      <PageHero title={home.faq.title} sub={home.faq.sub} crumbs={[{ label: "FAQ" }]} />
      <section className="section">
        <div className="container narrow">
          <Faq groups={faqGroups} />
          <div className="strip" style={{ marginTop: 28 }}>
            <div className="strip__icon" aria-hidden="true">💬</div>
            <div><h3>{home.stillQ.title}</h3><p>{home.stillQ.sub}</p></div>
            <Link className="btn btn--black" href="/contact-us">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
