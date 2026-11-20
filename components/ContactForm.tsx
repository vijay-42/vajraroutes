"use client";

import { useState } from "react";
import { contact } from "@/data/site";

/** "Send us a Message" — same fields as the live contact page; opens the visitor's email app. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = `${d.message}\n\n${d.name}\n${d.email}${d.phone ? `\n${d.phone}` : ""}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(d.subject || "Enquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className={`form ${sent ? "is-sent" : ""}`} onSubmit={onSubmit}>
      <h3>Send us a Message</h3>
      <div className="field"><label htmlFor="c-n">Your Name *</label><input id="c-n" name="name" required /></div>
      <div className="field"><label htmlFor="c-e">Your Email *</label><input id="c-e" name="email" type="email" required /></div>
      <div className="field"><label htmlFor="c-p">Phone Number</label><input id="c-p" name="phone" type="tel" /></div>
      <div className="field"><label htmlFor="c-s">Subject</label><input id="c-s" name="subject" /></div>
      <div className="field full"><label htmlFor="c-m">Message *</label><textarea id="c-m" name="message" required rows={5} /></div>
      <button className="btn btn--black btn--lg full" type="submit">Send Message</button>
      <div className="form__ok">Your email app has opened with the message — just press send.</div>
    </form>
  );
}
