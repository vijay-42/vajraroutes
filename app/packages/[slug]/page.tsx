import { notFound, permanentRedirect } from "next/navigation";
import { getPackage, packageHref } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

/** Old /packages/{slug} links → the package's region/destination URL. */
export default async function OldPackageUrl({ params }: Props) {
  const p = getPackage((await params).slug);
  if (!p) notFound();
  permanentRedirect(packageHref(p));
}
