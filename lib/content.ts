// Typed access to data/content.json — every value in it was extracted from vajraroutes.com.
import raw from "@/data/content.json";

export type Itinerary = { day: string; title: string; lines: string[] };
export type Package = {
  slug: string; title: string; duration: string; destination: string; destinationSlug: string | null;
  type: string; travellers: string; region: "Domestic" | "International";
  oldPrice: number | null; price: number | null; off: number | null;
  aboutHtml: string; excerpt: string; highlights: string[]; itinerary: Itinerary[];
  inclusions: string[]; exclusions: string[]; images: string[]; metaDescription: string;
};
export type Destination = {
  slug: string; name: string; count: number; image: string | null; region: "Domestic" | "International";
  description?: string; packages?: string[];
};
export type Post = {
  slug: string; title: string; category?: string; date?: string; excerpt?: string; image?: string | null;
  lead?: string; contentHtml?: string; metaDescription?: string;
};
export type FaqGroup = { title: string; items: { q: string; a: string }[] };
export type Banner = { image: string; tag: string; title: string; buttons: { href: string; label: string }[] };

const data = raw as unknown as {
  banners: Banner[]; destinations: Destination[]; packages: Package[]; blog: Post[]; faqGroups: FaqGroup[];
  about: string[]; contact: string[]; gallery: { lines: string[]; albums: { href: string; image: string }[] };
  policies: Record<string, string>;
};

export const packages = data.packages;
export const destinations = data.destinations;
export const posts = data.blog;
export const faqGroups = data.faqGroups;
export const policies = data.policies;
export const gallery = data.gallery;
export const about = data.about;
/** About-page copy, picked out by its headings so changes in order don't break it. */
const after = (label: string, n = 1) => { const i = about.indexOf(label); return i >= 0 ? about.slice(i + 1, i + 1 + n) : []; };
export const aboutText = {
  kicker: "About Vajra Routes",
  tagline: after("About Vajra Routes")[0] ?? "",
  heading: "Your Journey to Spiritual Destinations",
  paragraphs: after("Your Journey to Spiritual Destinations", 3),
  mission: after("Our Mission")[0] ?? "",
  vision: after("Our Vision")[0] ?? "",
  why: [
    { title: "Safe & Secure", text: after("Safe & Secure")[0] ?? "" },
    { title: "Best Price", text: after("Best Price")[0] ?? "" },
    { title: "24/7 Support", text: after("24/7 Support")[0] ?? "" },
  ],
};

/** Turn the live site's banner links into routes on this site. */
function localHref(href: string) {
  const u = href.replace("https://vajraroutes.com", "").replace(/^(?!\/)/, "/");
  const dest = u.match(/destination=([a-z0-9-]+)/);
  if (dest) return `/destinations/${dest[1]}`;
  return u;
}
export const banners = data.banners.map((b) => ({ ...b, buttons: b.buttons.map((x) => ({ ...x, href: localHref(x.href) })) }));

export const getPackage = (slug: string) => packages.find((p) => p.slug === slug);
export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const packagesIn = (d: Destination) =>
  (d.packages ?? []).map(getPackage).filter(Boolean) as Package[];

/** Featured packages, in the order the live homepage shows them. */
export const featuredSlugs = [
  "all-inclusive-jagannath-puri-divine-yatra-including-flights",
  "7-days-6-nights-premium-all-inclusive-rajasthan-experience",
  "azerbaijan-tour-package-4-nights-5-days-baku-shamakhi-gobustan",
  "azerbaijan-tour-package-4-nights-5-days-baku-gabala-gobustan",
  "kailash-mansarovar-aerial-darshan-tour-package-2-nights-3-days-nepalgunj",
  "nepal-muktinath-pilgrimage-tour-package-7-nights-8-days-janakpur-kathmandu-pokhara-muktinath-lumbini",
];
export const featured = featuredSlugs.map(getPackage).filter(Boolean) as Package[];

export const durationDays = (p: Package) => parseInt(p.duration) || 0;
export const shortDuration = (p: Package) => {
  const m = p.duration.match(/(\d+)\s*Days?\s*\/\s*(\d+)\s*Nights?/);
  return m ? `${m[1]}D/${m[2]}N` : p.duration;
};
export const inr = (n: number | null) => (n == null ? "" : "₹" + n.toLocaleString("en-IN"));
export const firstImage = (p: Package) => p.images[0] ?? null;

/* ---------- Card view model: only what a tour card needs ---------- */
export type Perk = "Flights" | "Hotel" | "Meals" | "Sightseeing" | "Transfers";
export type CardPkg = {
  slug: string; title: string; duration: string; short: string; days: number;
  destination: string; destinationSlug: string | null; label: string; region: Package["region"];
  price: number | null; oldPrice: number | null; off: number | null; image: string | null; perks: Perk[];
};

const perkTests: [Perk, RegExp][] = [
  ["Flights", /flight/i],
  ["Hotel", /hotel|accommodation|resort|houseboat|stay/i],
  ["Meals", /breakfast|lunch|dinner|meal/i],
  ["Sightseeing", /sightseeing|darshan|excursion|cruise|tour of|visit/i],
  ["Transfers", /transfer|vehicle|cab\b|transport|pick.?up/i],
];

/** Label chip: the package's own type (first part), or its region when the type is generic. */
function cardLabel(p: Package) {
  const first = p.type.split(/[,/]/)[0].trim();
  return !first || /^(standard|domestic tour package)$/i.test(first) ? p.region : first;
}

export function toCard(p: Package): CardPkg {
  const inc = p.inclusions.join(" | ") + " | " + p.title;
  return {
    slug: p.slug, title: p.title, duration: p.duration, short: shortDuration(p), days: durationDays(p),
    destination: p.destination, destinationSlug: p.destinationSlug, label: cardLabel(p), region: p.region,
    price: p.price, oldPrice: p.oldPrice, off: p.off, image: firstImage(p),
    perks: perkTests.filter(([, re]) => re.test(inc)).map(([k]) => k),
  };
}

/* ---------- Header mega-menu (built on the server, passed to the client header) ---------- */
export type MenuDest = { slug: string; name: string; count: number; image: string | null };
export type MenuPkg = { slug: string; title: string; duration: string; price: number | null; image: string | null };
export type NavMenu = { domesticDest: MenuDest[]; internationalDest: MenuDest[]; domestic: MenuPkg[]; international: MenuPkg[] };

/** Drop the site's repeated "… Tour Package(s) from Bangalore" tail so names fit a menu. */
const menuName = (n: string) =>
  n.replace(/\s*(tour\s+)?packages?\s+from\s+bangalore.*$/i, "").replace(/\s*tour\s+packages?$/i, "").trim() || n;

/** A destination's region, taken from its packages (more reliable than the listing's own tag). */
function destRegion(d: Destination): Package["region"] {
  const list = packagesIn(d);
  if (!list.length) return d.region;
  return list.filter((p) => p.region === "International").length > list.length / 2 ? "International" : "Domestic";
}

export function navMenu(): NavMenu {
  const dests = destinations.filter((d) => d.count > 0);
  const toDest = (d: Destination): MenuDest => ({
    slug: d.slug, name: menuName(d.name), count: d.count,
    image: d.image ?? packagesIn(d).map(firstImage).find(Boolean) ?? null, // no cover on the site → its first package photo
  });
  const toPkg = (p: Package): MenuPkg => ({ slug: p.slug, title: p.title, duration: p.duration, price: p.price, image: firstImage(p) });
  const byName = (a: MenuDest, b: MenuDest) => a.name.localeCompare(b.name);
  return {
    domesticDest: dests.filter((d) => destRegion(d) === "Domestic").map(toDest).sort(byName),
    internationalDest: dests.filter((d) => destRegion(d) === "International").map(toDest).sort(byName),
    domestic: packages.filter((p) => p.region === "Domestic").map(toPkg),
    international: packages.filter((p) => p.region === "International").map(toPkg),
  };
}
