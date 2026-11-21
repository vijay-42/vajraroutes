// Typed access to data/content.json — every value in it was extracted from vajraroutes.com.
import raw from "@/data/content.json";
import { collections, type Collection } from "@/data/site";

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

/* ---------- Upcoming trips ----------
   The live site has no departure calendar, so these are its scheduled group departures:
   packages typed "Group Tours" and the "Join In" packages. */
export const upcoming = packages.filter((p) => /group tour/i.test(p.type) || /join.?in/i.test(p.title));

/* ---------- Specialty packages ----------
   Grouped by the tour type each package carries on the live site ("Pilgrimage",
   "Spiritual Tour Package", "Family / Honeymoon / Leisure", "Group Tours", ...).
   Generic types ("Standard", "Deluxe", "Domestic Tour Package") aren't specialties. */
export type Specialty = { slug: string; label: string; emoji: string; test: (p: Package) => boolean };
const typeHas = (word: RegExp) => (p: Package) => p.type.split(/[,/]/).some((t) => word.test(t.trim()));
const pilgrimTitle = /pilgrimage|yatra|darshan|jyotirlinga|temple|vaishno devi/i;

export const specialties: Specialty[] = [
  { slug: "pilgrimage", label: "Pilgrimage & Spiritual", emoji: "🛕",
    test: (p) => typeHas(/^(pilgrimage|spiritual tour package)$/i)(p) || pilgrimTitle.test(p.title) },
  { slug: "honeymoon", label: "Honeymoon", emoji: "💑", test: typeHas(/^honeymoon$/i) },
  { slug: "family", label: "Family", emoji: "👨‍👩‍👧", test: typeHas(/^family$/i) },
  { slug: "leisure", label: "Leisure", emoji: "🏖️", test: typeHas(/^leisure$/i) },
  { slug: "adventure", label: "Adventure", emoji: "🏔️", test: typeHas(/^adventure$/i) },
  { slug: "friends", label: "Friends", emoji: "🧑‍🤝‍🧑", test: typeHas(/^friends$/i) },
  { slug: "group-tours", label: "Group Tours", emoji: "👥", test: typeHas(/^group tours?$/i) },
];
export const getSpecialty = (slug: string) => specialties.find((s) => s.slug === slug);
export const packagesFor = (s: Specialty) => packages.filter(s.test);

/** One card per specialty, each with a cover photo not already used by an earlier one where possible. */
export type SpecialtyCard = { slug: string; label: string; emoji: string; count: number; image: string | null };
export function specialtyCards(): SpecialtyCard[] {
  const used = new Set<string>();
  return specialties.map((s) => {
    const items = packagesFor(s);
    const pick = items.map(firstImage).find((img) => img && !used.has(img)) ?? (items[0] ? firstImage(items[0]) : null);
    if (pick) used.add(pick);
    return { slug: s.slug, label: s.label, emoji: s.emoji, count: items.length, image: pick };
  }).filter((c) => c.count > 0);
}

/* ---------- Destination collections (header dropdowns) ---------- */
export type Region = "domestic" | "international";
export const regionLabel: Record<Region, string> = { domestic: "Domestic", international: "International" };
export const collectionSlug = (c: Collection) => `${c.key}-packages-from-bangalore`;
export const collectionHref = (r: Region, c: Collection) => `/${r}-tours/${collectionSlug(c)}`;
export const getCollection = (r: Region, slug: string) => collections[r].find((c) => collectionSlug(c) === slug);
export const packagesInCollection = (r: Region, c: Collection) =>
  packages.filter((p) => p.region === regionLabel[r] && c.match.test(`${p.title} ${p.destination}`));
export type MenuLink = { href: string; label: string; count: number };
const menuLinks = (r: Region): MenuLink[] =>
  collections[r].map((c) => ({ href: collectionHref(r, c), label: c.label, count: packagesInCollection(r, c).length }));

/* ---------- Header mega-menu (built on the server, passed to the client header) ---------- */
export type MenuPkg = { slug: string; title: string; duration: string; price: number | null; image: string | null };
export type NavMenu = { domestic: MenuLink[]; international: MenuLink[]; upcoming: MenuPkg[]; specialty: SpecialtyCard[] };

export function navMenu(): NavMenu {
  const toPkg = (p: Package): MenuPkg => ({ slug: p.slug, title: p.title, duration: p.duration, price: p.price, image: firstImage(p) });
  return {
    domestic: menuLinks("domestic"),
    international: menuLinks("international"),
    upcoming: upcoming.map(toPkg),
    specialty: specialtyCards(),
  };
}
