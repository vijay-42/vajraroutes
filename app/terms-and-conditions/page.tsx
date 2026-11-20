import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { policies } from "@/lib/content";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" crumbs={[{ label: "Terms & Conditions" }]} />
      <section className="section">
        <div className="container narrow">
          <div className="box rich" dangerouslySetInnerHTML={{ __html: policies["terms-and-conditions"] }} />
        </div>
      </section>
    </>
  );
}
