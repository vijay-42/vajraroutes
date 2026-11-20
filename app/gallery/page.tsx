import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { gallery } from "@/lib/content";

export const metadata: Metadata = { title: "Gallery" };

// The live gallery lists one album ("Mysore", 2 photos).
const albumName = gallery.lines[gallery.lines.length - 1];
const albumCount = gallery.lines.find((l) => /photos?$/.test(l)) ?? "";

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Photo Gallery" sub="Explore our photo collections by destination" crumbs={[{ label: "Gallery" }]} />
      <section className="section">
        <div className="container">
          <div className="shead"><div><h2>Photo Albums</h2></div></div>
          <div className="grid grid--tile">
            {gallery.albums.map((a) => (
              <div key={a.image} className="tile">
                <Image src={a.image} alt={albumName} fill sizes="(max-width: 640px) 50vw, 280px" />
                <strong>{albumName}<small>{albumCount}</small></strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
