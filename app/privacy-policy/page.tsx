import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { policies } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} />
      <section className="section">
        <div className="container narrow">
          <div className="box rich" dangerouslySetInnerHTML={{ __html: policies["privacy-policy"] }} />
        </div>
      </section>
    </>
  );
}
