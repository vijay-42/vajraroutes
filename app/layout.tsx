import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import Floating from "@/components/Floating";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { QuoteProvider } from "@/components/Quote";
import { contact } from "@/data/site";
import "./globals.css";

const sans = Montserrat({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const SITE = "https://vajraroutes.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Vajra Routes - Your Journey to Spiritual Destinations", template: "%s - Vajra Routes" },
  description: "Discover spiritual destinations with Vajra Routes. Best pilgrimage and adventure tour packages at affordable prices.",
  openGraph: { siteName: "Vajra Routes", type: "website" },
  icons: { icon: "/img/logo.jpg" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Vajra Routes",
  url: SITE,
  logo: `${SITE}/images/logo.jpg`,
  telephone: contact.phone,
  email: contact.email,
  address: { "@type": "PostalAddress", streetAddress: "#582, 4th Cross, 7th Main Road, HMT Layout", addressLocality: "Bangalore", postalCode: "560032", addressCountry: "IN" },
  sameAs: Object.values(contact.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <QuoteProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Floating />
        </QuoteProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
