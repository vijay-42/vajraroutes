import { notFound } from "next/navigation";
import PackageDetail, { packageMetadata } from "@/components/PackageDetail";
import { packageAt, packageParams } from "@/lib/content";

type Props = { params: Promise<{ slug: string; pkg: string }> };
const BASE = "/domestic-tours";

export function generateStaticParams() {
  return packageParams(BASE).map((x) => ({ slug: x.dest, pkg: x.pkg }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, pkg } = await params;
  return packageMetadata(packageAt(BASE, slug, pkg));
}

export default async function Page({ params }: Props) {
  const { slug, pkg } = await params;
  const p = packageAt(BASE, slug, pkg);
  if (!p) notFound();
  return <PackageDetail p={p} />;
}
