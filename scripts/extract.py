"""Extract all vajraroutes.com content from crawled HTML into one JSON file.
Usage: python3 scripts/extract.py .cache/pages data/content.json
"""
import re, html, json, os, sys

P = sys.argv[1]          # pages dir
OUT = sys.argv[2]        # output json
B = "https://vajraroutes.com"


def rd(name):
    fn = os.path.join(P, name + ".html")
    return open(fn, encoding="utf-8", errors="ignore").read() if os.path.exists(fn) else ""


def txt(s):
    s = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", "", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"[ \t ]+", " ", s).strip()


def lines(s):
    s = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", "", s, flags=re.S)
    s = re.sub(r"</(p|li|div|h[1-6]|tr)>|<br\s*/?>", "\n", s)
    s = html.unescape(re.sub(r"<[^>]+>", "", s))
    return [re.sub(r"\s+", " ", x).strip() for x in s.split("\n") if x.strip()]


def main_of(s):
    a, b = s.find("<main"), s.find("</main>")
    m = s[a:b] if a >= 0 else s
    return re.sub(r"<!--.*?-->", "", m, flags=re.S)


ALLOWED = {"p", "h2", "h3", "h4", "h5", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br",
           "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "hr", "figure", "figcaption"}


def clean_html(s):
    """Keep simple formatting tags only; drop attributes except href/src/alt."""
    s = re.sub(r"<(script|style|svg|form|button|iframe|noscript)[^>]*>.*?</\1>", "", s, flags=re.S | re.I)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)

    def tag(m):
        close, name, attrs = m.group(1), m.group(2).lower(), m.group(3) or ""
        if name == "h1":
            name = "h2"
        if name not in ALLOWED:
            return ""
        if close:
            return f"</{name}>"
        keep = []
        for k in ("href", "src", "alt"):
            mm = re.search(rf'{k}\s*=\s*"([^"]*)"', attrs)
            if mm:
                keep.append(f'{k}="{mm.group(1)}"')
        return f"<{name}{(' ' + ' '.join(keep)) if keep else ''}>"

    s = re.sub(r"<(/?)([a-zA-Z0-9]+)([^>]*)>", tag, s)
    s = re.sub(r"<(p|li|strong|em|b|i)>\s*</\1>", "", s)
    return re.sub(r"\n\s*\n+", "\n", s).strip()


def block(s, start_pat, end_pats):
    m = re.search(start_pat, s)
    if not m:
        return ""
    rest = s[m.end():]
    ends = [rest.find(e) for e in end_pats if rest.find(e) >= 0]
    return rest[: min(ends)] if ends else rest


def money(x):
    return int(float(x.replace(",", ""))) if x else None


slugs = [l.split(" ", 1) for l in open(os.path.join(P, "_slugs.txt")).read().split("\n") if l]

# ---------------- Destinations (listing) ----------------
dlist = rd("destinations")
dm = main_of(dlist)
region_split = dm.find("International Destinations")
destinations = {}
for b in re.split(r'(?=<div class="col[^"]*">)', dm):
    m = re.search(r"/destinations/([a-z0-9-]+)", b)
    if not m:
        continue
    slug = m.group(1)
    if slug in destinations:
        continue
    img = re.search(r"(https://vajraroutes\.com/uploads/destinations/[^\"' )]+)", b)
    l = lines(b)
    cnt = next((int(x.split()[0]) for x in l if re.match(r"^\d+ Tour Packages", x)), 0)
    destinations[slug] = {
        "slug": slug, "name": l[0] if l else slug, "count": cnt,
        "image": img.group(1) if img else None,
        "region": "International" if dm.find(b) > region_split > 0 else "Domestic",
    }

# Destination detail pages
for kind, slug in slugs:
    if kind != "D":
        continue
    s = rd("destinations__" + slug)
    if not s:
        continue
    m = main_of(s)
    d = destinations.setdefault(slug, {"slug": slug, "region": "Domestic", "count": 0, "image": None})
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", m, re.S)
    d["name"] = txt(h1.group(1)) if h1 else d.get("name", slug)
    desc = re.search(r'class="destination-description[^"]*">(.*?)</div>', m, re.S)
    d["description"] = clean_html(desc.group(1)) if desc else ""
    hero = re.search(r"background-image:\s*url\('([^']+)'\)", m)
    if not d.get("image") and hero and "/uploads/" in hero.group(1):
        d["image"] = hero.group(1)
    d["packages"] = list(dict.fromkeys(re.findall(r"vajraroutes\.com/packages/([a-z0-9-]{12,})", m)))

# ---------------- Packages ----------------
listing_region = {}
for name, region in [("packages__domestic", "Domestic"), ("packages__domestic_q_page-2", "Domestic"),
                     ("packages__international", "International"), ("packages__international_q_page-2", "International")]:
    for sl in re.findall(r"vajraroutes\.com/packages/([a-z0-9-]{12,})", main_of(rd(name))):
        listing_region.setdefault(sl, region)

# short excerpts from listing cards
excerpts = {}
for name in ["packages", "packages_q_page-2", "packages_q_page-3", "packages__domestic", "packages__domestic_q_page-2",
             "packages__international", "packages__international_q_page-2"]:
    for b in re.split(r'(?=<div class="col[^"]*">)', main_of(rd(name))):
        m = re.search(r"vajraroutes\.com/packages/([a-z0-9-]{12,})", b)
        if m:
            ex = next((x for x in lines(b) if x.endswith("…")), None)
            if ex:
                excerpts.setdefault(m.group(1), ex)

packages = {}
for kind, slug in slugs:
    if kind != "P":
        continue
    s = rd("packages__" + slug)
    if not s or "About This Tour" not in s and "Day-wise Itinerary" not in s:
        continue
    m = main_of(s)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", m, re.S)
    title = txt(h1.group(1)) if h1 else slug
    quick = block(m, r"bi-clock fs-3", ["About This Tour"])
    ql = lines(quick)
    days = next((x for x in ql if re.match(r"^\d+ Days?$", x)), "")
    nights = next((x for x in ql if re.match(r"^/ \d+ Nights?$", x)), "")
    duration = f"{days} {nights}".replace("  ", " ").strip() if days else ""
    def before(label):
        i = ql.index(label) if label in ql else -1
        return ql[i - 1] if i > 0 else ""
    dest_name = before("Destination")
    ptype = before("Type")
    travellers = before("Travelers")
    about = block(m, r"About This Tour</h4>", ["<h4", "Day-wise Itinerary"])
    hl = block(m, r"Tour Highlights</h4>", ["<h4", "Inclusions</h5>"])
    highlights = [txt(x) for x in re.findall(r"<li[^>]*>(.*?)</li>", hl, re.S) if txt(x)] or [x for x in lines(hl) if x]
    itin = []
    for it in re.split(r'<div class="accordion-item', block(m, r"Day-wise Itinerary</h4>", ["Inclusions</h5>", "Exclusions</h5>"]))[1:]:
        badge = re.search(r'<span class="badge[^"]*">(.*?)</span>(.*?)</button>', it, re.S)
        body = re.search(r'<div class="accordion-body[^"]*">(.*)', it, re.S)
        itin.append({
            "day": txt(badge.group(1)) if badge else "",
            "title": txt(badge.group(2)) if badge else "",
            "lines": lines(body.group(1)) if body else [],
        })
    inc = block(m, r"Inclusions</h5>", ["Exclusions</h5>", "Send Enquiry"])
    exc = block(m, r"Exclusions</h5>", ["Send Enquiry"])
    inclusions = [txt(x) for x in re.findall(r"<li[^>]*>(.*?)</li>", inc, re.S) if txt(x)]
    exclusions = [txt(x) for x in re.findall(r"<li[^>]*>(.*?)</li>", exc, re.S) if txt(x)]
    images = list(dict.fromkeys(re.findall(r"(https://vajraroutes\.com/uploads/packages/[^\"' )]+)", m)))
    side = m[m.find("Send Enquiry"):]
    prices = re.findall(r"₹([\d,]+(?:\.\d+)?)", side)
    off = re.search(r"(\d+)% OFF", m)
    meta = re.search(r'<meta name="description" content="([^"]*)"', s)
    dest_slug = next((k for k, v in destinations.items() if v.get("name") == dest_name), None)
    if not dest_slug:
        dest_slug = next((k for k, v in destinations.items() if slug in v.get("packages", [])), None)
    region = listing_region.get(slug) or (destinations.get(dest_slug, {}).get("region") if dest_slug else "Domestic")
    packages[slug] = {
        "slug": slug, "title": title, "duration": duration, "destination": dest_name, "destinationSlug": dest_slug,
        "type": ptype, "travellers": travellers, "region": region,
        "oldPrice": money(prices[0]) if len(prices) > 1 else None,
        "price": money(prices[1] if len(prices) > 1 else prices[0]) if prices else None,
        "off": int(off.group(1)) if off else None,
        "aboutHtml": clean_html(about), "excerpt": excerpts.get(slug, ""),
        "highlights": highlights, "itinerary": itin, "inclusions": inclusions, "exclusions": exclusions,
        "images": images, "metaDescription": html.unescape(meta.group(1)) if meta else "",
    }

for d in destinations.values():
    d["packages"] = [p for p in d.get("packages", []) if p in packages]

# ---------------- Blog ----------------
blog = {}
for name in ["blog", "blog_q_page-2", "blog_q_page-3"]:
    for b in re.split(r'(?=<div class="col[^"]*">)', main_of(rd(name))):
        m = re.search(r"vajraroutes\.com/blog/([a-z0-9-]{8,})", b)
        if not m or m.group(1) == "category":
            continue
        img = re.search(r"(https://vajraroutes\.com/uploads/blog/[^\"' )]+)", b)
        l = [x for x in lines(b) if x != "Read More"]
        if len(l) < 3 or m.group(1) in blog:
            continue
        blog[m.group(1)] = {"slug": m.group(1), "category": l[0], "date": l[1], "title": l[2],
                            "excerpt": l[3] if len(l) > 3 else "", "image": img.group(1) if img else None}
for kind, slug in slugs:
    if kind != "B":
        continue
    s = rd("blog__" + slug)
    if not s:
        continue
    m = main_of(s)
    post = blog.setdefault(slug, {"slug": slug})
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", m, re.S)
    post["title"] = txt(h1.group(1)) if h1 else post.get("title", slug)
    c = re.search(r'<div class="post-content[^"]*">(.*?)</div>\s*(?:<!--|<div class="(?:d-flex|mt-|border|tags|share))', m, re.S)
    if not c:
        c = re.search(r'<div class="post-content[^"]*">(.*)', m, re.S)
    post["contentHtml"] = clean_html(c.group(1)) if c else ""
    lead = re.search(r'<p class="lead[^"]*">(.*?)</p>', m, re.S)
    post["lead"] = txt(lead.group(1)) if lead else ""
    if not post.get("image"):
        img = re.search(r"(https://vajraroutes\.com/uploads/blog/[^\"' )]+)", m)
        post["image"] = img.group(1) if img else None
    meta = re.search(r'<meta name="description" content="([^"]*)"', s)
    post["metaDescription"] = html.unescape(meta.group(1)) if meta else post.get("excerpt", "")

# ---------------- Home ----------------
home = rd("home")
banners = []
for sl in re.split(r'<div class="swiper-slide"', home)[1:]:
    img = re.search(r"background-image:url\('([^']+)'\)", sl)
    tag = re.search(r'<span class="hero-tag">(.*?)</span>', sl, re.S)
    h1 = re.search(r"<h1>(.*?)</h1>", sl, re.S)
    btns = re.findall(r'<a href="([^"]+)" class="btn[^"]*">\s*(.*?)\s*</a>', sl, re.S)
    if img and h1:
        banners.append({"image": img.group(1), "tag": txt(tag.group(1)) if tag else "", "title": txt(h1.group(1)),
                        "buttons": [{"href": h.replace("/staging/", "/"), "label": txt(t)} for h, t in btns[:2]]})
testimonials = []
for t in re.split(r'class="testimonial-card', home)[1:]:
    q = re.search(r'["“](.*?)["”]\s*</', t, re.S)
    yt = re.search(r"(?:shorts/|youtu\.be/|embed/)([A-Za-z0-9_-]{6,})", t)
    l = lines(t)
    testimonials.append({"raw": l[:12], "video": yt.group(1) if yt else None})

# ---------------- FAQ page ----------------
faq_m = main_of(rd("faq"))
faq_groups = []
cur = None
for tok in re.finditer(r'<h[3-5][^>]*>((?:(?!<button).)*?)</h[3-5]>|<button class="accordion-button[^"]*"[^>]*>(.*?)</button>.*?<div class="accordion-body[^"]*">(.*?)</div>', faq_m, re.S):
    if tok.group(1) is not None and txt(tok.group(1)) and txt(tok.group(1)) != "Still Have Questions?":
        cur = {"title": txt(tok.group(1)), "items": []}
        faq_groups.append(cur)
    elif tok.group(2):
        if cur is None:
            cur = {"title": "General", "items": []}
            faq_groups.append(cur)
        cur["items"].append({"q": re.sub(r"^\d+\.\s*", "", txt(tok.group(2))), "a": clean_html(tok.group(3))})

# ---------------- Static pages ----------------
def page_lines(name):
    return lines(main_of(rd(name)))

def page_html(name):
    m = main_of(rd(name))
    m = re.sub(r'<section class="page-hero-section.*?</section>', "", m, flags=re.S)
    return clean_html(m)

gallery_m = main_of(rd("gallery"))
albums = [{"href": h, "image": i} for h, i in re.findall(r'href="(https://vajraroutes\.com/gallery/[^"]+)".*?src="([^"]+)"', gallery_m, re.S)]

data = {
    "banners": banners,
    "testimonials": testimonials,
    "destinations": list(destinations.values()),
    "packages": list(packages.values()),
    "blog": list(blog.values()),
    "faqGroups": faq_groups,
    "about": page_lines("about-us"),
    "contact": page_lines("contact-us"),
    "gallery": {"lines": page_lines("gallery"), "albums": albums},
    "itineraryBuilder": page_lines("itinerary-builder"),
    "policies": {k: page_html(k) for k in ["privacy-policy", "terms-and-conditions", "refund-policy"]},
}
json.dump(data, open(OUT, "w"), ensure_ascii=False, indent=1)
print("destinations", len(destinations), "packages", len(packages), "blog", len(blog),
      "faq", sum(len(g["items"]) for g in faq_groups), "banners", len(banners), "albums", len(albums))
