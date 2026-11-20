import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { home } from "@/data/site";
import { posts } from "@/lib/content";

export const metadata: Metadata = { title: "Travel Blog" };

const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const list = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <>
      <PageHero title={home.blog.title} sub={home.blog.sub} crumbs={[{ label: "Blog" }]} />
      <section className="section">
        <div className="container">
          <div className="tabs">
            <Link href="/blog" className={!category ? "is-active" : ""}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={category === c ? "is-active" : ""}>{c}</Link>
            ))}
          </div>
          <div className="grid grid--blog">
            {list.map((p) => (
              <Link key={p.slug} className="post" href={`/blog/${p.slug}`}>
                <div className="post__img">{p.image && <Image src={p.image} alt={p.title} width={600} height={375} />}</div>
                <small>{p.category} · {p.date}</small>
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
