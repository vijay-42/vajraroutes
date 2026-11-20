"use client";

import { useId, useState } from "react";
import { waLink } from "@/data/site";
import Icon from "./Icon";

/**
 * "Get a free quote" form — same fields and wording as the live site.
 * The live site posts to its own CRM (with reCAPTCHA); until that is wired up,
 * submitting opens WhatsApp with the details filled in.
 */
export default function EnquiryForm({
  defaultDestination = "", title = "Get a free quote", sub = "No spam. Just a quick call from a real travel expert.",
  submitLabel = "Submit Enquiry",
}: { defaultDestination?: string; title?: string; sub?: string; submitLabel?: string }) {
  const [sent, setSent] = useState(false);
  const id = useId();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const text = [
      `Enquiry from vajraroutes.com`,
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email}`,
      d.destination && `Interested Destination: ${d.destination}`,
      d.date && `Travel Date: ${d.date}`,
      d.travellers && `Travelers: ${d.travellers}`,
      d.message && `Message: ${d.message}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank", "noopener");
    setSent(true);
  }

  return (
    <form className={`form ${sent ? "is-sent" : ""}`} onSubmit={onSubmit}>
      <h3>{title}</h3>
      {sub && <p>{sub}</p>}
      <div className="field">
        <label htmlFor={`${id}-n`}>Your Name *</label>
        <input id={`${id}-n`} name="name" required placeholder="Ravi Prakash" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-p`}>Phone *</label>
        <input id={`${id}-p`} name="phone" type="tel" required placeholder="94806 23055" autoComplete="tel" />
      </div>
      <div className="field full">
        <label htmlFor={`${id}-e`}>Email *</label>
        <input id={`${id}-e`} name="email" type="email" required placeholder="your@email.com" autoComplete="email" />
      </div>
      <div className="field full">
        <label htmlFor={`${id}-d`}>Interested Destination <small>(optional)</small></label>
        <input id={`${id}-d`} name="destination" defaultValue={defaultDestination} placeholder="e.g. Jagannath Puri Yathra" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-t`}>Travel Date <small>(optional)</small></label>
        <input id={`${id}-t`} name="date" type="date" />
      </div>
      <div className="field">
        <label htmlFor={`${id}-c`}>Travelers <small>(optional)</small></label>
        <input id={`${id}-c`} name="travellers" type="number" min={1} />
      </div>
      <div className="field full">
        <label htmlFor={`${id}-m`}>Message <small>(optional)</small></label>
        <textarea id={`${id}-m`} name="message" placeholder="Travel dates, group size, budget..." />
      </div>
      <button className="btn btn--black btn--lg full" type="submit">
        <Icon name="whatsapp" /> {submitLabel}
      </button>
      <div className="form__ok">Thank you! WhatsApp has opened with your enquiry — just press send.</div>
    </form>
  );
}
