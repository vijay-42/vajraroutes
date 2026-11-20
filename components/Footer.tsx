import Image from "next/image";
import Link from "next/link";
import { contact, home } from "@/data/site";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Image src="/img/logo.jpg" alt="Vajra Routes logo" width={82} height={56} />
            <h4>Your Journey to Spiritual Destinations</h4>
            <p>Your trusted partner for spiritual journeys and adventure tours across India&apos;s most sacred destinations.</p>
            <div className="social">
              <a href={contact.social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a>
              <a href={contact.social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" /></a>
              <a href={contact.social.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon name="youtube" /></a>
            </div>
            <div className="footer__gov">
              <Image src="/img/goi.png" alt="Government of India" width={80} height={39} />
              <Image src="/img/gok.png" alt="Government of Karnataka" width={115} height={39} />
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/packages">Tour Packages</Link></li>
              <li><Link href="/destinations">Destinations</Link></li>
              <li><Link href="/itinerary-builder">Custom Itinerary</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/terms-and-conditions">Terms</Link></li>
              <li><Link href="/privacy-policy">Privacy</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul className="footer__contact">
              <li><Icon name="phone" /><a href={contact.phoneHref}>{contact.phone}</a></li>
              <li><Icon name="mail" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li><Icon name="pin" /><span>{contact.address}</span></li>
            </ul>
          </div>
          <div>
            <h4>{home.newsletter.title}</h4>
            <p>{home.newsletter.sub}</p>
            <form className="newsletter" action="https://vajraroutes.com/newsletter/subscribe" method="post">
              <label htmlFor="nl" className="sr-only">Email</label>
              <input id="nl" type="email" name="email" placeholder="Enter your email" required />
              <button className="btn btn--black btn--sm" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Vajra Routes. All rights reserved.</span>
          <nav>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
