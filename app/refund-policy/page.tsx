import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { policies } from "@/lib/content";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero title="Refund & Cancellation Policy" crumbs={[{ label: "Refund & Cancellation Policy" }]} />
      <section className="section">
        <div className="container narrow">
          <div className="box rich" dangerouslySetInnerHTML={{ __html: policies["refund-policy"] }} />
        </div>
      </section>
    </>
  );
}
