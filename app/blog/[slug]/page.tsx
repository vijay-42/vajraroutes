import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.metaDescription || p.excerpt, openGraph: p.image ? { images: [p.image] } : undefined } : {};
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const recent = posts.filter((x) => x.slug !== p.slug).slice(0, 5);

  return (
    <div className="container article-wrap">
      <article className="article">
        <nav className="crumbs crumbs--dark" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">›</span>
          <Link href="/blog">Blog</Link><span aria-hidden="true">›</span>
          <span aria-current="page">{p.title}</span>
        </nav>
        <p className="article__meta">{p.category} · {p.date}</p>
        <h1>{p.title}</h1>
        {p.image && (
          <div className="article__img"><Image src={p.image} alt={p.title} fill priority sizes="(max-width: 900px) 100vw, 800px" /></div>
        )}
        {p.lead && <p className="article__lead">{p.lead}</p>}
        <div className="rich" dangerouslySetInnerHTML={{ __html: p.contentHtml ?? "" }} />
      </article>
      <aside className="article__side">
        <div className="box">
          <h3 className="dside__title">Recent Posts</h3>
          <ul className="recent">
            {recent.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`}>
                  {r.image && <Image src={r.image} alt="" width={84} height={60} />}
                  <span><strong>{r.title}</strong><small>{r.date}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
