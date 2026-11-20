import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import { contact, waLink } from "@/data/site";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" sub="Get in touch with our travel experts" crumbs={[{ label: "Contact Us" }]} />
      <section className="section">
        <div className="container contact">
          <div className="box">
            <h2 className="h3">Contact Information</h2>
            <ul className="cinfo">
              <li><span><Icon name="phone" /></span><div><small>Phone</small><a href={contact.phoneHref}>{contact.phone}</a></div></li>
              <li><span><Icon name="mail" /></span><div><small>Email</small><a href={`mailto:${contact.email}`}>{contact.email}</a></div></li>
              <li><span><Icon name="pin" /></span><div><small>Address</small><p>{contact.address}</p></div></li>
            </ul>
            <h3 className="h4">Follow Us</h3>
            <div className="social">
              <a href={contact.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a>
              <a href={contact.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" /></a>
              <a href={contact.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" /></a>
            </div>
            <a className="btn btn--wa btn--block" style={{ marginTop: 20 }} href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" /> Chat on WhatsApp</a>
          </div>
          <ContactForm />
        </div>
        <div className="container">
          <h2 className="h3" style={{ margin: "36px 0 14px" }}>Find Us</h2>
          <div className="map">
            <iframe title="Vajra Routes location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`} />
          </div>
        </div>
      </section>
    </>
  );
}
