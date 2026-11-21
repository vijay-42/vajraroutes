// Site-wide copy. All text below is taken verbatim from vajraroutes.com.

export const contact = {
  phone: "+91 94806 23055",
  phoneHref: "tel:+919480623055",
  whatsapp: "919901295366",
  email: "info@vajraroutes.com",
  address: "#582, 4th Cross, 7th Main Road, HMT Layout, Bangalore - 560032",
  social: {
    facebook: "https://www.facebook.com/people/Vajra-Routes/61591281523804/",
    instagram: "https://www.instagram.com/vajraroutes/",
    youtube: "https://www.youtube.com/@VajraRoutes",
  },
};

export const waLink = (text = "Hi Vajra Routes") =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;

export type IconName =
  | "temple" | "heart" | "users" | "mountain" | "group" | "globe" | "plane" | "hotel"
  | "camera" | "car" | "pin" | "clock" | "search" | "calendar" | "phone" | "mail"
  | "whatsapp" | "shield" | "tag" | "headset" | "edit" | "chevronDown" | "chevronLeft"
  | "chevronRight" | "arrowRight" | "menu" | "close" | "plus" | "play" | "check"
  | "facebook" | "instagram" | "youtube" | "map" | "sparkle";

/** Header category pills — the live site's navigation items. */
export const nav = [
  { emoji: "🏔️", label: "Domestic Tours", href: "/domestic-tours" },
  { emoji: "✈️", label: "International Tours", href: "/international-tours" },
  { emoji: "✨", label: "Specialty Packages", href: "/specialty-packages" },
  { emoji: "📅", label: "Upcoming Trips", href: "/upcoming-trips" },
  { emoji: "📖", label: "Blog", href: "/blog" },
];

export const home = {
  popular: { title: "Popular Destinations", sub: "Explore India's most sacred and beautiful locations" },
  featured: { title: "Featured Tour Packages", sub: "Handpicked spiritual journeys for an unforgettable experience" },
  why: { title: "Why Choose Vajra Routes?", sub: "We make your spiritual journey comfortable and memorable" },
  custom: { title: "Create Your Custom Itinerary", sub: "Can't find the perfect package? Design your own itinerary and get a personalized quote.", cta: "Build Itinerary" },
  guests: { title: "What Our Guests Say", sub: "Insights and testimonials from our Guests" },
  blog: { title: "Travel Blog", sub: "Tips, guides, and stories from our travels" },
  faq: { title: "Frequently Asked Questions", sub: "Find answers to common questions about our services" },
  stillQ: { title: "Still Have Questions?", sub: "Can't find the answer you're looking for? Please contact our support team." },
  newsletter: { title: "Subscribe to Our Newsletter", sub: "Get the latest travel updates, special offers, and spiritual journey inspiration." },
};

export const stats = [
  { emoji: "🎒", value: "34+", label: "Tour Packages" },
  { emoji: "🗺️", value: "36+", label: "Destinations" },
  { emoji: "🙏", value: "1,00,000+", label: "Happy Travelers" },
  { emoji: "🏅", value: "10+", label: "Years Experience" },
  { emoji: "⭐", value: "4.9", label: "Rating" },
  { emoji: "💯", value: "100%", label: "Satisfaction" },
];

export const whyChoose = [
  { emoji: "🛡️", title: "Safe & Secure", text: "Your safety is our priority. Verified hotels, professional guides, and 24/7 support." },
  { emoji: "🏷️", title: "Best Price Guarantee", text: "Competitive prices with no hidden charges. Get the best value for your money." },
  { emoji: "🎧", title: "24/7 Support", text: "Our dedicated team is always available to assist you throughout your journey." },
];

export const testimonials = [
  {
    video: "B1zGrqbUVDE",
    videoTitle: "Kashi Vishwanath Darshan 2026 | Ganga Aarti | Manikarnika Ghat | Complete Kashi Yatra Experience",
    quote: "Mysore Palace is an amazing place to visit. The architecture is beautiful and the palace looks very royal with detailed designs everywhere. The interiors are well maintained and full of history. The lighting in the evening makes the palace look even more stunning. It can get crowded sometimes, but it’s definitely worth visiting at least once.",
    name: "Abhishek M K", meta: "Mysore",
  },
  {
    video: "MSdvHaLv2ic",
    videoTitle: "Guwahati & Brahmaputra Cruise Experience | Vajra Routes",
    quote: "The Kashmir Honeymoon package was absolutely magical. The houseboat stay on Dal Lake was a dream come true. Vajra Routes arranged everything perfectly — from the shikara rides to the Sonmarg trip. Highly recommended!",
    name: "Ravi Sharma", meta: "Software Engineer, Bangalore",
  },
  {
    video: "dB0BgkPCCW4",
    videoTitle: "Great trip video",
    quote: "We booked the Bali Honeymoon Retreat and it exceeded all our expectations. The private pool villa was stunning, the spa treatment was heavenly, and the sunrise trek on Mount Batur was the highlight of our trip. Worth every penny!",
    name: "Priya & Arjun Mehta", meta: "Couple, Mumbai",
  },
];

/** Header dropdown collections (from the client's package sheet). Each links to
 *  /{region}-tours/{key}-packages-from-bangalore; `match` picks its packages by title/destination. */
export type Collection = { key: string; label: string; match: RegExp };
export const collections: { domestic: Collection[]; international: Collection[] } = {
  domestic: [
    { key: "shirdi", label: "Shirdi tour packages from Bangalore", match: /shirdi/i },
    { key: "varanasi-kashi", label: "Varanasi/Kashi tour packages from Bangalore", match: /varanasi|kashi/i },
    { key: "puri-jagannath", label: "Puri Jagannath tour packages from Bangalore", match: /puri|jagannath/i },
    { key: "kamakhya", label: "Kamakhya tour packages from Bangalore", match: /kamakhya/i },
    { key: "rajasthan", label: "Rajasthan tour packages from Bangalore", match: /rajasthan|jaipur|udaipur|pushkar/i },
    { key: "shimla-manali", label: "Shimla Manali tour packages from Bangalore", match: /shimla|manali/i },
    { key: "kashmir", label: "Kashmir tour packages from Bangalore", match: /kashmir/i },
    { key: "vaishnodevi", label: "Vaishnodevi tour packages from Bangalore", match: /vaishno/i },
    { key: "indore-ujjain", label: "Indore Ujjain tour packages from Bangalore", match: /ujjain|indore|omkareshwar/i },
    { key: "ayodhya", label: "Ayodhya tour packages from Bangalore", match: /ayodhya/i },
    { key: "baidyanath", label: "Baidyanath tour packages from Bangalore", match: /baidyanath|baidhyanath|deoghar/i },
    { key: "darjeeling", label: "Darjeeling tour packages from Bangalore", match: /darjeeling/i },
  ],
  international: [
    { key: "nepal", label: "Nepal tour packages from Bangalore", match: /nepal|muktinath|kathmandu/i },
    { key: "bhutan", label: "Bhutan tour packages from Bangalore", match: /bhutan/i },
    { key: "kailash-mansarovar", label: "Kailash Mansarovar tour packages from Bangalore", match: /kailash/i },
    { key: "phu-quoc", label: "Phu Quoc tour packages from Bangalore", match: /phu quoc/i },
    { key: "vietnam", label: "Vietnam tour packages from Bangalore", match: /vietnam/i },
    { key: "bali", label: "Bali tour packages from Bangalore", match: /bali/i },
    { key: "japan", label: "Japan tour packages from Bangalore", match: /japan/i },
    { key: "maldives", label: "Maldives tour packages from Bangalore", match: /maldives/i },
    { key: "georgia", label: "Georgia tour packages from Bangalore", match: /georgia/i },
    { key: "baku", label: "Baku tour packages from Bangalore", match: /baku|azerbaijan/i },
    { key: "thailand", label: "Thailand tour packages from Bangalore", match: /thailand|bangkok|phuket/i },
  ],
};
